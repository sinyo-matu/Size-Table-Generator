import { atom } from "jotai";
import { ItemMeta, StatusInfo } from "../types";

export const itemMetasAtom = atom<ItemMeta[]>([]);

export const tableIdsAtom = atom<string[]>((get) =>
  get(itemMetasAtom).map((itemMeta) => `${itemMeta.code}`)
);

export const saveDirAtom = atom<string>("");

export const statusInfoAtom = atom<StatusInfo>({
  type: "normal",
  content: "done",
});

export const showLoadingLogoAtom = atom<boolean>(false);

export const appVersionAtom = atom<string>("");
