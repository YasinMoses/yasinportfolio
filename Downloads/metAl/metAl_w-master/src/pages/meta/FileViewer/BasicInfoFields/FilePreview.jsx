import React from "react";
import { Card, CardBody, CardGroup, CardImg, CardText } from "reactstrap";

export default function FilePreview() {
  const assets = [
    {
      name: "image.jpg",
      link:
        "https://i.pinimg.com/originals/fa/c5/12/fac5128da23bf61044c0b06851f08375.jpg",
      type: "image",
    },
    {
      name: "image.pdf",
      type: "pdf",
    },
    {
      name: "image.jpg",
      link:
        "https://i.pinimg.com/originals/fa/c5/12/fac5128da23bf61044c0b06851f08375.jpg",
      type: "image",
    },
    {
      name: "image.xlsx",
      type: "spreadsheet",
    },
  ];
  return (
    <CardGroup>
      {assets.map((asset, id) => (
        <Card key={id} className="m-3">
          {asset.type === "image" ? (
            <CardImg
              top
              src={asset?.link}
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
              {asset?.type === "pdf" && (
                <i className={`fas fa-file-pdf fa-lg`}></i>
              )}
              {asset?.type === "spreadsheet" && (
                <i className={`fas fa-file-excel fa-lg`}></i>
              )}
            </div>
          )}
          <i
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              cursor: "pointer",
            }}
            className={`fas fa-trash-alt fa-lg m-4`}
          ></i>
          {asset?.type === "image" && (
            <i
              style={{
                position: "absolute",
                top: "0",
                right: "0",
                cursor: "pointer",
              }}
              className={`fas fa-camera fa-lg m-4`}
            ></i>
          )}
          {asset?.type === "pdf" && (
            <i
              style={{
                position: "absolute",
                top: "0",
                right: "0",
                cursor: "pointer",
              }}
              className={`fas fa-file-pdf fa-lg p-4`}
            ></i>
          )}
          {asset?.type === "spreadsheet" && (
            <i
              style={{
                position: "absolute",
                top: "0",
                right: "0",
                cursor: "pointer",
              }}
              className={`fas fa-file-excel fa-lg p-4`}
            ></i>
          )}
          <CardBody style={{ background: "#ededed", textAlign: "center" }}>
            <CardText as="h1">{asset?.name}</CardText>
          </CardBody>
        </Card>
      ))}
    </CardGroup>
  );
}
