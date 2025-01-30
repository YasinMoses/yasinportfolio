import React from "react";
import "./contacts.scss";
import StarIcon from "@material-ui/icons/Star";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ForumIcon from "@material-ui/icons/Forum";
import ShareIcon from "@material-ui/icons/Share";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";

import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import VoiceChatIcon from "@material-ui/icons/VoiceChat";

import EditIcon from "@material-ui/icons/Edit";

import { Avatar } from "@material-ui/core";

const Card = ({
  edit,
  name,
  address,
  feedback,
  status,
  img,
  users,
  setusers,
  index,
  setedit,
  preview,
  setpreview,
  ondel,
}) => {
  return (
    <div className="card p-3" style={{ width: "500px", padding: "2rem" }}>
      <div className="d-flex mb-0">
        <div className="d-flex flex-column justify-content-center user-profile w-100">
          <div className="row">
            <div className="col-12 col-md-4 mb-0 img-center d-flex flex-column justify-content-center justify-content-md-start ">
              <div>
                <div className="icons-container stars d-flex flex-row justify-content-end">
                  <Tooltip title="Star">
                    <IconButton arai-label="Star">
                      <StarIcon className="col-orange" />
                    </IconButton>
                  </Tooltip>
                </div>
                <Avatar
                  variant="circular"
                  className=" "
                  style={{
                    width: " 56px",
                    height: " 56px",
                    margin: "auto",
                  }}
                  src={img}
                  alt={name}
                />
              </div>
              {/* Card title */}
              <div className="doc-card-title pt-2 text-center ">
                <h4 style={{ color: "#00bdf2", textTransform: "capitalize" }}>
                  {name}
                </h4>
              </div>
            </div>
            {/* Row One Card Four */}
            <div className="col-md-8 mb-0 ">
              {/* Card description */}
              <div className="description">
                <div>
                  <i className="fas fa-map-marker-alt pt-3 psr-3"></i>{" "}
                  {address.toUpperCase()}
                </div>
                <div>
                  <i className="far fa-comment-dots pt-3 psr-3"></i>
                  {feedback}
                </div>

                <div>
                  <i className="far fa-clock pt-3 psr-3 pb-3"></i>{" "}
                  {status?.toUpperCase()}
                </div>
              </div>

              {/* 02. Card Button Icons section */}
              <div>
                <div className="contact-icons-container">
                  {/* Hide tool tip section */}
                  <Tooltip
                    title="View Profile of Contact"
                    arrow
                    onClick={() => {
                      console.log(index, "índex");

                      let { ispreview, contactIndex, contact } = preview;

                      for (let i = 0; i < users.length; i++) {
                        if (i === index) {
                          ispreview = true;

                          contactIndex = i;
                          contact = users[i];

                          const data = { ispreview, contactIndex, contact };
                          setpreview(data);
                        }
                      }
                    }}
                  >
                    <IconButton
                      className="icon-btn-margin"
                      aria-label="Make visible"
                    >
                      <VisibilityIcon className="visibility-icon" />
                    </IconButton>
                  </Tooltip>
                  {/* Delete tool tip section */}
                  <Tooltip
                    title="Delete contact"
                    arrow
                    onClick={() => {
                      const remaining = [];
                      for (let i = 0; i < users.length; i++) {
                        if (i !== index) {
                          remaining.push(users[i]);
                        }
                      }
                      setusers(remaining);
                      ondel();
                    }}
                  >
                    <IconButton className="icon-btn-margin" aria-label="Delete">
                      <DeleteIcon className="delete-icon" />
                    </IconButton>
                  </Tooltip>
                  {/* Chat tool tip section */}
                  <Tooltip title="Chat contact" arrow>
                    <IconButton className="icon-btn-margin">
                      <ForumIcon className="forum-icon" />
                    </IconButton>
                  </Tooltip>
                  {/* Share tool tip section */}
                  <Tooltip title="Share contact" arrow>
                    <IconButton className="icon-btn-margin">
                      <ShareIcon className="share-icon" />
                    </IconButton>
                  </Tooltip>
                  {/* PDF tool tip section */}
                  <Tooltip title="Pdf of contact" arrow>
                    <IconButton className="icon-btn-margin">
                      <PictureAsPdfIcon className="picture-as-pdf-icon" />
                    </IconButton>
                  </Tooltip>
                  {/* Edit tool tip section */}
                  <Tooltip
                    title="Edit contact"
                    arrow
                    onClick={() => {
                      console.log(index, "índex");

                      let { isedit, contactIndex, contact } = edit;

                      for (let i = 0; i < users.length; i++) {
                        if (i === index) {
                          isedit = true;

                          contactIndex = i;
                          contact = users[i];

                          const data = { isedit, contactIndex, contact };
                          setedit(data);
                        }
                      }
                    }}
                  >
                    <IconButton className="icon-btn-margin">
                      <EditIcon className="print-icon" />
                    </IconButton>
                  </Tooltip>
                  {/* Storage tool tip section */}
                  <Tooltip title="Video Call" arrow>
                    <IconButton className="icon-btn-margin">
                      <VoiceChatIcon className="voice-icon" />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
// {/* <div className="contact-icons-container">
//   {/* Hide tool tip section */}
//   <Tooltip title="View Profile of Contact" arrow>
//     <IconButton className="icon-btn-margin" aria-label="Make visible">
//       <VisibilityIcon className="visibility-icon" />
//     </IconButton>
//   </Tooltip>
//   {/* Delete tool tip section */}
//   <Tooltip title="Delete contact" arrow>
//     <IconButton className="icon-btn-margin" aria-label="Delete">
//       <DeleteIcon className="delete-icon" />
//     </IconButton>
//   </Tooltip>
//   {/* Chat tool tip section */}
//   <Tooltip title="Chat contact" arrow>
//     <IconButton className="icon-btn-margin">
//       <ForumIcon className="forum-icon" />
//     </IconButton>
//   </Tooltip>
//   {/* Share tool tip section */}
//   <Tooltip title="Share contact" arrow>
//     <IconButton className="icon-btn-margin">
//       <ShareIcon className="share-icon" />
//     </IconButton>
//   </Tooltip>
//   {/* PDF tool tip section */}
//   <Tooltip title="Pdf of contact" arrow>
//     <IconButton className="icon-btn-margin">
//       <PictureAsPdfIcon className="picture-as-pdf-icon" />
//     </IconButton>
//   </Tooltip>
//   {/* Edit tool tip section */}
//   <Tooltip title="Edit contact" arrow>
//     <IconButton className="icon-btn-margin">
//       <EditIcon className="print-icon" />
//     </IconButton>
//   </Tooltip>
//   {/* Storage tool tip section */}
//   <Tooltip title="Video Call" arrow>
//     <IconButton className="icon-btn-margin">
//       <VoiceChatIcon className="voice-icon" />
//     </IconButton>
//   </Tooltip>
// </div>; */}

{
  /* <DropdownButton
  title={<BiDotsVerticalRounded />}
  variant="compact" // or "flat" (default) or "flat-solid" (solid) or "outline" (outline) or "solid
  style={{ borderRadius: "50% !important" }}
  className="custom-dropdown-button "
>
  <Dropdown.Item
    onClick={() => {
      console.log(index, "índex");
      console.log("preview card", preview);
      let { ispreview, contactIndex, contact } = preview;
      console.log("passed1");
      for (let i = 0; i < users.length; i++) {
        console.log("passed2");
        if (i === index) {
          ispreview = true;
          console.log("passed3");
          contactIndex = i;
          contact = users[i];
          console.log("passed4");
          const data = { ispreview, contactIndex, contact };
          setpreview(data);
        }
      }
    }}
  >
    <Tooltip title="View Profile of Contact" arrow>
      <IconButton className="icon-btn-margin" aria-label="Make visible">
        <VisibilityIcon className="visibility-icon" />
      </IconButton>
    </Tooltip>
    View Profile
  </Dropdown.Item>
  <Dropdown.Item
    onClick={() => {
      const remaining = [];
      for (let i = 0; i < users.length; i++) {
        if (i !== index) {
          remaining.push(users[i]);
        }
      }
      setusers(remaining);
    }}
  >
    <Tooltip title="Delete contact" arrow>
      <IconButton className="icon-btn-margin" aria-label="Delete">
        <DeleteIcon className="delete-icon" />
      </IconButton>
    </Tooltip>
    Delete Contact
  </Dropdown.Item>
  <Dropdown.Item>
    <Tooltip title="Chat contact" arrow>
      <IconButton className="icon-btn-margin">
        <ForumIcon className="forum-icon" />
      </IconButton>
    </Tooltip>
    Chat
  </Dropdown.Item>
  <Dropdown.Item>
    <Tooltip title="Share contact" arrow>
      <IconButton className="icon-btn-margin">
        <ShareIcon className="share-icon" />
      </IconButton>
    </Tooltip>
    Share
  </Dropdown.Item>
  <Dropdown.Item>
    <Tooltip title="Pdf of contact" arrow>
      <IconButton className="icon-btn-margin">
        <PictureAsPdfIcon className="picture-as-pdf-icon" />
      </IconButton>
    </Tooltip>
    PDF of contact
  </Dropdown.Item>
  <Dropdown.Item
    onClick={() => {
      console.log(index, "índex");
      console.log("edit card", edit);
      let { isedit, contactIndex, contact } = edit;
      console.log("passed1");
      for (let i = 0; i < users.length; i++) {
        console.log("passed2");
        if (i === index) {
          isedit = true;
          console.log("passed3");
          contactIndex = i;
          contact = users[i];
          console.log("passed4");
          const data = { isedit, contactIndex, contact };
          setedit(data);
          console.log(true);
          console.log(edit);
        }
      }
    }}
  >
    <Tooltip title="Edit contact" arrow>
      <IconButton className="icon-btn-margin">
        <EditIcon className="print-icon" />
      </IconButton>
    </Tooltip>
    Edit
  </Dropdown.Item>
  <Dropdown.Item>
    <Tooltip title="Video Call" arrow>
      <IconButton className="icon-btn-margin">
        <VoiceChatIcon className="voice-icon" />
      </IconButton>
    </Tooltip>
    Video Chat
  </Dropdown.Item>
</DropdownButton>; */
}
