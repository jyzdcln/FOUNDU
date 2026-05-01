import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginPopup from "../components/LoginPopup";
import "../styles/global.css";
import founduLogo from "../assets/icons/foundulogo-icon.png";

const LandingPage = () => {
  const navigate = useNavigate();

  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const handleLoginClick = () => {
    setShowLoginPopup(true);
    setShowAdminForm(false);
    setIsClosing(false);
    setUsername("");
    setPassword("");
    setError("");
    setRememberMe(false);
    setIsSwitching(false);
  };

  const handleClosePopup = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowLoginPopup(false);
      setShowAdminForm(false);
      setIsClosing(false);
      setUsername("");
      setPassword("");
      setError("");
      setRememberMe(false);
      setIsSwitching(false);
    }, 300);
  };

  const handleShowAdminForm = () => {
    setIsSwitching(true);
    setTimeout(() => {
      setShowAdminForm(true);
      setIsSwitching(false);
    }, 200);
  };

  const handleBackToOptions = () => {
    setIsSwitching(true);
    setTimeout(() => {
      setShowAdminForm(false);
      setIsSwitching(false);
    }, 200);
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "admin123") {
      if (rememberMe) {
        localStorage.setItem("rememberedUsername", username);
      } else {
        localStorage.removeItem("rememberedUsername");
      }
      alert("Admin login successful!");
      handleClosePopup();
      navigate("/admin-dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  const handleLostClick = () => {
    alert("Report Lost Item - Coming soon!");
  };

  const handleFoundClick = () => {
    alert("Report Found Item - Coming soon!");
  };

  return (
    <>
      <div className="full-width-wrapper">
        <header className="full-header">
          <div className="header-content">
            <div className="logo">
              <img src={founduLogo} alt="FoundU" className="logo-img" />
            </div>
            <div className="nav-center">
              <span className="lang">Home</span>
              <span className="lang">About</span>
              <span className="lang">Contact</span>
            </div>
            <div className="header-actions">
              <button className="login-btn" onClick={handleLoginClick}>
                Login
              </button>
            </div>
          </div>
        </header>

        <div className="hero-section">
          <h1 className="hero-title">
            Where lost belongings find
            <br />
            their way home
          </h1>
          <p className="hero-subtitle">
            A lost & found where every item matters.
            <br />
            Report what's missing. Post what's found.
          </p>
          <div className="hero-buttons">
            <button className="hero-btn found-btn" onClick={handleFoundClick}>
              I've found something
            </button>
            <button className="hero-btn lost-btn" onClick={handleLostClick}>
              I've lost something
            </button>
          </div>
        </div>
      </div>

      {showLoginPopup && (
        <LoginPopup
          isClosing={isClosing}
          handleClosePopup={handleClosePopup}
          showAdminForm={showAdminForm}
          handleShowAdminForm={handleShowAdminForm}
          handleBackToOptions={handleBackToOptions}
          handleAdminSubmit={handleAdminSubmit}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          error={error}
          rememberMe={rememberMe}
          setRememberMe={setRememberMe}
          isSwitching={isSwitching}
        />
      )}
    </>
  );
};

export default LandingPage;