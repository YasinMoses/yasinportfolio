/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState, useEffect, useRef } from "react";
import BabyUploadComponents from "./BabyUploadComponents";

import {
  FullFileBrowser,
  setChonkyDefaults,
  ChonkyActions,
  FileToolbar,
  FileList,
  FileNavbar,
  FileContextMenu,
  defineFileAction,
  ChonkyIconName,
} from "chonky";
import { ChonkyIconFA } from "chonky-icon-fontawesome";
import {
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  FormGroup,
} from "reactstrap";
import Uploader from "./Uploader";
import DicomViewer from "./DicomViewer/DicomViewer";
import { createTheme, CssBaseline, MuiThemeProvider } from "@material-ui/core";
import indigo from "@material-ui/core/colors/indigo";
import pink from "@material-ui/core/colors/pink";
import { useDispatch, useSelector } from "react-redux";
import {
  createNewFolder,
  deleteItems,
  getFilesList,
  getFoldersList,
  renameFiles,
  setSelectedFolder,
} from "../Redux/actions/filemanager";
// import { apiUrl } from "../../../config/config.json";

import FileManagerSidebar from "./FileManagerSidebar";
import { useHistory } from "react-router";
import { saveAs } from "file-saver";
import WebCam from "react-webcam";

const apiUrl = process.env.REACT_APP_API_URL;

