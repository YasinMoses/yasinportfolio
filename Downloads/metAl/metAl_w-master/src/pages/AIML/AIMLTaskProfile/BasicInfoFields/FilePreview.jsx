import React from "react";
import { Card, CardBody, CardGroup, CardImg, CardText } from "reactstrap";
import { IconButton } from "@material-ui/core";
import Delete from "@material-ui/icons/Delete";
import { apiUrl } from "../../../config/config.json";

export default function FilePreview({
  selectedFile,
  removeFile,
  handleDelete,
}) {
  // let assets = [];
  // console.log(selectedFile);

  // if (selectedFile?.length > 0) {
  //   console.log(selectedFile);
  //   for (let x = 0; x < selectedFile.length; x++) {
  //     assets[x] = {
  //       name: selectedFile[x]?.filePath,
  //       type: selectedFile[x]?.fileType,
  //       link: URL.createObjectURL(selectedFile[x]),
  //     };
  //   }
  // }
  // console.log(assets);

  return (
    <CardGroup className="d-flex flex-wrap">
      {selectedFile?.map((file, index) => (
        <Card key={index} className="m-3" style={{ maxWidth: "220px" }}>
          {file.fileType?.indexOf("image/") > -1 ? (
            <CardImg
              top
              // src={asset?.name}
              src={`${apiUrl}/${file.filePath}`}
              alt="image"
              style={{
                height: "150px",
                objectFit: "cover",
                position: "relative",
              }}
            />
          ) : (
            <div
              style={{ height: "150px" }}
              className="d-flex justify-content-center align-items-center"
            >
              {file.fileType?.indexOf("application/pdf") > -1 ? (
                <i className={`fas fa-file-pdf fa-lg`}></i>
              ) : file.fileType?.indexOf("spreadsheetml.sheet") > -1 ? (
                <i className={`fas fa-file-excel fa-lg`}></i>
              ) : file.fileType?.indexOf("wordprocessingml.document") > -1 ? (
                <i className={`fas fa-file-word fa-lg`}></i>
              ) : (
                <i className={`fas fa-file fa-lg`}></i>
              )}
            </div>
          )}
          <IconButton
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              cursor: "pointer",
              fontWeight: "bolder",
              backgroundColor: "#FEB2B2",
              fontSize: "1rem",
            }}
            onClick={() => {
              // let arr = [...selectedFile];
              // arr.splice(index, 1);
              // URL.revokeObjectURL(file.fileName);
              // removeFile(arr);
              handleDelete(file.filePath);
            }}
          >
            <Delete />
          </IconButton>
          <CardBody style={{ background: "#ededed", textAlign: "center" }}>
            <CardText as="h1">{file.fileName}</CardText>
          </CardBody>
        </Card>
      ))}
    </CardGroup>
  );
}
