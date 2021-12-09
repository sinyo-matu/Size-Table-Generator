import React from "react";
import styled from "styled-components";
import { ControlPanel } from "./components/ControlPanel";
import { Preview } from "./components/Preview";
import { Color } from "./styles/Color";

export const Layout = () => {
  return (
    <Wrapper>
      <Preview />
      <ControlPanel />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 7fr 3fr;
  overflow: hidden;
  background-color: ${Color.Default};
`;
