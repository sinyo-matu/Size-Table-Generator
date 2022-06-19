#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod config;
mod custom_command;

use phdb_translate::TranslateClient;
use std::{ops::Deref, sync::Arc};
use tauri::async_runtime::Mutex;

use custom_command::process_excel_file;

pub const APP_IDENTIFIER: &str = "Size Table Generator";

fn main() {
  let translate_client = tauri::async_runtime::block_on(TranslateClient::new()).unwrap();
  let client = Arc::new(Mutex::new(translate_client));
  tauri::Builder::default()
    .manage(client)
    .setup(|app| {
      let path_base = tauri::api::path::app_dir(app.config().deref()).unwrap();
      if tauri::api::dir::is_dir(&path_base).is_err() {
        std::fs::create_dir(path_base).unwrap();
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![process_excel_file])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

pub enum Error {
  Tauri(tauri::Error),
  ExcelRead,
  EmptyFile,
  InvalidSheetFormat,
  Translation(phdb_translate::Error),
  SystemIO(std::io::Error),
  SerdeJson(serde_json::Error),
}

impl From<tauri::Error> for Error {
  fn from(e: tauri::Error) -> Self {
    Self::Tauri(e)
  }
}

impl From<phdb_translate::Error> for Error {
  fn from(e: phdb_translate::Error) -> Self {
    Self::Translation(e)
  }
}

impl From<std::io::Error> for Error {
  fn from(e: std::io::Error) -> Self {
    Self::SystemIO(e)
  }
}

impl From<serde_json::Error> for Error {
  fn from(e: serde_json::Error) -> Self {
    Self::SerdeJson(e)
  }
}

impl From<Error> for String {
  fn from(e: Error) -> Self {
    match e {
      Error::Tauri(_) => String::from("后台程序错误"),
      Error::EmptyFile => String::from("文件是空文件"),
      Error::ExcelRead => String::from("请选择需要打开的Excel文件"),
      Error::InvalidSheetFormat => String::from("请打开格式正确的Excel文件"),
      Error::Translation(_) => String::from("翻译失败"),
      Error::SystemIO(_) => String::from("设定文件读取错误"),
      Error::SerdeJson(e) => {
        println!("error:{}", e);
        String::from("设定文件解析错误")
      }
    }
  }
}

pub type Result<T> = std::result::Result<T, Error>;
