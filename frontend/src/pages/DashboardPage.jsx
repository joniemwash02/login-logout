import React from "react";
import useAuthStore from "../store/authStore";
const DashboardPage = () => {
  const { user } = useAuthStore();

  return (
    <>
      <h1>Welcome to your dashboard, {user.name}!</h1>
      <p>Your email: {user.email}</p>
    </>
  );
};

export default DashboardPage;
