import React from "react";
import Files from "./files";
import { Provider } from "react-redux";
import store from "./Redux/store";
import FileManagerContainer from "./filemanager/FileManagerContainer.jsx";
const YourDrive = ({ type, id, attachments, getAttachments }) => {
  return (
    <Provider store={store}>
      <Files />
      <FileManagerContainer type={type} dataId={id} attachments={attachments} getAttachments={getAttachments}/>
    </Provider>
  );
};

export default YourDrive;
