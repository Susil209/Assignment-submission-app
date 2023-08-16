import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Image } from "react-bootstrap";
import logo from "../Image/leaf-logo.png";
import jwt_decode from "jwt-decode";
import { useUser } from "../context/userProvider";

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useUser();
  const [authorities, setAuthorities] = useState(null);

  useEffect(() => {
    if (user && user.jwt) {
      const decodedJwt = jwt_decode(user.jwt);
      setAuthorities(decodedJwt.authorities);
    }
  }, [user, user.jwt]);

  return (
    <div className="NavBar nav d-flex justify-content-around justify-content-lg-between">
      <div className="ms-md-5">
        <Link to="/">
          <Image src={logo} alt="logo" className="logo" />
        </Link>
      </div>
      <div>
        {user && user.token ? (
          <span
            className="link"
            style={{ cursor: "pointer" }}
            onClick={() => {
              user.setToken(null);
              navigate("/login");
            }}
          >
            Logout
          </span>
        ) : pathname !== "/login" ? (
          <Button
            variant="primary"
            className="me-5"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </Button>
        ) : (
          <></>
        )}

        {user && user.token ? (
          <Button
            className="ms-5 ms-md-5 me-md-5"
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            Dashboard
          </Button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
