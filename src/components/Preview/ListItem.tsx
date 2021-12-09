import React from "react";
import styled from "styled-components";
import { ItemMeta } from "../../types";
import { SizeTable } from "./SizeTable";
import CodeWrapper from "../../styles/styleAtoms/ColumnFlexWrapper";

export const ListItem = ({ itemMeta }: { itemMeta: ItemMeta }) => {
  return (
    <Wrapper>
      <CodeWrapper>商品号：{itemMeta.code}</CodeWrapper>
      <SizeTable id={`${itemMeta.code}`} data={itemMeta.table} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 3fr 7fr;
  justify-content: center;
  align-items: center;
`;
