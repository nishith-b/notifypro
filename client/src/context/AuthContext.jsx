// AuthContext.jsx
import { createContext, useContext, useState } from "react";
import { storage } from "../utils/storage";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.getSession());

  // Accept full user object with name, email, etc.
  const login = (userObj) => {
    storage.saveSession(userObj);
    setUser(userObj);
  };

  const signup = (userObj) => {
    storage.saveSession(userObj);
    setUser(userObj);
  };

  const logout = () => {
    storage.clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
