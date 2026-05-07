import React, { useState, useEffect } from "react";
import "./ClaimedItems.css";
import { getReports, updateReportStatus } from "../services/reportService";

const ClaimedItems = () => {
  const [claimedReports, setClaimedReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClaimedReports();
  }, []);

  const loadClaimedReports = async () => {
    setLoading(true);
    const reports = await getReports();
    const claimed = reports.filter(r => r.status === "claimed");
    setClaimedReports(claimed);
    setLoading(false);
  };

  const handleReturn = async (id) => {
    if (window.confirm("Mark this item as returned?")) {
      await updateReportStatus(id, "returned");
      loadClaimedReports();
      alert("Item marked as returned");
    }
  };

  const filteredReports = claimedReports.filter(report => 
    report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  return (
    <div className="claimed-container">
      <div className="claimed-header">
        <h2>Claimed Items</h2>
        <p>Items waiting to be returned to their owners</p>
      </div>

      <div className="claimed-search">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="claimed-search-input"
        />
      </div>

      {loading ? (
        <div className="claimed-loading">Loading...</div>
      ) : filteredReports.length === 0 ? (
        <div className="claimed-empty">
          <p>No claimed items found</p>
        </div>
      ) : (
        <div className="claimed-grid">
          {filteredReports.map((report) => (
            <div key={report.id} className="claimed-card">
              <div className="claimed-card-header">
                <span className="claimed-type">{report.type === "lost" ? "Lost" : "Found"}</span>
                <span className="claimed-badge">Claimed</span>
              </div>
              <div className="claimed-card-body">
                <h3 className="claimed-title">{report.title}</h3>
                <div className="claimed-details">
                  <div className="claimed-detail-item">
                    <span className="claimed-detail-label">Category</span>
                    <span className="claimed-detail-value">{report.category}</span>
                  </div>
                  <div className="claimed-detail-item">
                    <span className="claimed-detail-label">Location</span>
                    <span className="claimed-detail-value">{report.location}</span>
                  </div>
                  <div className="claimed-detail-item">
                    <span className="claimed-detail-label">Date</span>
                    <span className="claimed-detail-value">{formatDate(report.date)}</span>
                  </div>
                  <div className="claimed-detail-item">
                    <span className="claimed-detail-label">Reported by</span>
                    <span className="claimed-detail-value">{report.users?.name || "Student"}</span>
                  </div>
                  <div className="claimed-detail-item claimed-description">
                    <span className="claimed-detail-label">Description</span>
                    <span className="claimed-detail-value">{report.description}</span>
                  </div>
                </div>
              </div>
              <div className="claimed-card-footer">
                <button 
                  className="claimed-return-btn"
                  onClick={() => handleReturn(report.id)}
                >
                  Mark as Returned
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClaimedItems;