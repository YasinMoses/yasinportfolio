import React, { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import Comment from "./comment";
import Accordian from "./Accordian";
import auth from "../../../services/authservice";
import {
  getInternalComments,
  saveInternalComment,
  deleteInternalComment,
} from "../../../services/internalcomments";
import "./comments.css";

const TabComments = ({ createdAt, topicId }) => {
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState({});
  const [activeComment, setActiveComment] = useState({});

  const rootComments = comments.filter((comment) => {
    return comment.parentId === null;
  });

  const replies = (commentId) => {
    return comments
      .filter((comment) => {
        return comment.parentId === commentId;
      })
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  };

  const saveComments = async (comment) => {
    try {
      const afterSave = await saveInternalComment(comment);
      if (afterSave.status == 200) {
        setActiveComment({});
        fetchComments();
      } else {
        window.alert(afterSave.statusText);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onSubmitComments = (text, title) => {
    console.log("added", text, title, user);

    if (title == "" || null || undefined) {
      window.alert("Please select the Title first");
      return;
    } else if (text == "" || null || undefined) {
      window.alert("Comment description is empty");
      return;
    }

    const newComment = {
      name: title,
      narrative: text,
      parentId: null,
      topicId: topicId,
      user: user._id,
      createdOn: new Date().toLocaleDateString(),
      createdAt: createdAt,
    };

    saveComments(newComment);
  };

  const replyComment = (text, parrentId, title) => {
    if (text == "" || null || undefined) {
      window.alert("Reply is empty write Something.!");
      return;
    }

    const newComment = {
      name: title,
      narrative: text,
      parentId: parrentId,
      topicId: topicId,
      user: user._id,
      createdOn: new Date().toLocaleDateString(),
      createdAt: createdAt,
    };

    saveComments(newComment);
  };

  const deleteComment = async (id) => {
    console.log("add comment", id);

    if (window.confirm("Are you sure you want to remove comment?")) {
      try {
        const res = await deleteInternalComment(id);
        console.log(res);
        if (res.status == 200) {
          window.alert("Comments deleted.!");
          fetchComments();
        } else {
          window.alert(res.statusText);
        }
      } catch (e) {
        window.alert(e);
      }
    }
  };

  const updateComment = async (newComment) => {
    console.log("update comment", newComment);
    try {
      const res = await saveInternalComment(newComment);
      if (res.status == 200) {
        setActiveComment({});
        fetchComments();
      } else {
        window.alert(res.statusText);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleActiveComment = (res) => {
    setActiveComment(res);
  };

  const getUser = async () => {
    const u = await auth.getProfile();
    setUser(u);
  };

  const fetchComments = async () => {
    const commentsData = await getInternalComments();
    console.log(commentsData.data);
    setComments(commentsData.data);
  };

  useEffect(() => {
    fetchComments();
    getUser();
  }, []);

  return (
    <div className="panel-body">
      <fieldset>
        <legend className="legend-text">Private Comments</legend>
        <CommentForm
          handleSubmit={onSubmitComments}
          submitLabel="Submit"
          initialText=""
        />
        <br />
        <hr />
        <br />
        <div className="comments-container">
          {rootComments?.map((comment) => {
            {
              return comment.parrentId == null ? (
                <Accordian title={comment.name} date={comment.createdOn}>
                  <Comment
                    comment={comment}
                    replies={replies(comment._id)}
                    data={comments}
                    activeComment={activeComment}
                    handleActiveComment={handleActiveComment}
                    addComment={replyComment}
                    deleteComment={deleteComment}
                    updateComment={updateComment}
                    currentUserId={user._id}
                  />
                </Accordian>
              ) : (
                <Comment
                  comment={comment}
                  replies={replies(comment.id)}
                  data={comments}
                  activeComment={activeComment}
                  handleActiveComment={handleActiveComment}
                  addComment={replyComment}
                  deleteComment={deleteComment}
                  updateComment={updateComment}
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

export default TabComments;
