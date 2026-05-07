import React, { useState, useEffect } from "react";
import { getReports, updateReportStatus } from "../services/reportService";

const UnclaimedItems = () => {
  const [unclaimedReports, setUnclaimedReports] = useState([]);
  const [daysThreshold, setDaysThreshold] = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUnclaimedItems();
  }, [daysThreshold]);

  const loadUnclaimedItems = async () => {
    setLoading(true);
    const allReports = await getReports();
    
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);
    
    const unclaimed = allReports.filter(report => {
      if (report.status !== "verified") return false;
      const reportDate = new Date(report.created_at);
      return reportDate <= thresholdDate;
    });
    
    const sortedUnclaimed = unclaimed.sort((a, b) => 
      new Date(a.created_at) - new Date(b.created_at)
    );
    
    setUnclaimedReports(sortedUnclaimed);
    setLoading(false);
  };

  const handleDaysChange = (e) => {
    setDaysThreshold(Number(e.target.value));
  };

  const handleDeleteReport = async (reportId) => {
    if (window.confirm("Are you sure you want to delete this report? This action cannot be undone.")) {
      const success = await updateReportStatus(reportId, "deleted");
      if (success) {
        loadUnclaimedItems();
        alert("Report deleted successfully");
      } else {
        alert("Failed to delete report");
      }
    }
  };

  const handleMarkAsClaimed = async (reportId) => {
    if (window.confirm("Mark this item as claimed?")) {
      const success = await updateReportStatus(reportId, "claimed");
      if (success) {
        loadUnclaimedItems();
        alert("Item marked as claimed");
      } else {
        alert("Failed to mark item as claimed");
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${date.toLocaleDateString()} (${diffDays} days ago)`;
  };

  return (
    <div className="unclaimed-items">
      <div className="unclaimed-header">
        <h2>Unclaimed Items Report</h2>
        <div className="days-filter">
          <label>Show items verified for more than:</label>
          <select value={daysThreshold} onChange={handleDaysChange}>
            <option value={3}>3 days</option>
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={30}>30 days</option>
            <option value={60}>60 days</option>
            <option value={90}>90 days</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading...</div>
      ) : unclaimedReports.length === 0 ? (
        <div className="empty-state">
          <p>No unclaimed items for {daysThreshold}+ days</p>
          <p className="empty-subtext">All verified items have been claimed within {daysThreshold} days</p>
        </div>
      ) : (
        <>
          <div className="summary-stats">
            <div className="summary-card">
              <h4>Total Unclaimed</h4>
              <p className="summary-number">{unclaimedReports.length}</p>
            </div>
            <div className="summary-card warning">
              <h4>Over {daysThreshold} days</h4>
              <p className="summary-number">{unclaimedReports.length}</p>
            </div>
          </div>

          <div className="unclaimed-list">
            {unclaimedReports.map((report) => (
              <div key={report.id} className="unclaimed-card">
                <div className="unclaimed-card-header">
                  <div className={`type-badge ${report.type}`}>
                    {report.type === "lost" ? "LOST" : "FOUND"}
                  </div>
                  <div className="days-old">
                    {Math.ceil((new Date() - new Date(report.created_at)) / (1000 * 60 * 60 * 24))} days unclaimed
                  </div>
                </div>
                
                <div className="unclaimed-card-content">
                  {report.photo_url && (
                    <div className="unclaimed-photo">
                      <img src={report.photo_url} alt={report.title} />
                    </div>
                  )}
                  <div className="unclaimed-info">
                    <h3 className="unclaimed-title">{report.title}</h3>
                    <p className="unclaimed-category">Category: {report.category}</p>
                    <p className="unclaimed-location">Location: {report.location}</p>
                    <p className="unclaimed-date">Verified on: {formatDate(report.created_at)}</p>
                    {report.description && (
                      <p className="unclaimed-description">Description: {report.description.substring(0, 100)}...</p>
                    )}
                  </div>
                </div>
                
                <div className="unclaimed-card-actions">
                  <button 
                    className="claim-btn"
                    onClick={() => handleMarkAsClaimed(report.id)}
                  >
                    Mark as Claimed
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteReport(report.id)}
                  >
                    Delete Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UnclaimedItems;