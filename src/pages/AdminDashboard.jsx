import React, { useState } from "react";
import "./AdminDashboard.css";
import ReportLostItem from "../components/student/ReportLostItem";

import dashboardIcon from "../assets/icons/dashboard-icon.png";
import pendingIcon from "../assets/icons/pending-icon.png";
import verifiedIcon from "../assets/icons/verified-icon.png";
import matchedIcon from "../assets/icons/matched-icon.png";
import claimedIcon from "../assets/icons/claimed-icon.png";
import returnedIcon from "../assets/icons/returned-icon.png";
import logoutIcon from "../assets/icons/logout-icon.png";
import adminLostIcon from "../assets/icons/admin-lost-icon.png";
import adminFoundIcon from "../assets/icons/admin-found-icon.png";

const AdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [pendingCount, setPendingCount] = useState(0);
  const [pendingReports, setPendingReports] = useState([]);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportType, setReportType] = useState("");

  const handleLogout = () => {
    alert("Logout");
  };

  const handleCloseForm = () => {
    setShowReportForm(false);
    setReportType("");
  };

  const handleMenuClick = (menu) => {
    setShowReportForm(false);
    setActiveMenu(menu);
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

  const getPageTitle = () => {
    if (showReportForm) {
      return reportType === "lost" ? "Report Lost Item" : "Report Found Item";
    }
    switch(activeMenu) {
      case "dashboard": return "Dashboard";
      case "pending": return "Pending Reports";
      case "verified": return "Verified Items";
      case "matched": return "Matched Items";
      case "claimed": return "Claimed Items";
      case "returned": return "Returned Items";
      default: return "Dashboard";
    }
  };

  const getPageContent = () => {
    if (showReportForm) {
      if (reportType === "lost") {
        return <ReportLostItem onClose={handleCloseForm} />;
      } else {
        return (
          <div className="content-box">
            <p>Coming soon... Report Found Item</p>
          </div>
        );
      }
    }
    
    switch(activeMenu) {
      case "dashboard":
        return (
          <div className="content-box">
           </div>
        );
      case "pending":
        return (
          <div className="content-box">
            {pendingReports.length === 0 ? (
              <p>No pending reports</p>
            ) : (
              <div className="report-list">
                {pendingReports.map((report) => (
                  <div key={report.id} className="report-item">
                    <div>
                      <strong>{report.name}</strong>
                      <p>Found at: {report.location}</p>
                      <p>Date: {report.date}</p>
                    </div>
                    <button className="verify-btn">Verify</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "verified":
        return (
          <div className="content-box">
            <p>Coming soon... (Function 2)</p>
          </div>
        );
      case "matched":
        return (
          <div className="content-box">
            <p>Coming soon... (Function 3)</p>
          </div>
        );
      case "claimed":
        return (
          <div className="content-box">
            <p>Coming soon... (Function 4)</p>
          </div>
        );
      case "returned":
        return (
          <div className="content-box">
            <p>Coming soon... (Function 5)</p>
          </div>
        );
      default:
        return <p>Welcome to Dashboard</p>;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <p>Welcome, Jayz Daclan</p>
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-item ${activeMenu === "dashboard" ? "active" : ""}`} onClick={() => handleMenuClick("dashboard")}>
            <img src={dashboardIcon} alt="dashboard" className="nav-icon-img" />
            Dashboard
          </button>
          <button className={`nav-item ${activeMenu === "pending" ? "active" : ""}`} onClick={() => handleMenuClick("pending")}>
            <img src={pendingIcon} alt="pending" className="nav-icon-img" />
            Pending Reports
          </button>
          <button className={`nav-item ${activeMenu === "verified" ? "active" : ""}`} onClick={() => handleMenuClick("verified")}>
            <img src={verifiedIcon} alt="verified" className="nav-icon-img" />
            Verified Items
          </button>
          <button className={`nav-item ${activeMenu === "matched" ? "active" : ""}`} onClick={() => handleMenuClick("matched")}>
            <img src={matchedIcon} alt="matched" className="nav-icon-img" />
            Matched Items
          </button>
          <button className={`nav-item ${activeMenu === "claimed" ? "active" : ""}`} onClick={() => handleMenuClick("claimed")}>
            <img src={claimedIcon} alt="claimed" className="nav-icon-img" />
            Claimed Items
          </button>
          <button className={`nav-item ${activeMenu === "returned" ? "active" : ""}`} onClick={() => handleMenuClick("returned")}>
            <img src={returnedIcon} alt="returned" className="nav-icon-img" />
            Returned Items
          </button>
          
          <button className={`nav-item ${activeMenu === "lost" ? "active" : ""}`} onClick={handleReportLost}>
            <img src={adminLostIcon} alt="report lost" className="nav-icon-img" />
            Report Lost Item
          </button>
          <button className={`nav-item ${activeMenu === "found" ? "active" : ""}`} onClick={handleReportFound}>
            <img src={adminFoundIcon} alt="report found" className="nav-icon-img" />
            Report Found Item
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <img src={logoutIcon} alt="logout" className="admin-logout-icon-img" />
            Logout
          </button>
          <div className="footer-text"></div>
        </div>
      </div>

      <div className="main-content">
        <div className="top-bar">
          <div className="top-bar-left">
            <h1>{getPageTitle()}</h1>
          </div>
          <div className="admin-info">
            <div className="avatar">JD</div>
          </div>
        </div>

        {!showReportForm && activeMenu === "dashboard" && (
          <div className="stats-container">
            <div className="stat-card">
              <h3>Pending Reports</h3>
              <p className="stat-number">{pendingCount}</p>
            </div>
            <div className="stat-card">
              <h3>Verified Items</h3>
              <p className="stat-number">0</p>
            </div>
            <div className="stat-card">
              <h3>Matched Items</h3>
              <p className="stat-number">0</p>
            </div>
            <div className="stat-card">
              <h3>Claimed Items</h3>
              <p className="stat-number">1</p>
            </div>
            <div className="stat-card">
              <h3>Returned Items</h3>
              <p className="stat-number">1</p>
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