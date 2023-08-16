import React, { useEffect, useState } from "react";
import useLocalState from "../utils/useLocalStorage";
import { Link, useNavigate } from "react-router-dom";
import FetchService from "../service/fetchService";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/esm/Badge";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import BadgeColorSelector from "../status/badgeColorSelector";
import { useUser } from "../context/userProvider";
import Navbar from "../navbar/navbar";

function Dashboard() {
  const navigate = useNavigate();
  //custom hook
  // const [token, setToken] = useLocalState("", "jwt");

  //context api call
  const user = useUser(); 

  const [assignments, setAssignments] = useState(null);

  //Loading assignments on page refresh
  useEffect(() => {
    FetchService("/api/assignments", user.token, "GET").then((assignmentData) => {
      setAssignments(assignmentData);
    });
    if(!user.token) navigate("/login");
    // fetch("/api/assignments", {
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    //   method: "GET",
    // })
    //   .then((response) => {
    //     if (response.status === 200) return response.json();
    //   })
  }, [navigate, user.token]);

  //create new assignment
  const createAssignment = async () => {
    await FetchService("/api/assignments", user.token, "POST").then((assignment) => {
      console.log(assignment);
      navigate(`/assignments/${assignment.id}`);
    });

    // await fetch("/api/assignments", {
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    //   method: "POST",
    // })
    //   .then((response) => {
    //     if (response.status === 200) return response.json();
    //   })
  };

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
      <Button className="mb-3" onClick={createAssignment}>
        Submit the assignment
      </Button>
      <div
        className="d-grid gap-5"
        style={{ gridTemplateColumns: "repeat(auto-fit,18rem)" }}
      >
        {assignments &&
          assignments.map((assignment) => (
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
                {assignment.status === "Completed" ? <Button
                  variant="secondary"
                  onClick={() => {
                    navigate(`/assignments/${assignment.id}`);
                  }}
                >
                  View Card
                </Button> : <Button
                  variant="secondary"
                  onClick={() => {
                    navigate(`/assignments/${assignment.id}`);
                  }}
                >
                  Edit Card
                </Button>}
              </Card.Body>
            </Card>
          ))}
      </div>
    </div>
    </>
  );
}

export default Dashboard;
