import React, { useState } from "react";
import useLocalState from "../utils/useLocalStorage";
import { Navigate } from "react-router-dom";
import FetchService from "../service/fetchService";
import { useUser } from "../context/userProvider";

export default function PrivateRoute({ children }) {
  // const [token, setToken] = useLocalState("", "jwt");
  const user = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(null);

  if (user.token) {
    FetchService(`/api/auth/validate?token=${user.token}`, user.token, "GET").then(
      (isValid) => {
        setIsValid(isValid);
        setIsLoading(false);
      }
    );
  } else {
    return <Navigate to="/login" />;
  }

  return isLoading ? (
    <div>Loading...</div>
  ) : isValid === true ? (
    children
  ) : (
    <Navigate to="/login" />
  );
}
