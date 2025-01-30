import React, { useState } from "react";
import {
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Folder from "@material-ui/icons/Folder";
import { getFilesList, setSelectedFolder } from "../Redux/actions/filemanager";
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    marginLeft: "10px",
    borderLeft: "1px solid black",
    backgroundColor: theme.palette.background.paper,
  },
}));
const FileManagerSidebar = ({ foldersList, path }) => {
  const dispatch = useDispatch();
  const { selectedFolder } = useSelector((store) => store.filemanager);

  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const onFolderClick = () => {
    dispatch(setSelectedFolder(path));
    dispatch(getFilesList(path));
  };
  return (
    <List component="nav" className={classes.nested}>
      <ListItem
        button
        style={{
          backgroundColor: `${selectedFolder === path ? "#5e5e5e" : "inherit"}`,
          color: `${selectedFolder === path ? "white" : "inherit"}`,
        }}
        onClick={onFolderClick}
      >
        <ListItemIcon>
          <Folder
            style={{
              color: `${selectedFolder === path ? "white" : "inherit"}`,
            }}
          />
        </ListItemIcon>
        <ListItemText primary={foldersList?.name} />
        {foldersList?.children &&
          foldersList.children.length !== 0 &&
          foldersList.children.length > 0 && (
            <>
              {open ? (
                <ExpandLess
                  onClick={() => {
                    setOpen((o) => !o);
                  }}
                />
              ) : (
                <ExpandMore
                  onClick={() => {
                    setOpen((o) => !o);
                  }}
                />
              )}
            </>
          )}
      </ListItem>
      {foldersList?.children &&
        foldersList.children.length !== 0 &&
        foldersList.children.length > 0 && (
          <Collapse in={open} timeout="auto" unmountOnExit>
            {foldersList?.children.map((fl, key) => (
              <FileManagerSidebar key={key} foldersList={fl} path={fl.path} />
            ))}
          </Collapse>
        )}
    </List>
  );
};

export default FileManagerSidebar;
