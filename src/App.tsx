import { getVersion } from "@tauri-apps/api/app";
import { useAtom } from "jotai";
import React, { useEffect, useRef } from "react";
import "./App.css";
import { Layout } from "./Layout";
import { appVersionAtom } from "./lib/store";

function App() {
  const [, setAppVersion] = useAtom(appVersionAtom);
  const setAppVersionRef = useRef<typeof setAppVersion>();
  setAppVersionRef.current = setAppVersion;
  useEffect(() => {
    const setAppV = async () => {
      const v = await getVersion();
      setAppVersionRef.current!(v);
    };
    setAppV();
  }, []);

  return (
    <div className="App">
      <Layout />
    </div>
  );
}

export default App;
