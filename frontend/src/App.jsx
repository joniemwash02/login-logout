import React from 'react';
import LoginPage from './pages/LoginPage';
import Signup from './pages/Signup';
import { Routes, Route } from 'react-router-dom';
import Navbar from './pages/Navbar';
import VerificationEmailPage from './pages/VerificationEmailPage';  

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<h1>Welcome to the App</h1>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-email" element={<VerificationEmailPage />} />
      </Routes>
    </>
  );
};

export default App;