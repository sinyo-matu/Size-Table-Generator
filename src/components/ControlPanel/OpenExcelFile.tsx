import React, { useState } from "react";
import RowFlex from "../../styles/styleAtoms/RowFlexWrapper";
import ColumnFlex from "../../styles/styleAtoms/ColumnFlexWrapper";
import { open } from "@tauri-apps/api/dialog";
import { listen, Event } from "@tauri-apps/api/event";
import {
  CommandInvokeError,
  ProcessResponse,
  ProcessStatePayload,
} from "../../types";
import { useAtom } from "jotai";
import {
  itemMetasAtom,
  showLoadingLogoAtom,
  statusInfoAtom,
} from "../../lib/store";
import { invoke } from "@tauri-apps/api";
import { Button } from "./Button";
import styled from "styled-components";
import { Color } from "../../styles/Color";
import { triggerTempStatusPanel, trimHomePath } from "../../lib/utility";

export const OpenExcelFile = () => {
  const [, setItemMetas] = useAtom(itemMetasAtom);
  const [, setShowLoadingLogo] = useAtom(showLoadingLogoAtom);
  const [, setStatusInfo] = useAtom(statusInfoAtom);
  const [filePath, setFilePath] = useState("");
  const handleOpenFileOnClick = async () => {
    const path = await open();
    if (!path) return;
    const trimmedPath = await trimHomePath(path as string);
    setFilePath(trimmedPath);
    const unlisten = await listen(
      "update-state",
      (event: Event<ProcessStatePayload>) => {
        switch (event.payload.state) {
          case "processing file":
            setStatusInfo({ type: "normal", content: "文件处理中" });
            break;
          case "translating":
            setStatusInfo({ type: "normal", content: "翻译中" });
            break;
        }
      }
    );
    setShowLoadingLogo(true);
    const res = await invoke<ProcessResponse>("process_excel_file", {
      excelPath: path,
    }).catch((err: CommandInvokeError) => {
      triggerTempStatusPanel(setStatusInfo, "error", err);
    });
    unlisten();
    setShowLoadingLogo(false);
    if (!res) {
      setFilePath("");
      return;
    }
    setStatusInfo({ type: "normal", content: "done" });
    setItemMetas(res!.item_meta);
  };
  return (
    <Wrapper>
      <RowWrapper>
        <Button onClick={handleOpenFileOnClick}>打开源文件</Button>
      </RowWrapper>
      <RowWrapper>
        <Text>现正打开：{filePath}</Text>
      </RowWrapper>
    </Wrapper>
  );
};

const Wrapper = styled(ColumnFlex)`
  width: 80%;
  max-width: 300px;
  border: 0px solid;
  border-radius: 30px;
  background-color: ${Color.SUB};
  min-height: 100px;
`;

const RowWrapper = styled(RowFlex)`
  width: 100%;
  gap: 15px;
`;
const Text = styled.div`
  overflow-wrap: break-word;
  min-width: 70%;
  max-width: 90%;
`;
