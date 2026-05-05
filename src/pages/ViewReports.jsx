import React, { useState, useEffect } from "react";
import { getReports, updateReportStatus, deleteReport } from "../services/reportService";

const ViewReports = () => {
  const [allReports, setAllReports] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadAllReports();
  }, []);

  const loadAllReports = async () => {
    const reports = await getReports();
    setAllReports(reports);
  };

  const handleVerify = async (id) => {
    await updateReportStatus(id, "verified");
    loadAllReports();
    alert("Report verified!");
  };

  const handleReject = async (id) => {
    await updateReportStatus(id, "rejected");
    loadAllReports();
    alert("Report rejected");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      await deleteReport(id);
      loadAllReports();
      alert("Report deleted successfully");
    }
  };

  const getFilteredReports = () => {
    if (filter === "all") return allReports;
    return allReports.filter(r => r.status === filter);
  };

  const filteredReports = getFilteredReports();
  const pendingCount = allReports.filter(r => r.status === "pending").length;
  const verifiedCount = allReports.filter(r => r.status === "verified").length;
  const rejectedCount = allReports.filter(r => r.status === "rejected").length;

  return (
    <div className="content-box">
      <h3>All Reports</h3>
      <p className="info-text">Reports submitted by students</p>
      
      <div className="filter-buttons">
        <button 
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All ({allReports.length})
        </button>
        <button 
          className={`filter-btn ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          Pending ({pendingCount})
        </button>
        <button 
          className={`filter-btn ${filter === "verified" ? "active" : ""}`}
          onClick={() => setFilter("verified")}
        >
          Verified ({verifiedCount})
        </button>
        <button 
          className={`filter-btn ${filter === "rejected" ? "active" : ""}`}
          onClick={() => setFilter("rejected")}
        >
          Rejected ({rejectedCount})
        </button>
      </div>

      {filteredReports.length === 0 ? (
        <p>No {filter !== "all" ? filter : ""} reports found</p>
      ) : (
        <div className="report-list">
          {filteredReports.map((report) => (
            <div key={report.id} className="report-item">
              <div className="report-details">
                <div className="report-header">
                  <strong className="report-title">{report.title}</strong>
                  <span className={`status-badge status-${report.status}`}>
                    {report.status?.toUpperCase()}
                  </span>
                </div>
                <p><strong>Type:</strong> {report.type?.toUpperCase()}</p>
                <p><strong>Category:</strong> {report.category}</p>
                <p><strong>Location:</strong> {report.location}</p>
                <p><strong>Date:</strong> {report.date}</p>
                <p><strong>Description:</strong> {report.description}</p>
                <p><strong>Reported by:</strong> {report.users?.name || "Student"}</p>
              </div>
              <div className="report-actions">
                {report.status === "pending" && (
                  <>
                    <button 
                      className="verify-btn"
                      onClick={() => handleVerify(report.id)}
                    >
                      Verify
                    </button>
                    <button 
                      className="reject-btn"
                      onClick={() => handleReject(report.id)}
                    >
                      Reject
                    </button>
                  </>
                )}
                <button 
                  className="edit-btn"
                  onClick={() => alert("Edit function coming soon!")}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(report.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewReports;