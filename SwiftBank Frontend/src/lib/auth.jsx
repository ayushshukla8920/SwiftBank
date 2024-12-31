import { Navigate } from "react-router-dom";
import axios from "axios";

const Auth = ({ children }) => {
  const isAuthenticated = document.cookie.includes("sessionId");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Auth;
