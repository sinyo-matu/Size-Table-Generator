import React from "react";
import {
  StyledTable,
  THead,
  TBody,
  TFoot,
  TH,
  TR,
  TD,
} from "../../styles/styleAtoms/Table";

interface TableProp {
  children: React.ReactNode;
  rest?: { [x: string]: any };
}

export const Table = ({ children, ...rest }: TableProp) => {
  return <StyledTable {...rest}>{children}</StyledTable>;
};
Table.Head = ({ children, ...rest }: TableProp) => {
  return <THead {...rest}>{children}</THead>;
};

Table.Body = ({ children, ...rest }: TableProp) => {
  return <TBody {...rest}>{children}</TBody>;
};

Table.Foot = ({ children, ...rest }: TableProp) => {
  return <TFoot {...rest}>{children}</TFoot>;
};

Table.TH = ({ children, ...rest }: TableProp) => {
  return <TH {...rest}>{children}</TH>;
};

Table.TR = ({ children, ...rest }: TableProp) => {
  return <TR {...rest}>{children}</TR>;
};

Table.TD = ({ children, ...rest }: TableProp) => {
  return <TD {...rest}>{children}</TD>;
};
