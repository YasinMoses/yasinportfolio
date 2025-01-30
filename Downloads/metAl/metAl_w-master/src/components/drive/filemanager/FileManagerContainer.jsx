/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState, useEffect } from "react";
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
  FileBrowser,
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
import { apiUrl } from "../../../config/config.json";

import FileManagerSidebar from "./FileManagerSidebar";
import { useHistory } from "react-router";
import { saveAs } from 'file-saver';
import { deleteAttachments, saveAttachments } from "../../../services/attachments";

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
const FileManagerContainer = ({ type, dataId, attachments, getAttachments }) => {
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
  const [show, setShow] = useState(false)
  const [fpath, setFpath] = useState('')

  const handleRename = async (e) => {
    e.preventDefault();
    dispatch(renameFiles(renamePath, renameName));
    dispatch(getFoldersList());
    dispatch(getFilesList(selectedFolder));
    setRenameModalDialog(false);
  };

  const fileActions = useMemo(
    () => [
      // ChonkyActions.CreateFolder,
      ChonkyActions.UploadFiles,
      ChonkyActions.DownloadFiles,
      ChonkyActions.CopyFiles,
      ChonkyActions.DeleteFiles,
      // renameFile,
      getLink,
      archiveFiles,
      refreshFiles,
      deepResearch,
      metaInfo,
    ],
    []
  );
  const { filesList, selectedFolder } = useSelector(
    (store) => store.filemanager
  );
  console.log(filesList);

  const convertFiles = (fileLists) => {
    let a = [];
    fileLists.map((f) => {
      a.push({
        id: f?._id,
        name: f?.fileName,
        path: f?.filePath,
        created: null,
        modDate: null,
        type: "file",
        size: f?.size,
        premissions: { others: "x-w-r", group: "x-w-r", owner: "x-w-r" },
        isDir: false,
        thumbnailUrl: apiUrl + `/${f?.filePath}`,
      })
    }
    );
    return a;
  };
  const [files, setFiles] = useState([]);
  const [folderChain, setFolderChain] = useState([]);
  const closeFileViewer = () => {
    setShow(false)
    setFpath('')
  }

  const handleAction = async (data) => {
    console.log(data.id);
    switch (data.id) {
      case "upload_files":
        setModalDialog(true);
        break;
      case "open_files":
        if (data?.payload?.files[0]?.path && !data?.payload?.files[0]?.isDir) {
          history.push(`/clinic/fileviewer`, { state: `/${data?.payload?.files[0]?.path}` })
        } else if (data?.payload?.targetFile?.path) {
          history.push(`/clinic/fileviewer`, { state: `/${data?.payload?.targetFile?.path}` })

        }
        break;

      case "delete_files":
        let items = [];
        data.state.selectedFiles.map((file) => items.push(file.path));

        await handleDelete(items);
        break;
      // case "open_parent_folder":
      //   break;
      case "rename":
        // setRenameModalDialog(true);
        // setRenamePath(data?.state?.selectedFiles[0]?.path);
        break;
      case "get_link":
        setRenameModalDialog(true);
        break;
      // case "create_folder":
      //   setNewFolderPath(data?.payload?.targetFile?.path);
      //   setCreateFolderModalDialog(true);
      //   break;
      case "archive_files":
        break;
      case "refresh_files":
        console.log(data);
        await getAttachments();
        break;
      case "download_files":
        // const url = `${apiUrl}${data?.state?.selectedFiles[0]?.path}`;
        // const name = data?.state?.selectedFiles[0]?.path
        // const c = name.split('/')
        // const fileName = c[c.length - 1]
        // const file = data?.state?.selectedFiles[0]?.path
        // let b = file.split('.')
        // const type = b[b.length - 1]
        saveAs(`${apiUrl}/${data?.state?.selectedFiles[0]?.path}`, `${data?.state?.selectedFiles[0]?.name}`);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setFiles(convertFiles(attachments));
  }, [attachments]);

  console.log("files", files)
  console.log("attachments", attachments)


  const onClickHandler = async (e, files, onUploadProgress) => {
    e.preventDefault();
    try {
      saveAttachments(files, type, dataId, onUploadProgress);
      setTimeout(async () => {
        await getAttachments();
      }, 200);
      setModalDialog(false);
    } catch (ex) {
      if (ex.response) {
        console.log(ex.response.data);
      }
    }
  };

  const handleDelete = async (items) => {
    items.forEach(async (filePath) => {
      await deleteAttachments(filePath, dataId, type);
    })
    setTimeout(async () => {
      await getAttachments();
    }, 200);
  };


  return (
    <>
      <div className="row h-100">
        <div className="col-12" style={{ height: "80vh", position: "relative" }}>
          <FileBrowser
            className="col-12"
            files={files}
            folderChain={folderChain}
            fileActions={fileActions}
            onFileAction={handleAction}
          >
            <FileContextMenu />
            <FileToolbar />
            {/* <FileNavbar /> */}
            <FileList />
          </FileBrowser>
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
      <Uploader modalDialog={modalDialog} setModalDialog={setModalDialog} onClickHandler={onClickHandler} />

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
      {/* <Modal isOpen={renameModalDialog} toggle={() => toggleRenameModal()}>
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
      </Modal> */}
    </>
  );
};

export default FileManagerContainer;
