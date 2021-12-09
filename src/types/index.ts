export interface ProcessResponse {
  item_meta: ItemMeta[];
}

export interface ItemMeta {
  code: string;
  size_code: string;
  table: ItemTable;
}

export interface ItemTable {
  head: string[];
  body: string[][];
}

export type StatusInfoType = "normal" | "error";

export type StatusInfoContent = "文件处理中" | "翻译中" | "done" | string;
export interface ProcessStatePayload {
  state: StatusInfoContent;
}

export interface StatusInfo {
  type: StatusInfoType;
  content: StatusInfoContent;
}

export type CommandInvokeError =
  | "请选择打开Excel文件"
  | "文件是空文件"
  | "请打开格式正确的Excel文件"
  | "翻译失败";
