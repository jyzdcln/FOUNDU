import React from "react";
import { useNavigate } from "react-router-dom";

console.log("LoginPopup loaded");

const LoginPopup = ({
  isClosing,
  handleClosePopup,
  showAdminForm,
  handleShowAdminForm,
  handleBackToOptions,
  handleAdminSubmit,
  email,
  setEmail,
  password,
  setPassword,
  error,
  rememberMe,
  setRememberMe,
  isSwitching,
}) => {
  const navigate = useNavigate();

  const handleStudentLogin = () => {
    handleClosePopup();
    navigate("/student");
  };

  return (
    <div
      className={`popup-overlay ${isClosing ? "closing" : ""}`}
      onClick={handleClosePopup}
    >
      <div
        className={`popup-container ${isClosing ? "closing" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="popup-header">
          <h2>Log in</h2>
          <button className="close-btn" onClick={handleClosePopup}>
            ×
          </button>
        </div>

        <div className={`form-switch-wrapper ${isSwitching ? "switching" : ""}`}>
          {!showAdminForm ? (
            <div className="login-options">
              <button className="office365-btn" onClick={handleStudentLogin}>
                Log in with Office 365
              </button>

              <button className="admin-link" onClick={handleShowAdminForm}>
                Admin log in
              </button>
            </div>
          ) : (
            <form onSubmit={handleAdminSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-options">
                <label className="remember-checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>

                <button type="button" className="forgot-password-link">
                  Forgot password?
                </button>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="submit-btn">
                Log In
              </button>

              <button
                type="button"
                className="back-btn"
                onClick={handleBackToOptions}
              >
                Back to Options
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;