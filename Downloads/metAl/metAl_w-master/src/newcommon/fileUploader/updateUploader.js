
import React, { Component } from "react";
import Dropzone from "react-dropzone";
import Delete from "@material-ui/icons/Delete";
import "./fileUploader.css";
import { IconButton } from "@material-ui/core";
 const apiUrl = { url: "https://backend.itransportindex.com/api" };

class UpdateReusableDropzone extends Component {
  onDrop = (newFiles) => {
    this.props.setState((prevState) => ({
      attachments: [...prevState.attachments, ...newFiles],
    }));
  };
  deleteFile = (index) => {
    this.props.setState((prevState) => {
      const updatedFiles = [...prevState.attachments];
      updatedFiles.splice(index, 1);
      return { attachments: updatedFiles };
    });
  };

  render() {
    const { attachments } = this.props.state;
    console.log(attachments);
    const files = attachments.map((file, index) => (
      <li key={file.name}>
        <div className="file_uploader_card">
          <div className="">
            <img
              src={`${apiUrl.url}/${file.filePath}`}
              alt={file.name}
              className="file_uploader_card_image"
            />
          </div>
          <div>
            <IconButton className="" onClick={() => this.deleteFile(index)}>
              <Delete className="delete_icon_file_uploader_button" />
            </IconButton>
          </div>
        </div>
      </li>
    ));

    return (
      <Dropzone onDrop={this.onDrop}>
        {({ getRootProps, getInputProps }) => (
          <section className="container">
            <div {...getRootProps({ className: "dropzone" })}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <aside>
              <h4>Files</h4>
              <ul className="file_uploader_react">{files}</ul>
            </aside>
          </section>
        )}
      </Dropzone>
    );
  }
}

export default UpdateReusableDropzone
