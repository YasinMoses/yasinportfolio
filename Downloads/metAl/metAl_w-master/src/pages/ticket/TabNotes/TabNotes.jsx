import React, { useState, useEffect } from "react";
import NoteForm from "./NoteForm";
import Note from "./Note";
import Accordian from "./Accordian";
import auth from "../../../services/authservice";
import {
  getInternalNotes,
  saveInternalNote,
  deleteInternalNote,
} from "../../../services/internalnotes";
import "./notes.css";

const TabNotes = ({ createdAt, topicId }) => {
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState({});
  const [activeNote, setActiveNote] = useState({});

  const rootNotes = notes.filter((note) => {
    return note.parentId === null;
  });

  const replies = (noteId) => {
    return notes
      .filter((note) => {
        return note.parentId === noteId;
      })
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  };

  const saveNotes = async (note) => {
    try {
      const afterSave = await saveInternalNote(note);
      if (afterSave.status == 200) {
        setActiveNote({});
        fetchNotes();
      } else {
        window.alert(afterSave.statusText);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onSubmitNotes = (text, title) => {
    console.log("added", text, title, user);

    if (title == "" || null || undefined) {
      window.alert("Please select the Title first");
      return;
    } else if (text == "" || null || undefined) {
      window.alert("Note description is empty");
      return;
    }

    const newNote = {
      name: title,
      narrative: text,
      parentId: null,
      topicId: topicId,
      user: user._id,
      createdOn: new Date().toLocaleDateString(),
      createdAt: createdAt,
    };

    saveNotes(newNote);
  };

  const replyNote = (text, parrentId, title) => {
    if (text == "" || null || undefined) {
      window.alert("Reply is empty write Something.!");
      return;
    }

    const newNote = {
      name: title,
      narrative: text,
      parentId: parrentId,
      topicId: topicId,
      user: user._id,
      createdOn: new Date().toLocaleDateString(),
      createdAt: createdAt,
    };

    saveNotes(newNote);
  };

  const deleteNote = async (id) => {
    console.log("add note", id);

    if (window.confirm("Are you sure you want to remove comment?")) {
      try {
        const res = await deleteInternalNote(id);
        console.log(res);
        if (res.status == 200) {
          window.alert("Notes deleted.!");
          fetchNotes();
        } else {
          window.alert(res.statusText);
        }
      } catch (e) {
        window.alert(e);
      }
    }
  };

  const updateNote = async (newNote) => {
    console.log("update note", newNote);
    try {
      const res = await saveInternalNote(newNote);
      if (res.status == 200) {
        setActiveNote({});
        fetchNotes();
      } else {
        window.alert(res.statusText);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleActiveNote = (res) => {
    setActiveNote(res);
  };

  const getUser = async () => {
    const u = await auth.getProfile();
    setUser(u);
  };

  const fetchNotes = async () => {
    const notesData = await getInternalNotes();
    console.log(notesData.data);
    setNotes(notesData.data);
  };

  useEffect(() => {
    fetchNotes();
    getUser();
  }, []);

  return (
    <div className="panel-body">
      <fieldset>
        <legend className="legend-text">Private Notes</legend>
        <NoteForm
          handleSubmit={onSubmitNotes}
          submitLabel="Submit"
          initialText=""
        />
        <br />
        <hr />
        <br />
        <div className="notes-container">
          {rootNotes?.map((note) => {
            {
              return note.parrentId == null ? (
                <Accordian title={note.name} date={note.createdOn}>
                  <Note
                    note={note}
                    replies={replies(note._id)}
                    data={notes}
                    activeNote={activeNote}
                    handleActiveNote={handleActiveNote}
                    addNote={replyNote}
                    deleteNote={deleteNote}
                    updateNote={updateNote}
                    currentUserId={user._id}
                  />
                </Accordian>
              ) : (
                <Note
                  note={note}
                  replies={replies(note.id)}
                  data={notes}
                  activeNote={activeNote}
                  handleActiveNote={handleActiveNote}
                  addNote={replyNote}
                  deleteNote={deleteNote}
                  updateNote={updateNote}
                  currentUserId={user._id}
                />
              );
            }
          })}
        </div>
      </fieldset>
    </div>
  );
};

export default TabNotes;