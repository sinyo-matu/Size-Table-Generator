import { useAtom } from "jotai";
import React from "react";
import styled from "styled-components";
import { statusInfoAtom } from "../lib/store";
import { Color } from "../styles/Color";
import { StatusInfoType } from "../types";

export const StatusPanel = () => {
  const [statusInfo] = useAtom(statusInfoAtom);

  return (
    <Wrapper type={statusInfo.type}>
      <StatusInfo type={statusInfo.type}>{statusInfo.content}</StatusInfo>
    </Wrapper>
  );
};

interface Props {
  type?: StatusInfoType;
}

const Wrapper = styled.div<Props>`
  padding: 2px 1rem;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1.5rem;
  min-width: 150px;
  left: 50%;
  top: 0;
  border: 2px solid ${(props) => matchProps(props.type)};
  border-radius: 9999px;
  transform: translateX(-50%) translateY(10px);
  background-color: white;
  transition: 1s;
  --webkit-transition: 1s;
`;
const StatusInfo = styled.div<Props>`
  color: ${(props) => matchProps(props.type!)};
`;

function matchProps(type: StatusInfoType | undefined) {
  if (!type) return Color.EliamoGold;
  switch (type) {
    case "error":
      return Color.MAIN;
    default:
      return Color.EliamoGold;
  }
}
