import React from "react";
import { Table } from "./Table";
import { ItemTable } from "../../types";
import Base from "../../styles/styleAtoms/ColumnFlexWrapper";
import { TableTitle } from "../../styles/styleAtoms/Table";
import styled from "styled-components";

export const SizeTable = ({ id, data }: { id: string; data: ItemTable }) => {
  return (
    <Wrapper id={id}>
      <TableTitle>尺码表</TableTitle>
      <Table>
        <Table.Head>
          <Table.TR>
            {data.head.map((head) => (
              <Table.TH>{head}</Table.TH>
            ))}
          </Table.TR>
        </Table.Head>
        <Table.Body>
          {data.body.map((body) => (
            <Table.TR>
              {body.map((cell) => (
                <Table.TH>{cell}</Table.TH>
              ))}
            </Table.TR>
          ))}
        </Table.Body>
      </Table>
    </Wrapper>
  );
};

const Wrapper = styled(Base)`
  padding-bottom: 5px;
`;
