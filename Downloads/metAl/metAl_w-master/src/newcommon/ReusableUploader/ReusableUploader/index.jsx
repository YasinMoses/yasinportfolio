import { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Progress,
} from "reactstrap";
import { Panel, PanelBody } from "../../components/panel/panel";
import FilePreview from "../../pages/ticket/BasicInfoFields/FilePreview";
import { ToastContainer } from "react-toastify";
import { useDropzone } from "react-dropzone";
import {
  Button,
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import Delete from "@material-ui/icons/Delete";
import { formatBytes } from "react-dropzone-uploader";
import { CameraFeed } from "./cameraFeed";

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

  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    init: function () {
      this.hiddenFileInput.setAttribute("webkitdirectory", true);
    },

    onDrop: (acceptedFiles) => {
      acceptedFiles.map((file) => setFiles((fls) => [...fls, file]));
    },
  });

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
  // useEffect(() => {
  //   onChangeHandler(files);
  // }, [files]);

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
            {/* <Uploader setFiles={setFiles} onChangeHandler={onChangeHandler} /> */}
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
              type="submit"
              onClick={(e) => onClickHandler(e, files)}
            >
              <i className="far fa-save"></i>
            </button>
          </ModalFooter>
        </Modal>

        <FilePreview
          selectedFile={selectedFile}
          removeFile={removeFile}
          handleDelete={handleDelete}
        />
      </PanelBody>
    </Panel>
  );
}
