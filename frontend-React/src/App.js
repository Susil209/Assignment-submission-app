import React, { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Homepage from "./homepage/homepage";
import Login from "./login/login";
import PrivateRoute from "./privateRoute/privateRoute";
import AssignmentView from "./assignmentView/assignmentView";
import "bootstrap/dist/css/bootstrap.min.css";
import CodeReviewerDashboard from "./dashboard/codeReviewerDashboard";
import jwt_decode from "jwt-decode";
import Dashboard from "./dashboard/dashboard";
import CodeReviewerAssignmentView from "./assignmentView/codeReviewerAssignmentView";
import { useUser } from "./context/userProvider";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Homepage></Homepage>,
//   },
//   {
//     path: "/dashboard",
//     element: (
//       <RoleBasedRouting>
//         <CodeReviewerDashboard></CodeReviewerDashboard>
//       </RoleBasedRouting>
//     ),
//   },
//   {
//     path: "/assignments/:id",
//     element: (
//       <PrivateRoute>
//         <AssignmentView></AssignmentView>
//       </PrivateRoute>
//     ),
//   },
//   {
//     path: "/login",
//     element: <Login></Login>,
//   },
// ]);

function App() {
  console.log("Hello");
  // return <RouterProvider router={router} />;
  // const [token, setToken] = useLocalState("", "jwt");
  const [roles, setRoles] = useState([]);
  const user = useUser();

  //set the role decoded from token
  useEffect(() => {
    //getting roles by decoding the token
    const getRoleFromJwt = () => {
      if (user.token) {
        const decodedJwt = jwt_decode(user.token);
        return decodedJwt.authorities;
      }
      return [];
    };
    setRoles(getRoleFromJwt());
  }, [user.token]);

  return (
    <Routes>
      <Route path="/" element={<Homepage></Homepage>} />
      <Route path="/login" element={<Login></Login>} />
      <Route
        path="/dashboard"
        element={
          roles.find((role) => role === "ROLE_CODE_REVIEWER") ? (
            <PrivateRoute>
              <CodeReviewerDashboard />
            </PrivateRoute>
          ) : (
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          )
        }
      />
      <Route
        path="/assignments/:id"
        element={
          roles.find((role) => role === "ROLE_CODE_REVIEWER") ? (
            <PrivateRoute>
              <CodeReviewerAssignmentView></CodeReviewerAssignmentView>
            </PrivateRoute>
          ) : (
            <PrivateRoute>
              <AssignmentView></AssignmentView>
            </PrivateRoute>
          )
        }
      />
    </Routes>
  );
}

export default App;
