import React, { useCallback, useEffect, useState } from "react";
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  CircularProgress,
  Box,
  Typography,
} from "@material-ui/core";
//import apiUrl from "../Data/Config";
// import File from "@material-ui/icons/InsertDriveFile";
import Delete from "@material-ui/icons/Delete";
import { formatBytes } from "react-dropzone-uploader";
import axios from "axios";
import { apiUrl } from "../../../config/config.json";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { getFilesList } from "../Redux/actions/filemanager";

const BabyUploadComponents = ({ file, index, removeFile, path }) => {
  const dispatch = useDispatch();
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  const [status, setStatus] = useState({});
  const [progress, setProgress] = useState(0);
  const onUploadProgress = (event) => {
    setProgress(Math.round((100 * event.loaded) / event.total));
  };

  useEffect(() => {
    if (progress === 100) {
      setStatus("complete");
    } else {
      setStatus("pending");
    }
  }, [progress]);

  const upload = useCallback(
    async (onUploadProgress) => {
      try {
        const formdata = new FormData();
        formdata.append("path", path);
        formdata.append("files", file, file.name);
        const { data } = await axios({
          method: "post",
          headers: {
            "Content-Type": "application/json",
            cronustoken: window.localStorage.getItem("jwtToken"),
          },
          onUploadProgress,
          url: `${apiUrl}/fm/upload`,
          data: formdata,
          cancelToken: source.token,
        });
        console.log(data);
        dispatch(getFilesList(""));
      } catch (error) {
        alert(error.message);
      }
    },
    [file, path]
  );
  useEffect(() => {
    upload(onUploadProgress);
  }, [upload]);
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>
          <CircularProgressWithLabel value={progress} />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={`${file.name} - ${formatBytes(file.size)}`} />
      <ListItemSecondaryAction>
        {status === "complete" ? (
          <></>
        ) : (
          <IconButton
            onClick={() => {
              source.cancel("Operation canceled by the user.");
              removeFile(index);
              return;
            }}
            edge="end"
            aria-label="delete"
          >
            <Delete />
          </IconButton>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

function CircularProgressWithLabel(props) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="caption"
          component="div"
          color="textSecondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

export default BabyUploadComponents;
