import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Logged out!");
    navigate("/");
  };

  return (
    <div className="student-dashboard-container">
      <header className="student-full-header">
        <div className="student-header-content">
          <div className="student-logo">FoundU</div>
          <div className="student-header-actions">
            <span className="student-lang">Home</span>
            <span className="student-lang">About</span>
            <span className="student-lang">Contact</span>
            <button className="student-logout-top-btn" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </div>
      </header>

      <div className="student-main-content">
        <div className="student-page-header">
          <h1 className="student-page-title">My Dashboard</h1>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;