setChonkyDefaults({ iconComponent: ChonkyIconFA });
const theme = createTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: indigo,
    secondary: pink,
    type: "light",
  },
});
const renameFile = defineFileAction({
  id: "rename",
  button: {
    name: "Rename",
    toolbar: false,
    contextMenu: true,
    icon: ChonkyIconName.placeholder,
  },
});
const getLink = defineFileAction({
  id: "get_link",
  button: {
    name: "Get Link",
    toolbar: false,
    contextMenu: true,
    icon: ChonkyIconName.share,
  },
});
const archiveFiles = defineFileAction({
  id: "archive_files",
  button: {
    name: "Archive Files",
    toolbar: false,
    contextMenu: true,
    icon: ChonkyIconName.archive,
  },
});
const refreshFiles = defineFileAction({
  id: "refresh_files",
  button: {
    name: "Refresh",
    toolbar: true,
    contextMenu: true,
    icon: ChonkyIconName.loading,
  },
});
const deepResearch = defineFileAction({
  id: "deep_research",
  button: {
    name: "Deep research",
    toolbar: false,
    contextMenu: true,
    icon: ChonkyIconName.search,
  },
});
const metaInfo = defineFileAction({
  id: "meta_info",
  button: {
    name: "Meta Info",
    toolbar: false,
    contextMenu: true,
    icon: ChonkyIconName.info,
  },
});
const FileManagerContainer = () => {
  const dispatch = useDispatch();
  const [modalDialog, setModalDialog] = useState(false);
  const [dicomModalDialog, setDicomModalDialog] = useState(false);
  const [renameModalDialog, setRenameModalDialog] = useState(false);
  const [createFolderModalDialog, setCreateFolderModalDialog] = useState(false);
  const [actionLoader, setActionLoader] = useState(false);
  const history = useHistory();

  const toggleModal = () => {
    setModalDialog((m) => !m);
  };
  const toggleDicomModal = () => {
    setDicomModalDialog((m) => !m);
  };

  const toggleRenameModal = () => {
    setRenameModalDialog((m) => !m);
  };

  const toggleCreateFolderModal = () => {
    setCreateFolderModalDialog((m) => !m);
  };
  const [renameName, setRenameName] = useState("");
  const [renamePath, setRenamePath] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderPath, setNewFolderPath] = useState("");
  const [show, setShow] = useState(false);
  const [fpath, setFpath] = useState("");

  const handleRename = (e) => {
    e.preventDefault();
    dispatch(renameFiles(renamePath, renameName));
    dispatch(getFoldersList());
    dispatch(getFilesList(selectedFolder));
    setRenameModalDialog(false);
  };
  const handleCreateFolder = (e) => {
    e.preventDefault();
    dispatch(createNewFolder(newFolderPath, newFolderName)).then(() => {
      dispatch(getFoldersList());
      dispatch(getFilesList(selectedFolder));
    });
    setCreateFolderModalDialog(false);
  };
  const fileActions = useMemo(
    () => [
      ChonkyActions.CreateFolder,
      ChonkyActions.UploadFiles,
      ChonkyActions.DownloadFiles,
      ChonkyActions.CopyFiles,
      ChonkyActions.DeleteFiles,
      renameFile,
      getLink,
      archiveFiles,
      refreshFiles,
      deepResearch,
      metaInfo,
    ],
    []
  );
  const { filesList, foldersList, selectedFolder } = useSelector(
    (store) => store.filemanager
  );
  console.log(filesList);
  console.log(foldersList);

  const convertFiles = (fileLists) => {
    let a = [];
    fileLists.map((f) =>
      a.push({
        id: f?.id,
        name: f?.name,
        path: f?.path,
        created: f?.created,
        modDate: f?.modified,
        type: f?.type,
        size: f?.size,
        premissions: f?.premissions,
        isDir: f?.type === "folder",
        thumbnailUrl: f.thumbnailUrl || apiUrl + f?.path,
      })
    );
    return a;
  };
  const [files, setFiles] = useState([]);
  const [folderChain, setFolderChain] = useState([]);
  const closeFileViewer = () => {
    setShow(false);
    setFpath("");
  };

  const handleAction = (data) => {
    console.log(data.id);
    switch (data.id) {
      case "upload_files":
        setModalDialog(true);
        break;
      case "open_files":
        if (data?.payload?.targetFile?.isDir) {
          dispatch(setSelectedFolder(data?.payload?.targetFile.path));
          dispatch(getFilesList(data?.payload?.targetFile.path));
        } else {
          if (
            data?.payload?.files[0]?.path &&
            !data?.payload?.files[0]?.isDir
          ) {
            history.push(`/clinic/fileviewer`, {
              state: data?.payload?.files[0]?.path,
            });
          } else if (data?.payload?.targetFile?.path) {
            history.push(`/clinic/fileviewer`, {
              state: data?.payload?.targetFile?.path,
            });
          }
        }
        break;

      case "delete_files":
        let items = [];
        data.state.selectedFiles.map((file) => items.push(file.path));

        dispatch(deleteItems(items)).then(() => {
          dispatch(getFilesList(selectedFolder));
          dispatch(getFoldersList());
          setActionLoader(false);
        });
        break;
      case "open_parent_folder":
        break;
      case "rename":
        setRenameModalDialog(true);
        setRenamePath(data?.state?.selectedFiles[0]?.path);
        break;
      case "get_link":
        setRenameModalDialog(true);
        break;
      case "create_folder":
        setNewFolderPath(data?.payload?.targetFile?.path);
        setCreateFolderModalDialog(true);
        break;
      case "archive_files":
        break;
      case "refresh_files":
        console.log(data);
        dispatch(getFilesList(selectedFolder));
        dispatch(getFoldersList());
        break;
      case "download_files":
        const url = `${apiUrl}${data?.state?.selectedFiles[0]?.path}`;
        const name = data?.state?.selectedFiles[0]?.path;
        const c = name.split("/");
        const fileName = c[c.length - 1];
        const file = data?.state?.selectedFiles[0]?.path;
        let b = file.split(".");
        const type = b[b.length - 1];
        saveAs(
          `${apiUrl}${data?.state?.selectedFiles[0]?.path}`,
          `${fileName}.${type}`
        );
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    dispatch(getFilesList());
    dispatch(getFoldersList());
  }, []);
  useEffect(() => {
    setFiles(convertFiles(filesList));
  }, [filesList]);
  useEffect(() => {
    setFolderChain([
      {
        name: foldersList?.name,
        id: foldersList?.id,
        isDir: true,
      },
    ]);
  }, [foldersList]);
  useEffect(() => {}, [folderChain]);
  // JS for camera module
  const [cameraState, setCameraState] = useState(false);
  const [image, setImage] = useState(null);
  const cameraRef = useRef(null);
  const [successModal, setSuccessModal] = useState(false);
  const takeImageAndPass = () => {
    setCameraState(false);
    const img = cameraRef.current.getScreenshot();
    setImage(
      dataURLtoFile(img, "Photo_" + new Date().getTime().toString() + ".png")
    );
    setSuccessModal(true);
  };

  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  return (
    <>
      <div className="row h-100">
        <div
          className="col-4"
          style={{
            height: "80vh",
            background: "#fff",
            paddingLeft: 0,
            overflow: "auto",
            position: "relative",
          }}
        >
          <FileManagerSidebar foldersList={foldersList} />
          {actionLoader && (
            <div
              style={{
                position: "absolute",
                background: "#11111199",
                height: "inherit",
                width: "inherit",
                top: 0,
                left: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p>loading . . .</p>
            </div>
          )}
        </div>
        <div className="col-8" style={{ height: "80vh", position: "relative" }}>
          <FullFileBrowser
            className="col-8"
            files={files}
            folderChain={folderChain}
            fileActions={fileActions}
            onFileAction={handleAction}
          >
            <FileContextMenu />
            <FileToolbar />
            <FileNavbar />
            <FileList />
          </FullFileBrowser>
          {/* {show && <Ticketprofile/>} */}
          {/* {show && <FilesViewer file={fpath} closeFileViewer={closeFileViewer}/>} */}

          {actionLoader && (
            <div
              style={{
                position: "absolute",
                background: "#11111199",
                height: "inherit",
                width: "inherit",
                top: 0,
                left: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p>loading . . .</p>
            </div>
          )}
        </div>
      </div>
      <Modal isOpen={modalDialog} toggle={() => toggleModal()}>
        <ModalHeader toggle={() => toggleModal()}>
          <div>Upload Files Here</div>
          <button
            onClick={() => {
              toggleModal();
              setCameraState(!cameraState);
            }}
            style={{ position: "absolute", right: "40px", top: "10px" }}
            className="btn btn-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="white"
              class="bi bi-camera"
            >
              {" "}
              <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />{" "}
              <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />{" "}
            </svg>
            Take Photo
          </button>
        </ModalHeader>

        <ModalBody>
          <Uploader image={image} setModalDialog={(d) => setModalDialog(d)} />
        </ModalBody>
      </Modal>

      <Modal isOpen={dicomModalDialog} toggle={() => toggleDicomModal()}>
        <ModalHeader toggle={() => toggleDicomModal()}>
          Dicom Fle Viewer
        </ModalHeader>
        <ModalBody>
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <div style={{ textAlign: "center", height: "100%" }}>
              <DicomViewer />
            </div>
          </MuiThemeProvider>
        </ModalBody>
        <ModalFooter>
          <button
            className="btn btn-white"
            onClick={() => setDicomModalDialog(false)}
          >
            Close
          </button>
          <button className="btn btn-success">Action</button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={renameModalDialog} toggle={() => toggleRenameModal()}>
        <ModalHeader toggle={() => toggleRenameModal()}>Rename </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleRename}>
            <FormGroup>
              <Label for="exampleEmail">Rename your file</Label>
              <Input
                type="text"
                name="rename"
                onChange={(e) => setRenameName(e.target.value)}
                placeholder="Rename your file"
              />
            </FormGroup>
            <button
              className="btn btn-white"
              onClick={() => setRenameModalDialog(false)}
            >
              Close
            </button>
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </Form>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={createFolderModalDialog}
        toggle={() => toggleCreateFolderModal()}
      >
        <ModalHeader toggle={() => toggleCreateFolderModal()}>
          Create Folder{" "}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleCreateFolder}>
            <FormGroup>
              <Label for="exampleEmail">Create a new folder</Label>
              <Input
                type="text"
                name="createfolder"
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Create new folder"
              />
            </FormGroup>
            <button
              className="btn btn-white"
              id="cccc"
              onClick={() => setCreateFolderModalDialog(false)}
            >
              Close
            </button>
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </Form>
        </ModalBody>
      </Modal>
      <Modal isOpen={cameraState}>
        <ModalHeader>WebCam</ModalHeader>
        <ModalBody>
          <center>
            <WebCam height={500} width={400} ref={cameraRef} />
          </center>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={takeImageAndPass}>
            Snap
          </button>
          <button
            className="btn btn-danger"
            onClick={() => setCameraState(!cameraState)}
          >
            Close
          </button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={successModal}>
        <ModalHeader>Uploading</ModalHeader>
        <ModalBody>
          <p>Your file has been uploaded successfully</p>
          {image !== null ? (
            <BabyUploadComponents
              file={image}
              index={0}
              path={selectedFolder}
            />
          ) : (
            " "
          )}
        </ModalBody>
        <ModalFooter>
          <button
            className="btn btn-primary"
            onClick={() => {
              setImage(null);
              setSuccessModal(!successModal);
            }}
          >
            Close
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default FileManagerContainer;
