import React from "react";
import { Toast, ToastBody, ToastHeader, Button } from "reactstrap";
import FormatDate from "../../../common/formatDate";
import NoteForm from "./NoteForm";

const Note = (props) => {
  const {
    replies,
    data,
    activeNote,
    handleActiveNote,
    addNote,
    deleteNote,
    updateNote,
    note,
    currentUserId,
  } = props;

  const getReplies = (id) => {
    return data
      .filter((child) => {
        return id == child.parentId;
      })
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  };

  const isEditing =
    activeNote && activeNote.id === note._id && activeNote.type === "editing";
  const isReplying =
    activeNote && activeNote.id === note._id && activeNote.type === "replying";
  const isQuoting =
    activeNote && activeNote.id === note._id && activeNote.type === "quoting";

  const canDelete = currentUserId === note.user._id;
  const canReply = Boolean(currentUserId);
  const canEdit = currentUserId === note.user._id;

  const style =
    note.parentId == null
      ? { "padding-left": "0px" }
      : { "padding-left": "100px", "border-left": "solid 1px lightgrey" };

  return (
    <div style={style}>
      {!isEditing && (
        <div className="p-2 my-2 rounded">
          <Toast id="toast">
            <ToastHeader>
              <div style={{ fontSize: "14px", color: "grey" }}>
                <img
                  src={
                    note.user.imageSrc
                      ? note.user.imageSrc
                      : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  className="rounded-circle toast-avatar"
                  alt="Avatar"
                />
                <span className="toast-username">{note.user.username}</span>
                <span className="toast-date">
                  <FormatDate inputDate={note.createdOn} withTime={true} />
                </span>
              </div>
            </ToastHeader>
            <ToastBody>
              <p className="toast-note">{note.narrative}</p>
              <div className="notes-link">
                {canDelete && (
                  <Button color="link" onClick={() => deleteNote(note._id)}>
                    <i className="fa fa-trash text-danger note-link"></i>
                  </Button>
                )}
                {canEdit && (
                  <Button
                    color="link"
                    onClick={() =>
                      handleActiveNote({ id: note._id, type: "editing" })
                    }
                  >
                    <i className="fa fa-edit text-primary note-link"></i>
                  </Button>
                )}
                {canReply && (
                  <Button
                    color="link"
                    onClick={() =>
                      handleActiveNote({ id: note._id, type: "replying" })
                    }
                  >
                    <i className="fa fa-reply text-primary note-link"></i>
                  </Button>
                )}
                {canReply && (
                  <Button
                    color="link"
                    onClick={() =>
                      handleActiveNote({ id: note._id, type: "quoting" })
                    }
                  >
                    <i className="fa fa-quote-right text-primary note-link"></i>
                  </Button>
                )}
              </div>
            </ToastBody>
          </Toast>
        </div>
      )}
      {isEditing && (
        <div style={{ width: "70%" }}>
          <ToastHeader>
            <div style={{ fontSize: "14px", color: "grey" }}>
              <img
                src={
                  note.user.imageSrc
                    ? note.user.imageSrc
                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                className="rounded-circle toast-avatar"
                alt="Avatar"
              />
              <span className="toast-username">{note.user.username}</span>
              <span className="toast-date">
                <FormatDate inputDate={note.createdOn} withTime={true} />
              </span>
            </div>
          </ToastHeader>
          <NoteForm
            onCancel={() => handleActiveNote(null)}
            submitLabel="Update"
            row="10"
            cols="20"
            initialText={note.narrative}
            handleUpdate={(text) => updateNote({ ...note, narrative: text })}
          />
        </div>
      )}
      {isReplying && (
        <div style={{ width: "70%" }}>
          <NoteForm
            onCancel={() => handleActiveNote(null)}
            submitLabel="Reply"
            initialText=""
            handleReply={(text) => addNote(text, note._id, note.name)}
          />
        </div>
      )}
      {isQuoting && (
        <div style={{ width: "70%" }}>
          <div className="note-reply-quote">"{note.narrative}"</div>
          <NoteForm
            onCancel={() => handleActiveNote(null)}
            submitLabel="Quote"
            initialText={''}
            handleReply={(text) => addNote('"'+note.narrative+'"\n \n'+text, note._id, note.name)}
          />
        </div>
      )}

      {replies.length > 0 &&
        replies.map((child) => (
          <Note
            note={child}
            replies={getReplies(child._id)}
            data={data}
            activeNote={activeNote}
            handleActiveNote={handleActiveNote}
            addNote={addNote}
            deleteNote={deleteNote}
            updateNote={updateNote}
            currentUserId={currentUserId}
          />
        ))}
    </div>
  );
};

export default Note;
