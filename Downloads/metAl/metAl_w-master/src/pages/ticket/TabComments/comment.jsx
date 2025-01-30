import React from "react";
import { Toast, ToastBody, ToastHeader, Button } from "reactstrap";
import FormatDate from "../../../common/formatDate";
import CommentForm from "./CommentForm";

const Comment = (props) => {
  const {
    replies,
    data,
    activeComment,
    handleActiveComment,
    addComment,
    deleteComment,
    updateComment,
    comment,
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
    activeComment && activeComment.id === comment._id && activeComment.type === "editing";
  const isReplying =
    activeComment && activeComment.id === comment._id && activeComment.type === "replying";
  const isQuoting =
    activeComment && activeComment.id === comment._id && activeComment.type === "quoting";

  const canDelete = currentUserId === comment.user._id;
  const canReply = Boolean(currentUserId);
  const canEdit = currentUserId === comment.user._id;

  const style =
    comment.parentId == null
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
                    comment.user.imageSrc
                      ? comment.user.imageSrc
                      : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  className="rounded-circle toast-avatar"
                  alt="Avatar"
                />
                <span className="toast-username">{comment.user.username}</span>
                <span className="toast-date">
                  <FormatDate inputDate={comment.createdOn} withTime={true} />
                </span>
              </div>
            </ToastHeader>
            <ToastBody>
              <p className="toast-comment">{comment.narrative}</p>
              <div className="comments-link">
                {canDelete && (
                  <Button color="link" onClick={() => deleteComment(comment._id)}>
                    <i className="fa fa-trash text-danger comment-link"></i>
                  </Button>
                )}
                {canEdit && (
                  <Button
                    color="link"
                    onClick={() =>
                      handleActiveComment({ id: comment._id, type: "editing" })
                    }
                  >
                    <i className="fa fa-edit text-primary comment-link"></i>
                  </Button>
                )}
                {canReply && (
                  <Button
                    color="link"
                    onClick={() =>
                      handleActiveComment({ id: comment._id, type: "replying" })
                    }
                  >
                    <i className="fa fa-reply text-primary comment-link"></i>
                  </Button>
                )}
                {canReply && (
                  <Button
                    color="link"
                    onClick={() =>
                      handleActiveComment({ id: comment._id, type: "quoting" })
                    }
                  >
                    <i className="fa fa-quote-right text-primary comment-link"></i>
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
                  comment.user.imageSrc
                    ? comment.user.imageSrc
                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                className="rounded-circle toast-avatar"
                alt="Avatar"
              />
              <span className="toast-username">{comment.user.username}</span>
              <span className="toast-date">
                <FormatDate inputDate={comment.createdOn} withTime={true} />
              </span>
            </div>
          </ToastHeader>
          <CommentForm
            onCancel={() => handleActiveComment(null)}
            submitLabel="Update"
            row="10"
            cols="20"
            initialText={comment.narrative}
            handleUpdate={(text) => updateComment({ ...comment, narrative: text })}
          />
        </div>
      )}
      {isReplying && (
        <div style={{ width: "70%" }}>
          <CommentForm
            onCancel={() => handleActiveComment(null)}
            submitLabel="Reply"
            initialText=""
            handleReply={(text) => addComment(text, comment._id, comment.name)}
          />
        </div>
      )}
      {isQuoting && (
        <div style={{ width: "70%" }}>
          <div className="comment-reply-quote">"{comment.narrative}"</div>
          <CommentForm
            onCancel={() => handleActiveComment(null)}
            submitLabel="Quote"
            initialText={''}
            handleReply={(text) => addComment('"'+comment.narrative+'"\n \n'+text, comment._id, comment.name)}
          />
        </div>
      )}

      {replies.length > 0 &&
        replies.map((child) => (
          <Comment
            comment={child}
            replies={getReplies(child._id)}
            data={data}
            activeComment={activeComment}
            handleActiveComment={handleActiveComment}
            addComment={addComment}
            deleteComment={deleteComment}
            updateComment={updateComment}
            currentUserId={currentUserId}
          />
        ))}
    </div>
  );
};

export default Comment;
