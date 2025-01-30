import React, { Component } from "react";
import Dropzone from "react-dropzone";
import Delete from "@material-ui/icons/Delete";
import { deleteAttachments } from "../../services/attachments";
import './fileUploader.css'
import {
  IconButton
} from "@material-ui/core";
//export const apiUrl = { url: "https://backend.itransportindex.com/api" };

const apiUrl = process.env.REACT_APP_API_URL;

class ReusableDropzone extends Component {
  onDrop = (newFiles) => {
    const oldAttachments = this.props.state.data.attachments || [];

    this.props.setState((prevState) => ({
      attachments: [...oldAttachments, ...prevState.attachments, ...newFiles],
    }));
  };
  deleteFile = async (index) => {
    this.props.setState((prevState) => {
      const updatedFiles = [...prevState.attachments];
      updatedFiles.splice(index, 1);
      return { attachments: updatedFiles };
    });
  };

  deleteSavedAttachments = async (item, id, type) => {
    await deleteAttachments(item.filePath, id, type);
    await this.props.populate();
  };
  render() {
    const { attachments } = this.props.state;
    console.log(this.props.type)
    console.log(attachments);
    const files = attachments.map((file, index) => (
      <li key={file.name}>
        {file.filePath ? (
          <div className="file_uploader_card">
            <div className="">
              <img
                src={`${apiUrl.url}/${file.filePath}`}
                alt={file.fileName || file.name}
                className="file_uploader_card_image"
              />
            </div>
            <div>
              <IconButton
                className=""
                onClick={() => {
                  this.deleteSavedAttachments(
                    file,
                    this.props.id,
                    this.props.type
                  );
                  this.deleteFile(file.id);
                }}
              >
                <Delete className="delete_icon_file_uploader_button" />
              </IconButton>
            </div>
          </div>
        ) : (
          <div className="file_uploader_card">
            <div className="">
              <img
                src={URL.createObjectURL(file)}
                alt={file.fileName || file.name}
                className="file_uploader_card_image"
              />
            </div>
            <div>
              <IconButton className="" onClick={() => this.deleteFile(index)}>
                <Delete className="delete_icon_file_uploader_button" />
              </IconButton>
            </div>
          </div>
        )}
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

export default ReusableDropzone;
