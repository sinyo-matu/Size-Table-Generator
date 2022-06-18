use std::sync::Arc;

use calamine::{open_workbook, Reader, Xlsx};
use itertools::Itertools;
use phdb_translate::TranslateClient;
use serde::Serialize;
use std::sync::Mutex;

use crate::{Error, Result};

#[derive(Serialize)]
pub struct ProcessResponse {
  item_meta: Vec<ItemMeta>,
}

struct ItemInfo {
  code: String,
  size_code: String,
  size_text: String,
}

#[derive(Debug, Serialize)]
struct ItemTable {
  head: Vec<String>,
  body: Vec<Vec<String>>,
}

#[derive(Debug, Serialize)]
struct ItemMeta {
  code: String,
  size_code: String,
  table: ItemTable,
}

#[derive(Serialize, Clone)]
struct ProcessingStatePayload {
  state: String,
}

type SharedTranslateClient = Arc<Mutex<TranslateClient>>;

#[tauri::command]
pub fn process_excel_file(
  window: tauri::Window,
  translate_client: tauri::State<'_, SharedTranslateClient>,
  excel_path: String,
) -> std::result::Result<ProcessResponse, String> {
  println!("command invoked");
  window
    .emit(
      "update-state",
      ProcessingStatePayload {
        state: "processing file".into(),
      },
    )
    .map_err(Error::Tauri)?;

  let mut excel_file: Xlsx<_> = open_workbook(excel_path).map_err(|_| Error::ExcelRead)?;
  let items_code_sheet = excel_file
    .worksheet_range_at(0)
    .ok_or(Error::EmptyFile)?
    .map_err(|_| Error::EmptyFile)?;
  let (item_code_idx, size_code_idx, size_text_idx) = items_code_sheet
    .rows()
    .next()
    .ok_or(Error::EmptyFile)?
    .iter()
    .enumerate()
    .filter_map(|(i, cell)| check_column(i, cell.to_string()).ok())
    .collect_tuple()
    .ok_or(Error::InvalidSheetFormat)?;
  let items_code_unique = items_code_sheet
    .rows()
    .skip(1)
    .map(|row| row[item_code_idx].to_string().replace(' ', "_"))
    .unique();
  let item_code_size_unique = items_code_sheet
    .rows()
    .skip(1)
    .unique_by(|row| {
      (
        row[item_code_idx].to_string(),
        row[size_code_idx].to_string(),
      )
    })
    .collect_vec();
  let size_text_unique = items_code_sheet
    .rows()
    .skip(1)
    .unique_by(|row| {
      (
        row[item_code_idx].to_string(),
        row[size_code_idx].to_string(),
      )
    })
    .map(|row| row[size_text_idx].to_string())
    .collect_vec();
  window
    .emit(
      "update-state",
      ProcessingStatePayload {
        state: "translating".into(),
      },
    )
    .unwrap();
  let mut local_client = translate_client.lock().unwrap();
  let size_text_unique_zh = local_client.translate(&size_text_unique).unwrap();
  window
    .emit(
      "update-state",
      ProcessingStatePayload {
        state: "processing file".into(),
      },
    )
    .unwrap();
  let item_code_size_data = items_code_unique
    .map(|code| {
      item_code_size_unique
        .iter()
        .zip(size_text_unique_zh.iter())
        .filter(|(row, _)| row[item_code_idx].to_string().replace(' ', "_") == code)
        .map(|(row, size_text_zh)| ItemInfo {
          code: row[item_code_idx].to_string().replace(' ', "_"),
          size_code: get_size_code(row[size_code_idx].to_string().as_str()),
          size_text: size_text_zh.to_owned(),
        })
        .collect::<Vec<_>>()
    })
    .collect::<Vec<_>>();
  let mut item_meta = Vec::new();
  for item_infos in item_code_size_data {
    let item_code = item_infos[0].code.clone();
    let mut table_head = item_infos[0]
      .size_text
      .replace('：', ":")
      .replace(": ", ":")
      .split_whitespace()
      .map(|s| s.split(':').collect_vec()[0].to_string())
      .collect::<Vec<_>>();
    table_head.insert(0, String::from("尺码"));
    let table_body = item_infos
      .iter()
      .map(|item_info| {
        let mut size_row_raw = item_info
          .size_text
          .replace('：', ":")
          .replace(": ", ":")
          .split_whitespace()
          .map(|s| s.split(':').collect_vec()[1].to_string())
          .collect::<Vec<_>>();
        size_row_raw.insert(0, item_info.size_code.to_owned());
        size_row_raw
      })
      .collect::<Vec<_>>();
    let table = ItemTable {
      head: table_head,
      body: table_body,
    };
    item_meta.push(ItemMeta {
      code: item_code,
      size_code: item_infos[0].size_code.clone(),
      table,
    });
  }
  Ok(ProcessResponse { item_meta })
}

fn check_column(i: usize, s: impl AsRef<str>) -> Result<usize> {
  match s.as_ref() {
    "品番" | "SZ" | "採寸" => Ok(i),
    _ => Err(Error::InvalidSheetFormat),
  }
}

fn get_size_code(num_str: &str) -> String {
  match num_str {
    "1" => String::from("XS"),
    "2" => String::from("S"),
    "3" => String::from("M"),
    "4" => String::from("L"),
    "5" => String::from("XL"),
    "6" => String::from("XXL"),
    "7" => String::from("XXXL"),
    "8" => String::from("XXXXL"),
    _ => String::from("均码"),
  }
}
