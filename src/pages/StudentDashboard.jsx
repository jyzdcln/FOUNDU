import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";
import { getReports } from "../services/reportService";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    const allReports = getReports();
    setReports(allReports);
  };

  const handleLogout = () => {
    alert("Logged out!");
    navigate("/");
  };

  const filteredReports = reports.filter(report => {
    if (filter === "all") return true;
    return report.type === filter;
  });

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case "pending": return "status-pending";
      case "verified": return "status-verified";
      case "matched": return "status-matched";
      case "claimed": return "status-claimed";
      case "returned": return "status-returned";
      default: return "status-pending";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  return (
    <div className="student-dashboard-container">
      <header className="student-full-header">
        <div className="student-header-content">
          <div className="student-logo">FoundU</div>
          <div className="student-header-actions">
            <span className="student-lang" onClick={() => setFilter("all")}>Dashboard</span>
            <button className="student-logout-top-btn" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="student-main-content">
        <div className="student-stats-cards">
          <div className="student-stat-card">
            <div className="student-stat-value">{reports.length}</div>
            <div className="student-stat-label">TOTAL REPORTS</div>
          </div>
          <div className="student-stat-card">
            <div className="student-stat-value">{reports.filter(r => r.type === "lost").length}</div>
            <div className="student-stat-label">LOST ITEMS</div>
          </div>
          <div className="student-stat-card">
            <div className="student-stat-value">{reports.filter(r => r.type === "found").length}</div>
            <div className="student-stat-label">FOUND ITEMS</div>
          </div>
        </div>

        <div className="reports-timeline">
          {filteredReports.length === 0 ? (
            <div className="empty-state">
              <p>No reports found</p>
            </div>
          ) : (
            filteredReports.map((report) => (
              <div key={report.id} className={`report-card ${report.type}`}>
                <div className="report-type-badge">
                  {report.type === "lost" ? "LOST" : "FOUND"}
                </div>
                <div className="report-content">
                  {report.photo && (
                    <div className="report-photo">
                      <img src={report.photo} alt={report.itemTitle} />
                    </div>
                  )}
                  <div className="report-info">
                    <h3 className="report-title">{report.itemTitle}</h3>
                    <p className="report-category">Category: {report.category}</p>
                    <p className="report-location">{report.location}</p>
                    <p className="report-date">Reported: {formatDate(report.createdAt)}</p>
                    <p className="report-date">Date {report.type === "lost" ? "Lost" : "Found"}: {formatDate(report.date)}</p>
                    <p className="report-description">{report.description}</p>
                    <div className="report-status">
                      <span className={getStatusBadgeClass(report.status)}>
                        {report.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;