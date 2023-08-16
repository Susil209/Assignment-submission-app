import React, { useEffect, useState } from "react";
import useLocalState from "../utils/useLocalStorage";
import { Form, Button, Container, Col, Row } from "react-bootstrap";
import { useUser } from "../context/userProvider";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar/navbar";

function Login() {
  //using custom hook for localStorage
  // const [token, setToken] = useLocalState("", "jwt");

  //using context api
  const user = useUser();

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // useEffect(() => {
  //   if (user.jwt) {
  //     navigate("/dashboard");
  //   }
  // }, [user]);

  const handleChangeName = (e) => {
    setUsername(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const sendLoginRequest = async () => {
    const reqBody = {
      username: username,
      password: password,
    };

    await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(reqBody),
    })
      .then((response) => {
        if (response.status === 200) {
          return Promise.all([response.json(), response.headers]);
        } else {
          return Promise.reject("Invalid login attempt.");
        }
      })
      .then(([body, headers]) => {
        user.setToken(headers.get("authorization"));
        navigate("/dashboard");
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <>
    <Navbar />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md="6" lg="8">
            <Form.Group className="mb-3" controlId="username">
              <Form.Label className="fs-5">Username</Form.Label>
              <Form.Control
                type="email"
                value={username}
                onChange={handleChangeName}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col md="6" lg="8">
            <Form.Group className="mb-3" controlId="password">
              <Form.Label className="fs-5">Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={handleChangePassword}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col
            md="6"
            lg="8"
            className="d-flex flex-column flex-md-row justify-content-between"
          >
            <Button
              className="mt-4"
              id="submit"
              type="button"
              size="lg"
              onClick={sendLoginRequest}
            >
              Login
            </Button>
            <Button
              variant="secondary"
              className="mt-4"
              id="submit"
              type="button"
              size="lg"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              Exit
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Login;
