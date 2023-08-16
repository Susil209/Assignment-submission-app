import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useLocalState from "../utils/useLocalStorage";
import FetchService from "../service/fetchService";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/Container";
import BadgeColorSelector from "../status/badgeColorSelector";
import CommentContainer from "../comment/commentContainer";
import Navbar from "../navbar/navbar";

export default function CodeReviewerAssignmentView() {
  const navigate = useNavigate();
  const params = useParams();
  const [token, setToken] = useLocalState("", "jwt");
  const [assignment, setAssignment] = useState({
    githubUrl: "",
    branch: "",
    number: null,
    status: null,
  });

  const [assignmentEnums, setAssignmentEnums] = useState([]);
  const [assignmentStatuses, setAssignmentStatuses] = useState([]);

  const previousAssignment = useRef(assignment);

  const updateAssignment = (key, value) => {
    const newAssignment = { ...assignment, [key]: value };
    setAssignment(newAssignment);
  };

  const updateAndSave = (status) => {
    // When the student submit the status it changed status from In review -> completed
    if (status && assignment.status !== status) {
      updateAssignment("status", status);
    } else {
      saveAssignment();
    }
  };

  const saveAssignment = async () => {
    await FetchService(
      `/api/assignments/${params.id}`,
      token,
      "PUT",
      assignment
    ).then((assignmentData) => {
      setAssignment(assignmentData);
    });
  };

  //compare old and new status values(by using useRef()), then update new status
  useEffect(() => {
    // console.log("Previous value of assignment", previousAssignment.current);
    if (previousAssignment.current.status !== assignment.status) {
      saveAssignment();
    }
    previousAssignment.current = assignment;
    // console.log("New value of assignment", assignment);
  }, [assignment]);

  //fetch the assignment/id on load
  useEffect(() => {
    FetchService(`/api/assignments/${params.id}`, token, "GET").then(
      (assignmentResponse) => {
        let assignmentData = assignmentResponse.assignment;
        if (assignmentData.branch === null) assignmentData.branch = "";
        if (assignmentData.githubUrl === null) assignmentData.githubUrl = "";
        setAssignment(assignmentData);
        setAssignmentEnums(assignmentResponse.assignmentEnum);
        setAssignmentStatuses(assignmentResponse.statusEnums);
      }
    );
  }, []);

  return (
    <>
    <Navbar/>
    <Container className="mt-5">
      <Row className="d-flex align-items-center">
        <Col>
          {assignment.number && <h1>Assignment #{assignment.number}</h1>}
        </Col>
        <Col>
          <BadgeColorSelector text={assignment.status} />
        </Col>
      </Row>
      {assignment && (
        <>
          <div>
            {/* GITHUB URL */}
            <Form.Group as={Row} className="my-3" controlId="githuburl">
              <Form.Label column sm="3" md="2">
                Github URL:{" "}
              </Form.Label>
              <Col sm="9" md="8" lg="6">
                <Form.Control
                  type="url"
                  readOnly
                  onChange={(e) =>
                    updateAssignment("githubUrl", e.target.value)
                  }
                  value={assignment.githubUrl}
                />
              </Col>
            </Form.Group>

            {/* BRANCH */}
            <Form.Group as={Row} className="mb-3" controlId="branch">
              <Form.Label column sm="3" md="2">
                Branch:{" "}
              </Form.Label>
              <Col sm="9" md="8" lg="6">
                <Form.Control
                  type="text"
                  readOnly
                  onChange={(e) => updateAssignment("branch", e.target.value)}
                  value={assignment.branch}
                />
              </Col>
            </Form.Group>

            {/* Video Url */}
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="codeReviewVideoUrl"
            >
              <Form.Label column sm="3" md="2">
                Video Review Url:{" "}
              </Form.Label>
              <Col sm="9" md="8" lg="6">
                <Form.Control
                  type="url"
                  onChange={(e) =>
                    updateAssignment("codeReviewVideoUrl", e.target.value)
                  }
                  value={assignment.codeReviewVideoUrl}
                  placeholder="https://screencast-o-matic.com/something"
                />
              </Col>
            </Form.Group>

            <div className="d-flex gap-5">
              {assignment.status === "Completed" ? (
                <Button
                  variant="secondary"
                  onClick={() => updateAndSave(assignmentStatuses[2].status)}
                >
                  ReClaim
                </Button>
              ) : (
                <Button
                  onClick={() => updateAndSave(assignmentStatuses[4].status)}
                >
                  Complete Review
                </Button>
              )}
              {assignment.status === "Needs Update" ? (
                <Button
                  variant="secondary"
                  onClick={() => updateAndSave(assignmentStatuses[2].status)}
                >
                  Reclaim Assignment
                </Button>
              ) : (
                <Button
                  variant="danger"
                  onClick={() => updateAndSave(assignmentStatuses[3].status)}
                >
                  Reject Assignment
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={() => navigate("/dashboard")}
              >
                Back
              </Button>
            </div>
          </div>
          <CommentContainer assignmentId={params.id} />
        </>
      )}
    </Container>
    </>
  );
}
