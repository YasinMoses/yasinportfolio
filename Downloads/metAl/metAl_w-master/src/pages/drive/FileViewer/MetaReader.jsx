import React, { useEffect, useState } from "react";
import piexif from "piexifjs";
import dataExtractor from "exifr";
import axios from "axios";
import { Input, Stack, Button } from "@mui/material";
import { toast } from "react-toastify";
const ExifEditor = ({ url, isedit, issupported }) => {
  const [metakeys, setmetakeys] = useState([]);

  const [exif, setexif] = useState({});

  const handlemeta = async () => {
    try {
      let dataurl = url;
      const metadatafile = await dataExtractor.parse(dataurl);
      setexif(metadatafile === undefined ? [] : metadatafile);
      setmetakeys(Object.entries(metadatafile || {}));
      if (Object.entries(metadatafile || {}).length === 0) {
        toast.info(
          "This file has no Meta Data but you can try to add some by using Edit in Actions"
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(
        "This file has no Meta Data and is unsupported by Meta Editor"
      );
    }
  };

  useEffect(() => {
    handlemeta();
  }, [url,isedit,issupported]);
  async function handleSaveClick() {
    const file = url;
    const fileName = file.split("api/uploads");
    const name = fileName[1];
    const neededPath = name.split("/");
    const imagename = neededPath.splice(neededPath.length - 1, 1);
    const path = neededPath.join("/");
    const zeroth = {};
    const exif = exif === undefined ? {} : exif;
    const gps = {};
    zeroth[piexif.ImageIFD.Make] = document.getElementById("cameramaker").value;
    zeroth[piexif.ImageIFD.Artist] =
      document.getElementById("meta-author").value;
    zeroth[piexif.ImageIFD.Copyright] =
      document.getElementById("meta-copyright").value;
    zeroth[piexif.ImageIFD.Model] =
      document.getElementById("cameramodel").value;
    zeroth[piexif.ImageIFD.Software] = "Color Admin";
    exif[piexif.ExifIFD.DateTimeOriginal] =
      document.getElementById("meta-date").value;
    const exifObj = { "0th": zeroth, Exif: exif, GPS: gps };
    const reader = new FileReader();
    const exifStr = piexif.dump(exifObj);
    reader.onload = async (e) => {
      try {
        const inserted = piexif.insert(exifStr, e.target.result);
        console.log(inserted);
        await axios.post("https://backend.metaimind.com/api/fm/savemetadata", {
          path,
          file: inserted,
          metadata: {
            Make: document.getElementById("cameramaker").value,
            Model: document.getElementById("cameramodel").value,
            Artist: document.getElementById("meta-author").value,
            Copyright: document.getElementById("meta-copyright").value,
            DateTimeOriginal: document.getElementById("meta-date").value,
          },
          name: imagename,
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        // Use the blob object to create a new file
        const file = new File([blob], "image.jpg", { type: blob.type });

        // Use the file object to upload the image to the server or display it in the browser
        // For example:
        reader.readAsDataURL(file);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div id="resized"></div>

      {isedit && (
        <Stack width={"70%"}>
          <Input
            type="text"
            defaultValue={exif?.Make === undefined || null ? " " : exif.Make}
            placeholder="Camera Maker"
            id="cameramaker"
          />
          <Input
            type="text"
            defaultValue={exif?.Model === undefined || null ? " " : exif.Model}
            placeholder="Camera Model"
            id="cameramodel"
          />

          <Input
            type="text"
            defaultValue={
              exif?.Artist === undefined || null ? " " : exif.Artist
            }
            placeholder="Artist"
            id="meta-author"
          />
          <Input
            type="text"
            defaultValue={
              exif?.Copyright === undefined || null ? " " : exif.Copyright
            }
            placeholder="Copyright"
            id="meta-copyright"
          />
          <Input type="date" defaultValue={Date.now} name="" id="meta-date" />
          {isedit && (
            <Button
              variant="text"
              className="w-[100px] cursor-pointer"
              onClick={() => {
                handleSaveClick();
                toast.success("Saved Successfully");
              }}
            >
              Save new Data
            </Button>
          )}
        </Stack>
      )}
      {!isedit && metakeys.length > 0 && (
        <div>
          {metakeys.map((values, index) => {
            return (
              <p key={index}>
                {values[0]}:{values[1]}
              </p>
            );
          })}
        </div>
      )}
      {!isedit &&metakeys.length === 0 && (
        <div>
          <p>Camera Model: Not Found</p>
          <p>Camera Maker: Not found</p>
          <p>Copyright: Not Added</p>
          <p>Artist: Not Added</p>
          <p>Orignal Date: Not Added</p>
        </div>
      )}
    </div>
  );
};

export default ExifEditor;
