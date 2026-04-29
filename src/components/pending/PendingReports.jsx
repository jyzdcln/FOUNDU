import React, { useState } from "react";

const PendingReports = () => {
  const [pendingReports, setPendingReports] = useState([
    { id: 1, name: "iPhone 13 Pro", location: "Central Library", date: "2024-01-15" },
    { id: 2, name: "Blue Backpack", location: "Student Center", date: "2024-01-14" },
  ]);

  const handleVerifyReport = (id) => {
    setPendingReports(pendingReports.filter(report => report.id !== id));
    alert(`Report verified! Moving to verified items...`);
  };

  return (
    <div className="content-box">
      <h3>Pending Reports List</h3>
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
              <button className="verify-btn" onClick={() => handleVerifyReport(report.id)}>
                Verify
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingReports;