import { createDir, readDir, writeBinaryFile } from "@tauri-apps/api/fs";
import html2canvas from "html2canvas";

export async function saveElementToPath(elementId: string, dest: string) {
  const canvas = await html2canvas(document.querySelector(`#${elementId}`)!);
  canvas.toBlob(async (blob) => {
    const buf = await blob?.arrayBuffer();
    await writeBinaryFile({ contents: new Uint8Array(buf!), path: dest });
  });
}

// if dir exists return true, otherwise create the dir return false
export async function checkDirThenCreate(dir: string) {
  try {
    await readDir(dir, { recursive: true });
    return true;
  } catch {
    createDir(dir, { recursive: true });
    return false;
  }
}
