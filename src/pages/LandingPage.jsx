import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginPopup from "../components/LoginPopup";
import "../styles/global.css";

const LandingPage = () => {
  const navigate = useNavigate();

  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const handleLoginClick = () => {
    setShowLoginPopup(true);
    setShowAdminForm(false);
    setIsClosing(false);
    setEmail("");
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
      setEmail("");
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

    if (email === "admin@account.com" && password === "admin123") {
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      alert("Admin login successful!");
      handleClosePopup();
      navigate("/admin-dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <>
      {/* HEADER */}
      <div className="full-width-wrapper">
        <header className="full-header">
          <div className="header-content">
            <div className="logo">FOUNDU</div>
            <div className="header-actions">
              <span className="lang">Home</span>
                <span className="lang">About</span>
                  <span className="lang">Contact</span>
              <button className="login-btn" onClick={handleLoginClick}>
                Log In
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* POPUP */}
      {showLoginPopup && (
        <LoginPopup
          isClosing={isClosing}
          handleClosePopup={handleClosePopup}
          showAdminForm={showAdminForm}
          handleShowAdminForm={handleShowAdminForm}
          handleBackToOptions={handleBackToOptions}
          handleAdminSubmit={handleAdminSubmit}
          email={email}
          setEmail={setEmail}
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