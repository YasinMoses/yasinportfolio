import React from "react";
import Files from "./files";
import { Provider } from "react-redux";
import store from "./Redux/store";
import FileManagerContainer from "./filemanager/FileManagerContainer.jsx";
const YourDrive = () => {
  return (
    <Provider store={store}>
      <Files />
      <div className="my-4 w-100">
        <h2>Drive</h2>
      </div>
      <FileManagerContainer />
    </Provider>
  );
};

export default YourDrive;
