import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import FetchService from "../service/fetchService";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/Container";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import BadgeColorSelector from "../status/badgeColorSelector";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userProvider";
import CommentContainer from "../comment/commentContainer";
import Navbar from "../navbar/navbar";

export default function AssignmentView() {
  const navigate = useNavigate();
  const params = useParams();
  // const [token, setToken] = useLocalState("", "jwt");
  const user = useUser();
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
    // When the student submit the status for the first time,change status from pending -> submitted
    if (status && assignment.status !== status) {
      updateAssignment("status", status);
    } else {
      saveAssignment();
    }

    // await fetch(`/api/assignments/${params.id}`, {
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    //   method: "PUT",
    //   body: JSON.stringify(assignment),
    // })
    //   .then((response) => {
    //     if (response.status === 200) return response.json();
    //   })
  };

  const saveAssignment = async () => {
    await FetchService(
      `/api/assignments/${params.id}`,
      user.token,
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
    FetchService(`/api/assignments/${params.id}`, user.token, "GET").then(
      (assignmentResponse) => {
        let assignmentData = assignmentResponse.assignment;
        if (assignmentData.branch === null) assignmentData.branch = "";
        if (assignmentData.githubUrl === null) assignmentData.githubUrl = "";
        setAssignment(assignmentData);
        setAssignmentEnums(assignmentResponse.assignmentEnum);
        setAssignmentStatuses(assignmentResponse.statusEnums);
        // console.log(assignmentResponse.statusEnums);
      }
    );
    // fetch(`/api/assignments/${params.id}`, {
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    //   method: "GET",
    // })
    //   .then((response) => {
    //     if (response.status === 200) return response.json();
    //   })
  }, []);

  // useEffect(() => {
  //   console.log(assignmentStatuses);
  // }, [assignmentStatuses])

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
          <Form.Group as={Row} className="my-3">
            <Form.Label column sm="3" md="2">
              Assignment Number:
            </Form.Label>
            <Col sm="9" md="8" lg="6">
              <DropdownButton
                as={ButtonGroup}
                id="assignmentName"
                variant="info"
                title={
                  assignment.number
                    ? `Assignment ${assignment.number}`
                    : "Select Any"
                }
                onSelect={(selectedElement) => {
                  updateAssignment("number", selectedElement);
                }}
              >
                {assignmentEnums.map((assignmentEnum) => (
                  <Dropdown.Item
                    key={assignmentEnum.assignmentNum}
                    eventKey={assignmentEnum.assignmentNum}
                  >
                    Assignment {assignmentEnum.assignmentNum}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="my-3">
            <Form.Label column sm="2">
              Github URL:{" "}
            </Form.Label>
            <Col sm="5">
              <Form.Control
                type="url"
                id="githuburl"
                onChange={(e) => updateAssignment("githubUrl", e.target.value)}
                value={assignment.githubUrl}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
              Branch:{" "}
            </Form.Label>
            <Col sm="5">
              <Form.Control
                id="branch"
                type="text"
                onChange={(e) => updateAssignment("branch", e.target.value)}
                value={assignment.branch}
              />
            </Col>
          </Form.Group>

          {assignment.status === "Completed" ? (
            <>
              <Form.Group
                as={Row}
                className="d-flex align-items-center mb-3"
                controlId="codeReviewVideoUrl"
              >
                <Form.Label column sm="2">
                  Code Review Video Url:{" "}
                </Form.Label>
                <Col sm="5" className="fw-bold">
                  <a href={assignment.codeReviewVideoUrl}>
                    {assignment.codeReviewVideoUrl}
                  </a>
                </Col>
              </Form.Group>

              <div>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/dashboard")}
                >
                  Back
                </Button>
              </div>
            </>
          ) : assignment.status === "Pending Submission" ? (
            <div className="d-flex gap-5">
              <Button onClick={() => updateAndSave("Submitted")}>
                Submit Assignment
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate("/dashboard")}
              >
                Back
              </Button>
            </div>
          ) : (
            <div className="d-flex gap-5">
              <Button onClick={() => updateAndSave("Resubmitted")}>
                Resubmit Assignment
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate("/dashboard")}
              >
                Back
              </Button>
            </div>
          )}
        </div>
        <CommentContainer assignmentId={params.id}/>
        </>
      )}
    </Container>
    </>
  );
}
