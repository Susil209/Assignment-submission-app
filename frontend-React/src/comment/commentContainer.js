import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../context/userProvider";
import FetchService from "../service/fetchService";
import Button from "react-bootstrap/esm/Button";
import CommentView from "./commentView";
import { useInterval } from "../utils/useInterval";
import dayjs from "dayjs";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

function CommentContainer() {
  const params = useParams();
  const user = useUser();

  const emptyComment = {
    id: null,
    text: "",
    assignmentId: Number(params.id),
    user: user.token,
    createdDate: null,
  };

  const [comment, setComment] = useState(emptyComment);
  const [comments, setComments] = useState([]);

  function formatComments(commentsCopy) {
    commentsCopy.forEach((comment) => {
      if (typeof comment.createdDate === "string") {
        comment.createdDate = dayjs(comment.createdDate);
      }
    });
    setComments(commentsCopy);
  }


  //update a comment
  const updateComment = (value) => {
    const newComment = { ...comment };
    newComment.text = value;
    setComment(newComment);
  };

  // Here we use same button both for creating a new comment and update the existing comment
  const submitComment = async () => {
    // Post comment for edit comment
    if (comment.id) {
      await FetchService(
        `/api/comments/${comment.id}`,
        user.token,
        "PUT",
        comment
      ).then((data) => {
        const newComments = [...comments];
        const index = newComments.findIndex(
          (comment) => comment.id === data.id
        );
        newComments[index] = comment;
        console.log(comment);
        formatComments(newComments);
        setComment(emptyComment);
      });
    } else {
      // Post comment for create comment
      await FetchService("/api/comments", user.token, "POST", comment).then(
        (comment) => {
          const newComments = [...comments];
          newComments.push(comment);
          formatComments(newComments);
          //After updating clear the text field
          setComment(emptyComment);
        }
      );
    }
  };

  //edit comment
  const handleEditComment = (commentId) => {
    //find the comment by id
    const index = comments.findIndex((comment) => comment.id === commentId);
    console.log(comments);
    //make a copy of original
    const updateComment = {
      id: comments[index].id,
      text: comments[index].text,
      assignmentId: Number(params.id),
      user: user.token,
      createdDate: comments[index].createdDate,
    };
    // console.log(updateComment);
    //set the comment in the textbox
    setComment(updateComment);
  };

  //Delete a comment
  const handleDeleteComment = (commentId) => {
    FetchService(`/api/comments/${commentId}`, user.token, "DELETE").then(
      (msg) => {
        const copyComments = [...comments];
        const index = copyComments.findIndex(
          (comment) => comment.id === commentId
        );
        copyComments.splice(index, 1);
        console.log(msg);
        formatComments(copyComments);
      }
    );
  };

  //get all comments on load
  useEffect(() => {
    FetchService(
      `/api/comments?assignmentId=${params.id}`,
      user.token,
      "GET",
      null
    ).then((comment) => {
      formatComments(comment);
    });
  }, []);

  //update the comment posted time without refreshing the page
  useInterval(() => {
    updateCommentTimeDisplay();
  }, 1000 * 5);

  function updateCommentTimeDisplay() {
    const commentsCopy = [...comments];
    commentsCopy.forEach(
      (comment) => (comment.createdDate = dayjs(comment.createdDate))
    );
    formatComments(commentsCopy);
  }

  return (
    <>
      <div className="mt-5">
        <h4>Comments</h4>
      </div>

      <Row>
        <Col lg="8" md="10" sm="12">
          <textarea
            style={{ width: "100%", borderRadius: "0.25em" }}
            onChange={(e) => updateComment(e.target.value)}
            value={comment.text}
          ></textarea>
        </Col>
      </Row>
      <Button onClick={submitComment}>Post Comment</Button>

      {comments && (
        <div className="my-5">
          {comments.map((comment) => (
            <CommentView
              key={comment.id}
              commentData={comment}
              emitEditEvent={handleEditComment}
              emitDeleteEvent={handleDeleteComment}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default CommentContainer;
