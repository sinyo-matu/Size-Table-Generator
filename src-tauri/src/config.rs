use crate::{Result, APP_IDENTIFIER};
use serde::Deserialize;
use std::{fs::File, io::BufReader};
use tauri::api::path::config_dir;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
  pub deepl_api_key: String,
}

pub fn load_config() -> Result<Config> {
  let mut base = config_dir().unwrap();
  base.push(APP_IDENTIFIER);
  base.push("config");
  base.set_extension("json");
  let file = File::open(base)?;

  Ok(serde_json::from_reader(BufReader::new(file))?)
}
