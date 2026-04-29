import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReportLostItem from "../components/student/ReportLostItem";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLostForm, setShowLostForm] = useState(false);

  const handleLogout = () => {
    alert("Logged out!");
    navigate("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleReportLost = () => {
    setShowLostForm(true);
    setIsDropdownOpen(false);
  };

  const handleReportFound = () => {
    alert("Report Found Item - Coming soon!");
    setIsDropdownOpen(false);
  };

  const handleCloseForm = () => {
    setShowLostForm(false);
  };

  const handleClickOutside = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className="student-dashboard-container" onClick={handleClickOutside}>
      <header className="student-full-header">
        <div className="student-header-content">
          <div className="student-logo">FOUNDU</div>
          <div className="student-header-actions">
            <span className="student-lang">Home</span>
            <span className="student-lang">About</span>
            <span className="student-lang">Contact</span>
            <button className="student-logout-top-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="student-main-content" onClick={(e) => e.stopPropagation()}>
        {!showLostForm ? (
          <div className="student-page-header">
            <h1 className="student-page-title">My Dashboard</h1>
            <div className="student-dropdown">
              <button className="student-report-btn" onClick={toggleDropdown}>
                Report New Item ▼
              </button>
              {isDropdownOpen && (
                <div className="student-dropdown-menu">
                  <button className="student-dropdown-item lost" onClick={handleReportLost}>
                    I Lost Something
                  </button>
                  <button className="student-dropdown-item found" onClick={handleReportFound}>
                    I Found Something
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <ReportLostItem onClose={handleCloseForm} />
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;