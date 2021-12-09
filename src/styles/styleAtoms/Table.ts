import styled from "styled-components";
import { Color } from "../Color";

export const StyledTable = styled.table`
  font-family: "Noto Sans SC", sans-serif;
  border: 1px solid ${Color.MAIN};
  border-spacing: 0px;
  border-radius: 5px;
`;

export const THead = styled.thead`
  color: ${Color.MAIN};
  border-bottom: 1px solid ${Color.MAIN};
`;

export const TFoot = styled.tfoot``;

export const TBody = styled.tbody``;

export const TR = styled.tr`
  min-width: 3rem;
  padding: 0.3rem;
`;

export const TH = styled.th`
  min-width: 3rem;
  padding: 0.3rem;
`;

export const TD = styled.td``;

export const TableTitle = styled.div`
  font-size: 1.5rem;
  font-style: bold;
  font-family: "Noto Sans SC", sans-serif;
`;
