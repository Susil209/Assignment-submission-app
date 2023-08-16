import React, { useEffect, useState } from "react";

import FetchService from "../service/fetchService";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import jwt_decode from "jwt-decode";
import "../App.css";
import BadgeColorSelector from "../status/badgeColorSelector";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userProvider";
import Navbar from "../navbar/navbar";

function CodeReviewerDashboard() {
  const navigate = useNavigate();
  //context api call
  const user = useUser();
  const [assignments, setAssignments] = useState(null);

  useEffect(() => {
    if (!user.token) navigate("/login");
  });

  function claimAssignment(assignment) {
    const decodedJwt = jwt_decode(user.token);
    const codeReviewer = {
      username: decodedJwt.sub,
    };

    assignment.codeReviewer = codeReviewer;
    // TODO: don't hardcode this status
    assignment.status = "In Review";
    FetchService(`/api/assignments/${assignment.id}`, user.token, "PUT", assignment).then(
      (updatedAssignment) => {
        //TODO: update the view for the assignment that changed
        const assignmentsCopy = [...assignments];
        const i = assignmentsCopy.findIndex((a) => a.id === assignment.id);
        assignmentsCopy[i] = updatedAssignment;
        setAssignments(assignmentsCopy);
      }
    );
  }

  //Loading assignments on page refresh
  useEffect(() => {
    FetchService("/api/assignments", user.token, "GET").then(
      (assignmentData) => {
        setAssignments(assignmentData);
      }
    );
  }, [user.token]);

  return (
    <>
    <Navbar/>
    <div style={{ margin: "2em" }}>
      {/* <Row>
        <Col>
          <div
            className="d-flex justify-content-end"
            style={{ cursor: "pointer" }}
            onClick={() => {
              user.setToken(null);
              navigate("/login");
            }}
          >
            Logout
          </div>
        </Col>
      </Row> */}
      <Row>
        <Col>
          <h1>Code Reviewer Dashboard</h1>
        </Col>
      </Row>

      {/* For In Review status */}
      <div className="assignment-wrapper in-review">
        <div className="assignment-wrapper-title">In Review</div>
        {assignments &&
        assignments.filter((assignment) => assignment.status === "In Review")
          .length > 0 ? (
          <div
            className="d-grid gap-5"
            style={{ gridTemplateColumns: "repeat(auto-fit,18rem)" }}
          >
            {assignments &&
              assignments
                .filter((assignment) => assignment.status === "In Review")
                .map((assignment) => (
                  <Card
                    key={assignment.id}
                    style={{ width: "18rem", height: "16rem" }}
                  >
                    <Card.Body className="d-flex flex-column justify-content-around">
                      <Card.Title>Assignment #{assignment.number}</Card.Title>
                      <div className="align-items-start">
                        <BadgeColorSelector text={assignment.status} />
                      </div>

                      <Card.Text>
                        <span>
                          <strong>Github URL: </strong>
                          {assignment.githubUrl}
                        </span>
                        <br />
                        <span>
                          {" "}
                          <strong>Branch: </strong>
                          {assignment.branch}
                        </span>
                      </Card.Text>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          navigate(`/assignments/${assignment.id}`);
                        }}
                      >
                        Edit Claim
                      </Button>
                    </Card.Body>
                  </Card>
                ))}
          </div>
        ) : (
          <div>No assignments found</div>
        )}
      </div>

      {/* For Submitted and Resubmitted status */}
      <div className="assignment-wrapper submitted">
        <div className="assignment-wrapper-title">Awaiting Review</div>
        {assignments &&
        assignments.filter(
          (assignment) =>
            assignment.status === "Submitted" ||
            assignment.status === "Resubmitted"
        ).length > 0 ? (
          <div
            className="d-grid gap-5"
            style={{ gridTemplateColumns: "repeat(auto-fit,18rem)" }}
          >
            {assignments &&
              assignments
                .filter(
                  (assignment) =>
                    assignment.status === "Submitted" ||
                    assignment.status === "Resubmitted"
                ) // for status = Resubmitted , sort assignments in ascending else descending.
                .sort((a, b) => {
                  if (a.status === "Resubmitted") return -1;
                  else return 1;
                })
                .map((assignment) => (
                  <Card
                    key={assignment.id}
                    style={{ width: "18rem", height: "16rem" }}
                  >
                    <Card.Body className="d-flex flex-column justify-content-around">
                      <Card.Title>Assignment #{assignment.number}</Card.Title>
                      <div className="align-items-start">
                        <BadgeColorSelector text={assignment.status} />
                      </div>

                      <Card.Text>
                        <span>
                          <strong>Github URL: </strong>
                          {assignment.githubUrl}
                        </span>
                        <br />
                        <span>
                          {" "}
                          <strong>Branch: </strong>
                          {assignment.branch}
                        </span>
                      </Card.Text>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          claimAssignment(assignment);
                        }}
                      >
                        Claim Assignment
                      </Button>
                    </Card.Body>
                  </Card>
                ))}
          </div>
        ) : (
          <div>No assignments found</div>
        )}
      </div>

      {/* For Needs Update status */}
      <div className="assignment-wrapper needs-update">
        <div className="assignment-wrapper-title">Needs Update</div>
        {assignments &&
        assignments.filter((assignment) => assignment.status === "Needs Update")
          .length > 0 ? (
          <div
            className="d-grid gap-5"
            style={{ gridTemplateColumns: "repeat(auto-fit,18rem)" }}
          >
            {assignments &&
              assignments
                .filter((assignment) => assignment.status === "Needs Update")
                .map((assignment) => (
                  <Card
                    key={assignment.id}
                    style={{ width: "18rem", height: "16rem" }}
                  >
                    <Card.Body className="d-flex flex-column justify-content-around">
                      <Card.Title>Assignment #{assignment.number}</Card.Title>
                      <div className="align-items-start">
                        <BadgeColorSelector text={assignment.status} />
                      </div>

                      <Card.Text>
                        <span>
                          <strong>Github URL: </strong>
                          {assignment.githubUrl}
                        </span>
                        <br />
                        <span>
                          {" "}
                          <strong>Branch: </strong>
                          {assignment.branch}
                        </span>
                      </Card.Text>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          navigate(`/assignments/${assignment.id}`);
                        }}
                      >
                        View Assignment
                      </Button>
                    </Card.Body>
                  </Card>
                ))}
          </div>
        ) : (
          <div>No assignments found</div>
        )}
      </div>
    </div>
    </>
  );
}

export default CodeReviewerDashboard;
