import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useUser } from "../context/userProvider";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

export default function CommentView(props) {
  const user = useUser();
  const decodedJwt = jwt_decode(user.token);

  const { id, createdDate, createdBy, text } = props.commentData;
  const { emitEditEvent, emitDeleteEvent } = props;

  //Posted time using dayjs library
  const [commentRelativeTime, setCommentRelativeTime] = useState("");

  useEffect(() => {
    // console.log(createdBy.name);
    updateCommentRelativeTime();
  }, [createdDate]);

  function updateCommentRelativeTime() {
    if (createdDate) {
      dayjs.extend(relativeTime);
      const commentTime = dayjs(createdDate).fromNow();
      setCommentRelativeTime(commentTime);
    }
  }

  // //update the time foe every 61 seconds
  // setInterval(() => {
  //   updateCommentRelativeTime();
  // }, 61*1000);

  return (
    <>
      <div className="comment-bubble">
        <div className="d-flex gap-5" style={{ fontWeight: "bold" }}>
          <div>{`${createdBy.name}`}</div>
          {decodedJwt.sub === createdBy.username ? (
            <>
              <div
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => emitEditEvent(id)}
              >
                edit
              </div>
              <div
                style={{ cursor: "pointer", color: "red" }}
                onClick={() => emitDeleteEvent(id)}
              >
                delete
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
        <div>{text}</div>
      </div>
      <div
        style={{ marginTop: "-1.25em", marginLeft: "1.4em", fontSize: "0.9em" }}
      >
        {commentRelativeTime ? `Posted ${commentRelativeTime}` : ""}
      </div>
    </>
  );
}
