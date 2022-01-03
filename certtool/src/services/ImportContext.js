import React, { createContext, useState } from "react";

export const ImportContext = createContext();

export const ImportProvider = (props) => {
  const [certificate, setCertificate] = useState({
    selectedFiles: undefined,
    currentFile: undefined,
    progress: 0,
    message: "",
    fileInfos: [],
  });

  return <ImportContext.Provider>{props.children}</ImportContext.Provider>;
};
