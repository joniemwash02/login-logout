import React, { use, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Signup from "./pages/Signup";
import Navbar from "./pages/Navbar";
import VerificationEmailPage from "./pages/VerificationEmailPage";
import useAuthStore from "./store/authStore";
import LoadingPage from "./pages/LoadingPage";
import DashboardPage from "./pages/DashboardPage";

const ProtectRoute = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <LoadingPage />;
  }

  if (!isAuthenticated && !user) {
    return <Navigate to="/login" replace />;
  }
   
  return children;
};
const AuthenticatedUserRoute=({children})=>{
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <LoadingPage />;
  }

  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const App = () => {
  const { checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []); // ✅ only run once

  if (isCheckingAuth) {
    return <LoadingPage />;
  }
  

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<h1>Welcome to the App</h1>} />
        <Route path="/signup" element={<AuthenticatedUserRoute><Signup /></AuthenticatedUserRoute>} />
        <Route path="/login" element={<AuthenticatedUserRoute><LoginPage /></AuthenticatedUserRoute>} />
        <Route path="/verify-email" element={<VerificationEmailPage />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectRoute>
              <DashboardPage />
            </ProtectRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
