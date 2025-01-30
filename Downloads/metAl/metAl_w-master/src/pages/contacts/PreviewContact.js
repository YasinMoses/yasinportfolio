import React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Input, InputAdornment, InputLabel } from "@material-ui/core";
import TextField from "@mui/material/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { Title } from "@material-ui/icons";
import { Avatar } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
  },
}));
const PreviewContact = ({ open, preview, onClose }) => {
  const classes = useStyles();
  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        sx={{ padding: "2rem" }}
      >
        <DialogTitle
          alignItems={"center"}
          display={"flex"}
          flexDirection={"column"}
        >
          Preview Contact
          <Avatar
            src={preview?.contact?.imageSrc}
            sx={{ width: "100px", height: "100px" }}
          />
        </DialogTitle>
        <div className="m-5 text-center">
          <h1
            style={{
              fontSize: "20px",

              textTransform: "capitalize",
            }}
          >
            Name:
            {`${
              preview?.contact?.contactName?.first === "undefined"
                ? " "
                : preview?.contact?.contactName?.first
            }   ${
              preview?.contact?.contactName?.last === "undefined"
                ? " "
                : preview?.contact?.contactName?.last
            }`}
          </h1>
          <h1
            style={{
              fontSize: "20px",

              textAlignn: "center",
            }}
          >
            Email:{preview?.contact?.email}
          </h1>
          <h1
            style={{
              fontSize: "20px",

              textAlignn: "center",
            }}
          >
            Phone:{preview?.contact?.phones?.phone}
          </h1>
          <h1
            style={{
              fontSize: "20px",

              textAlignn: "center",
            }}
          >
            Address1:
            {preview?.contact?.Address?.address1 === "undefined"
              ? " "
              : preview?.contact?.Address?.address1}
          </h1>
          <h1
            style={{
              fontSize: "20px",

              textAlignn: "center",
            }}
          >
            Address2:
            {preview?.contact?.Address?.address2 === "undefined"
              ? " "
              : preview?.contact?.Address?.address2}
          </h1>
          <h1
            style={{
              fontSize: "20px",

              textAlignn: "center",
            }}
          >
            Status:{preview?.contact?.status}
          </h1>
        </div>
        <DialogContent className={classes.dialogContent}></DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PreviewContact;
