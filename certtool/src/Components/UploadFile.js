import React, { useState, useEffect, useContext } from "react";
import Dropzone from "react-dropzone";
import { getFiles, uploadFile } from "../services/upload-files.service";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ImportContext } from "../services/importContext";

const UploadFile = () => {
  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [currentFile, setCurrentFile] = useState(undefined);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const [fileInfos, setFileInfos] = useState([]);
  const { state, setState } = useContext(ImportContext);

  const upload = () => {
    let currentFile = selectedFiles[0];

    setProgress(0);
    //setState(currentFile);

    uploadFile(currentFile, (event) => {
      setProgress(Math.round((100 * event.loaded) / event.total));
    })
      .then((response) => {
        setMessage(response.data.message);
        setState(response.data.filepath);
        console.log("setuploadedfile: " + response.data.message);
        console.log("filepath: " + response.data.filepath);
        return getFiles();
      })
      .then((files) => {
        setFileInfos(files.data);
      })
      .catch((e) => {
        setProgress(0);
        setMessage("Could not upload the file!" + e);
      });

    setSelectedFiles(undefined);
  };

  const onDrop = (files) => {
    console.log("onDrop: " + files[0].name);
    if (files.length > 0) {
      setSelectedFiles(files);
      //upload();
    }
  };

  useEffect(() => {
    console.log("useEffect upload");
    getFiles().then((response) => {
      setFileInfos(response.data);
    });
  }, []);

  return (
    <div>
      {currentFile && (
        <div className="progress mb-3">
          <div
            className="progress-bar progress-bar-info progress-bar-striped"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
            style={{ width: progress + "%" }}
          >
            {progress}%
          </div>
        </div>
      )}

      <Dropzone onDrop={onDrop} multiple={false}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps({ className: "dropzone" })}>
              <input {...getInputProps()} />
              {selectedFiles && selectedFiles[0].name ? (
                <div className="selected-file">
                  {selectedFiles && selectedFiles[0].name}
                </div>
              ) : (
                "Drag and drop file here, or click to select file"
              )}
            </div>
            <aside className="selected-file-wrapper">
              <button
                className="btn btn-success"
                disabled={!selectedFiles}
                onClick={upload}
              >
                Upload
              </button>
            </aside>
          </section>
        )}
      </Dropzone>

      <div className="alert alert-light" role="alert">
        {message}
      </div>
    </div>
  );
};

export default UploadFile;
