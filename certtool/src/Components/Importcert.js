import React from "react";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import GetCertificate from "./GetCertificate";
import UploadFile from "./UploadFile";

const ImportCert = () => {
  return (
    <div>
      <nav>
        <h1>Import certificate</h1>
      </nav>
      <UploadFile />
      <GetCertificate />
    </div>
  );
};

export default ImportCert;
