import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Input, InputAdornment, InputLabel } from "@material-ui/core";
import TextField from "@mui/material/TextField";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
  },
}));

const AddContactForm = ({
  onClose,
  setusers,
  users,
  contact,
  index,
  open,
  setedit,
}) => {
  const classes = useStyles();

  const [lastName, setLastName] = useState(contact?.contactName?.last || " ");
  const [firstName, setfirstName] = useState(
    contact?.contactName?.first || " "
  );
  const [phone, setPhone] = useState(contact?.phones?.name || " ");
  const [mobile, setMobile] = useState(contact?.device?.name || " ");
  const [email, setEmail] = useState(contact?.email);
  const [address1, setAddress1] = useState(
    contact.Address.address1 === "undefined" ? " " : contact?.Address?.address1
  );
  const [address2, setAddress2] = useState(
    contact.Address.address2 === "undefined" ? " " : contact?.Address?.address2
  );
  const [image, setImage] = useState(contact?.imageSrc);

  const handleAddContact = (event) => {
    event.preventDefault();
    const newContact = {
      ...contact,
      contactName: { first: firstName, initial: firstName, last: lastName },
      phone,
      device: { name: mobile },
      email,
      Address: { address1, address2 },
      status: "Active",
    };

    //update contact logic here
    let finalObject = [];
    for (let values of users) {
      finalObject.push(values);
    }
    for (let i = 0; i < users.length; i++) {
      if (i === index) {
        finalObject[i] = newContact;
        setusers(finalObject);

        break;
      }
    }
    setedit({});

    onClose();
  };

  return (
    <div>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Contact</DialogTitle>
        <form onSubmit={handleAddContact}>
          <DialogContent className={classes.dialogContent}>
            <TextField
              label="First Name"
              variant="outlined"
              required
              value={firstName}
              onChange={(event) => setfirstName(event.target.value)}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              required
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
            <TextField
              label="Phone"
              variant="outlined"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
            <TextField
              label="Mobile"
              variant="outlined"
              value={mobile}
              onChange={(event) => setMobile(event.target.value)}
            />
            <TextField
              label="Email"
              variant="outlined"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <TextField
              label="Address 1"
              variant="outlined"
              value={address1}
              onChange={(event) => setAddress1(event.target.value)}
            />
            <TextField
              label="Address 2"
              variant="outlined"
              value={address2}
              onChange={(event) => setAddress2(event.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" color="primary" variant="contained">
              Update
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
export default AddContactForm;
