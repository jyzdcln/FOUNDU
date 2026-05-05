import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import ReportLostItem from "../components/admin/ReportLostItem";
import ReportFoundItem from "../components/admin/ReportFoundItem";
import ViewReports from "./ViewReports";
import { getReports } from "../services/reportService";

import dashboardIcon from "../assets/icons/dashboard-icon.png";
import viewReportsIcon from "../assets/icons/verified-icon.png";
import matchedIcon from "../assets/icons/matched-icon.png";
import claimedIcon from "../assets/icons/claimed-icon.png";
import adminLostIcon from "../assets/icons/admin-lost-icon.png";
import adminFoundIcon from "../assets/icons/admin-found-icon.png";
import adminUserIcon from "../assets/icons/admin-user-icon.png";
import adminDropdownIcon from "../assets/icons/admin-dropdown-icon.png";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [allReports, setAllReports] = useState([]);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportType, setReportType] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("rememberedUsername");
    localStorage.removeItem("user");
    alert("Logged out successfully!");
    navigate("/");
  };

  const handleSettings = () => {
    alert("Settings - Coming soon!");
    setIsDropdownOpen(false);
  };

  const handleMenuClick = (menu) => {
    setShowReportForm(false);
    setActiveMenu(menu);
    if (menu === "viewreports") {
      loadAllReports();
    }
  };

  const handleReportLost = () => {
    setReportType("lost");
    setShowReportForm(true);
    setActiveMenu("lost");
  };

  const handleReportFound = () => {
    setReportType("found");
    setShowReportForm(true);
    setActiveMenu("found");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    loadAllReports();
  }, []);

  const loadAllReports = async () => {
    const reports = await getReports();
    setAllReports(reports);
  };

  const getPageTitle = () => {
    if (showReportForm) {
      return reportType === "lost" ? "Report Lost Item" : "Report Found Item";
    }
    switch(activeMenu) {
      case "dashboard": return "Dashboard";
      case "viewreports": return "View Reports";
      case "matched": return "Matched Items";
      case "claimed": return "Claimed Items";
      default: return "Dashboard";
    }
  };

  const getPageContent = () => {
    if (showReportForm) {
      if (reportType === "lost") {
        return <ReportLostItem />;
      } else {
        return <ReportFoundItem />;
      }
    }
    
    switch(activeMenu) {
      case "dashboard":
        return <div className="content-box"></div>;
      case "viewreports":
        return <ViewReports />;
      case "matched":
        return (
          <div className="content-box">
            <p>Coming soon... (Matched Items)</p>
          </div>
        );
      case "claimed":
        return (
          <div className="content-box">
            <p>Coming soon... (Claimed Items)</p>
          </div>
        );
      default:
        return <p>Welcome to Dashboard</p>;
    }
  };

  const pendingCount = allReports.filter(r => r.status === "pending").length;
  const verifiedCount = allReports.filter(r => r.status === "verified").length;
  const rejectedCount = allReports.filter(r => r.status === "rejected").length;

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <p>Welcome, Jayz Daclan</p>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <div className="sidebar-section-title">MAIN</div>
            <button className={`nav-item ${activeMenu === "dashboard" ? "active" : ""}`} onClick={() => handleMenuClick("dashboard")}>
              <img src={dashboardIcon} alt="dashboard" className="nav-icon-img" />
              Dashboard
            </button>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-title">REPORTS MANAGEMENT</div>
            <button className={`nav-item ${activeMenu === "viewreports" ? "active" : ""}`} onClick={() => handleMenuClick("viewreports")}>
              <img src={viewReportsIcon} alt="view reports" className="nav-icon-img" />
              View Reports
            </button>
            <button className={`nav-item ${activeMenu === "matched" ? "active" : ""}`} onClick={() => handleMenuClick("matched")}>
              <img src={matchedIcon} alt="matched" className="nav-icon-img" />
              Matched Items
            </button>
            <button className={`nav-item ${activeMenu === "claimed" ? "active" : ""}`} onClick={() => handleMenuClick("claimed")}>
              <img src={claimedIcon} alt="claimed" className="nav-icon-img" />
              Claimed Items
            </button>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-title">ACTIONS</div>
            <button className={`nav-item ${activeMenu === "lost" ? "active" : ""}`} onClick={handleReportLost}>
              <img src={adminLostIcon} alt="report lost" className="nav-icon-img" />
              Report Lost Item
            </button>
            <button className={`nav-item ${activeMenu === "found" ? "active" : ""}`} onClick={handleReportFound}>
              <img src={adminFoundIcon} alt="report found" className="nav-icon-img" />
              Report Found Item
            </button>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="footer-text"></div>
        </div>
      </div>

      <div className="main-content">
        <div className="top-bar">
          <div className="top-bar-left">
            <h1>{getPageTitle()}</h1>
          </div>
          <div className="admin-info" ref={dropdownRef}>
            <div className="avatar" onClick={toggleDropdown}>
              <img src={adminUserIcon} alt="user" className="avatar-user-icon" />
              <img src={adminDropdownIcon} alt="dropdown" className="avatar-dropdown-icon" />
            </div>
            {isDropdownOpen && (
              <div className="avatar-dropdown-menu">
                <button className="avatar-dropdown-item" onClick={handleSettings}>
                  Settings
                </button>
                <button className="avatar-dropdown-item logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {!showReportForm && activeMenu === "dashboard" && (
          <div className="stats-container">
            <div className="stat-card">
              <h3>Total Reports</h3>
              <p className="stat-number">{allReports.length}</p>
            </div>
            <div className="stat-card">
              <h3>Pending</h3>
              <p className="stat-number">{pendingCount}</p>
            </div> 
            <div className="stat-card">
              <h3>Verified</h3>
              <p className="stat-number">{verifiedCount}</p>
            </div>
            <div className="stat-card">
              <h3>Rejected</h3>
              <p className="stat-number">{rejectedCount}</p>
            </div>
          </div>
        )}

        <div className="content-area">
          {getPageContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;