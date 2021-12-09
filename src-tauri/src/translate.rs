use std::collections::HashMap;

use serde::Deserialize;
use tauri::api::http::{ClientBuilder, HttpRequestBuilder, ResponseType};

use serde_json::from_value;

#[derive(Debug, Deserialize, PartialEq)]
pub struct TranslatedText {
  /// Source language. Holds the value provided, or otherwise the value that DeepL auto-detected.
  pub detected_source_language: String,
  /// Translated text.
  pub text: String,
}

// Only needed for JSON deserialization.
#[derive(Debug, Deserialize)]
struct TranslatedTextList {
  translations: Vec<TranslatedText>,
}

pub async fn translate_texts(content: impl AsRef<[String]>) -> Result<Vec<String>, String> {
  let client = ClientBuilder::new().build().unwrap();
  let mut query_base = vec![
    ("target_lang", "ZH"),
    ("source_lang", "JA"),
    ("split_sentences", "0"),
    ("preserve_formatting", "1"),
    ("auth_key", "2f1cbb0a-a7ea-eb8c-6332-0cf2077effad:fx"),
  ];
  for text in content.as_ref() {
    query_base.push(("text", text))
  }
  let mut query: HashMap<String, String> = HashMap::new();
  for (k, v) in query_base {
    query.insert(k.into(), v.into());
  }
  let request = HttpRequestBuilder::new("post", "https://api-free.deepl.com/v2/translate")
    .query(query)
    .response_type(ResponseType::Json);

  let res = client
    .send(request)
    .await
    .map_err(|_| "http connection Error".to_string())?;
  let res_data = res
    .read()
    .await
    .map_err(|_| "http not response data error".to_string())?
    .data;
  let translated: TranslatedTextList =
    from_value(res_data).map_err(|_| "deserialize data error".to_string())?;
  Ok(
    translated
      .translations
      .iter()
      .map(|trans| escape_text(&trans.text))
      .collect(),
  )
}

fn escape_text(input: &str) -> String {
  input.replace("车身宽度", "体宽").replace("YUKI", "臂展")
}
