import React, { useState, useMemo } from "react";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import GetCertificate from "./GetCertificate";
import UploadFile from "./UploadFile";
import { ImportContext } from "../services/importContext";

const ImportCert = () => {
  const [state, setState] = useState(null);

  const providerValue = useMemo(() => ({ state, setState }), [state, setState]);

  return (
    <div className="container">
      <nav>
        <h2>Import certificate</h2>
      </nav>
      <ImportContext.Provider className="container" value={providerValue}>
        <UploadFile />
        {state && <GetCertificate />}
      </ImportContext.Provider>
    </div>
  );
};

export default ImportCert;
