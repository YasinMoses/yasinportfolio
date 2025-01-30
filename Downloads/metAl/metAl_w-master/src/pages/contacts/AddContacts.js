import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import axios from "axios";
import {
  Input,
  InputLabel,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar } from "@mui/material";
import { patchUser } from "../../services/users";
const useStyles = makeStyles((theme) => ({
  dialogContent: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
  },
}));

const SearchContactsForm = ({
  open,
  onClose,
  users,
  added,
  setusers,
  setAdded,
  currentUser,
  onAdd,
}) => {
  const classes = useStyles();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Filter the users based on the search query
    const filteredUsers = users.filter((user) => {
      const isMatch =
        user.contactName.first.toLowerCase().includes(search.toLowerCase()) ||
        user.contactName.last.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const isAlreadyAdded = added?.some((addedUser) => {
        return (
          user.email.toLowerCase() === addedUser.email.toLowerCase() &&
          user.contactName.first.toLowerCase() ===
            addedUser.contactName.first.toLowerCase() &&
          user.contactName.last.toLowerCase() ===
            addedUser.contactName.last.toLowerCase()
        );
      });

      return isMatch && !isAlreadyAdded;
    });

    setSearchResults(filteredUsers);
  }, [search, users]);

  const handleAddContact = async (newContact) => {
    // Add the new contact to the array. If you want to add a contact to the user object
    setusers((prev) => [...prev, newContact]);
    setSearch("");
    onAdd();
    onClose();
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        className="dialogue-add-contacts"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Search Contacts</DialogTitle>

        <DialogContent
          className={`${classes.dialogContent} dialogue-content-add-contact`}
        >
          <TextField
            label="Search"
            variant="outlined"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {search.length > 0 &&
            searchResults.map((user, index) => (
              <div
                key={index}
                className="d-flex justify-content-md-between align-items-center"
              >
                <div className="d-flex  align-items-center ">
                  <Avatar
                    variant="circular"
                    className=" "
                    style={{
                      width: " 40px",
                      height: " 40px",
                      margin: ".5rem",
                    }}
                    src={user.imageSrc}
                    alt={"Profile Image"}
                  />
                  <div
                    style={{ textTransform: "lowercase", fontWeight: "bold" }}
                  >
                    <p style={{ textTransform: "capitalize" }}>
                      {user.contactName.first} {user.contactName.last}
                    </p>
                    {user.email}
                  </div>
                </div>
                <Button
                  onClick={() => handleAddContact(user)}
                  variant="outlined"
                  sx={{
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "30px",
                  }}
                  className="add-button-contacts"
                >
                  Add
                </Button>
              </div>
            ))}
        </DialogContent>
        <DialogActions>
          <Button className="add-button-contacts" onClick={onClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SearchContactsForm;
