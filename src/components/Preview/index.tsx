import { useAtom } from "jotai";
import React from "react";
import styled from "styled-components";
import { showLoadingLogoAtom, statusInfoAtom } from "../../lib/store";
import { FadeInAndOutLoop } from "../../styles/animation";
import WrapperBase from "../../styles/styleAtoms/ColumnFlexWrapper";
import { ListView } from "./ListView";
import Logo from "../../LOGO512.png";
import { StatusPanel } from "../StatusPanel";

export const Preview = () => {
  const [statusInfo] = useAtom(statusInfoAtom);
  const [showLoadingLogo] = useAtom(showLoadingLogoAtom);
  return (
    <Wrapper>
      {showLoadingLogo ? (
        <>
          <LogoWrapper src={Logo} alt="logo" />
        </>
      ) : null}
      <ListView />
      {statusInfo.content !== "done" ? <StatusPanel /> : null}
    </Wrapper>
  );
};

const Wrapper = styled(WrapperBase)`
  height: 100%;
  width: 100%;
`;

const LogoWrapper = styled.img`
  position: absolute;
  width: 64px;
  right: 0px;
  bottom: 0px;
  transform: translateX(-20px) translateY(-20px);
  ${FadeInAndOutLoop}
`;
