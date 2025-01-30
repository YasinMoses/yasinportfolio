import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
// import { uploadFile } from "../Redux/actions/filemanager";
// import { formatBytes } from "react-dropzone-uploader";
// import File from "@material-ui/icons/InsertDriveFile";
// import Delete from "@material-ui/icons/Delete";
import { List } from "@material-ui/core";
import BabyUploadComponents from "./BabyUploadComponents";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  acceptedFiles: {
    fontSize: "12px",
    padding: "0px",
    margin: "0px",
  },
  container: {
    border: "1px solid #868DAA",
    borderTop: "none",
    borderRadius: "5px",
    "& .dropzone": {
      flex: "1",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "50px 20px",
      borderWidth: "2px",
      borderRadius: "2px",
      borderStyle: "dashed",
      color: "#bdbdbd",
      cursor: "pointer",
      outline: "none",
      transition: "border .24s ease-in-out",
      "&:focus": {
        borderColor: "#0492f2",
      },
      "& p": {
        padding: "0px",
        margin: "0px",
      },
    },
  },
}));

const Uploader = ({ setModalDialog }) => {
  const classes = useStyles();
  const [files, setFiles] = useState([]);
  const { selectedFolder } = useSelector((store) => store.filemanager);
  const { getRootProps, getInputProps } = useDropzone({
    init: function () {
      this.hiddenFileInput.setAttribute("webkitdirectory", true);
    },

    onDrop: (acceptedFiles) => {
      acceptedFiles.map((file) => setFiles((fls) => [...fls, file]));
    },
  });

  const removeFile = (index) => {
    var newFiles = [...files];
    newFiles.splice(index, 1);
    console.log(newFiles, files);
    setFiles(newFiles);
  };

  const acceptedFiles = files.map((file, index) => (
    <BabyUploadComponents
      key={index}
      file={file}
      index={index}
      removeFile={(i) => removeFile(i)}
      path={selectedFolder}
    />
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <>
      <section className={classes.container}>
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        <List>{acceptedFiles}</List>
      </section>
      <div className="mt-3">
        <button className="btn btn-white" onClick={() => setModalDialog(false)}>
          Close
        </button>
        <button
          className="btn btn-success"
          onClick={() => setFiles([])}
          disabled={files.length === 0}
        >
          Clear
        </button>
      </div>
    </>
  );
};
export default Uploader;
