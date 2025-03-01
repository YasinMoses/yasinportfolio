import { useCallback, useEffect, useState, forwardRef } from "react";
import * as React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Progress,
} from "reactstrap";
import { Panel, PanelBody } from "../../components/panel/panel";
import FilePreview from "./FilePreview";
import { ToastContainer } from "react-toastify";
import { useDropzone } from "react-dropzone";
import {
  Button,
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  // MuiAlert,
  Snackbar,
} from "@material-ui/core";
import Delete from "@material-ui/icons/Delete";
import { formatBytes } from "react-dropzone-uploader";
import { CameraFeed } from "./cameraFeed";

import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ReusableUploader({
  loaded,
  onChangeHandler,
  onClickHandler,
  selectedFile,
  removeFile,
  handleDelete,
}) {
  const [addAttachements, setAddAttachements] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessage] = useState("");

  const [files, setFiles] = useState([]);
  const [files1, setFiles1] = useState([...selectedFile]);
  const [progress, setProgress] = useState(0);
  const onUploadProgress = (event) => {
    setProgress(Math.round((100 * event.loaded) / event.total));
  };
  console.log(progress);
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const { getRootProps, getInputProps } = useDropzone({
    init: function () {
      this.hiddenFileInput.setAttribute("webkitdirectory", true);
    },

    onDrop: (acceptedFiles) => {
      acceptedFiles.map((file) => setFiles((fls) => [...fls, file]));
    },
  });

  if (progress == 100) {
    setTimeout(() => {
      setAddAttachements(false);
      setProgress(0);
      setMessage("File Uploaded Successfully!");
      handleClick();
    }, 1000);
  }

  useEffect(() => {
    setFiles1([...selectedFile]);
    console.log(files1);
  }, [selectedFile]);

  const removeFile1 = (index) => {
    var newFiles = [...files];
    newFiles.splice(index, 1);
    console.log(newFiles, files);
    setFiles(newFiles);
  };

  const sendFile = (file) => {
    setFiles((f) => [...f, file]);
    setIsOpen(false);
  };

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <Panel>
      <PanelBody>
        <h1>Attachments:</h1>
        <button
          className="btn btn-success"
          onClick={() => {
            setAddAttachements(!addAttachements);
          }}
        >
          Add attachments
        </button>

        <Modal
          isOpen={addAttachements}
          toggle={() => {
            setAddAttachements(!addAttachements);
            setFiles([]);
          }}
        >
          <ModalHeader
            toggle={() => {
              setAddAttachements(!addAttachements);
            }}
          >
            Upload
          </ModalHeader>
          <ModalBody>
            <div {...getRootProps({ className: "dropzone" })}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <p>Or</p>
            {isOpen ? (
              <CameraFeed isOpen={isOpen} sendFile={sendFile} />
            ) : (
              <Button onClick={() => setIsOpen(true)}>Take Photo</Button>
            )}
            <ToastContainer />
            {files.map((file, id) => (
              <ListItem key={id}>
                <ListItemText
                  primary={`${file.name} - ${formatBytes(file.size)}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={() => {
                      console.log("called");
                      removeFile1(id);
                    }}
                    edge="end"
                    aria-label="delete"
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
            <Progress max="100" color="success" value={progress}>
              {Math.round(progress, 2)}%
            </Progress>
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-red"
              title="Cancel"
              onClick={() => {
                setAddAttachements(!addAttachements);

                setFiles([]);
              }}
            >
              <i className="ion md-close"></i>Cancel
            </button>
            <button
              className="btn btn-green"
              title="Save the changes"
              disabled={files.length === 0}
              type="submit"
              onClick={(e) => {
                onClickHandler(e, files, onUploadProgress);
                setFiles([]);
              }}
            >
              <i className="far fa-save"></i>
            </button>
          </ModalFooter>
        </Modal>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            {messages}
          </Alert>
        </Snackbar>
        <FilePreview
          selectedFile={selectedFile}
          removeFile={removeFile}
          handleDelete={handleDelete}
          files={files1}
          setMessage={setMessage}
          handleClick={handleClick}
          setFiles={setFiles1}
        />
      </PanelBody>
    </Panel>
  );
}
