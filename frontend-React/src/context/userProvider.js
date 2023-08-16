import React, { createContext, useContext } from "react";
import useLocalState from "../utils/useLocalStorage";

//create context api
const UserContext = createContext();

function UserProvider({ children }) {
  const [token, setToken] = useLocalState("", "jwt");

  const value = { token, setToken };
  // context.Provider sets the scope for context
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

function useUser() {
    // now the context can be used on any level
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}

export { UserProvider, useUser };
