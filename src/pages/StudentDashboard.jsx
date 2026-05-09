import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";
import { getReports } from "../services/reportService";
import founduLogo from "../assets/icons/foundulogo-icon.png";
import studentUserIcon from "../assets/icons/admin-user-icon.png";
import studentDropdownIcon from "../assets/icons/admin-dropdown-icon.png";
import studentLogoutIcon from "../assets/icons/Studentlogout-icon.png";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [showBrowse, setShowBrowse] = useState(false);
  const [expandedReportId, setExpandedReportId] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const [filters, setFilters] = useState({
    keyword: "",
    category: "All Categories",
    type: "All"
  });

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, reports]);

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

  const loadReports = async () => {
    const allReports = await getReports();
    setReports(allReports);
  };

  const applyFilters = () => {
    let filtered = [...reports];
    
    if (filters.keyword) {
      filtered = filtered.filter(report => 
        report.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        report.description.toLowerCase().includes(filters.keyword.toLowerCase())
      );
    }
    
    if (filters.category !== "All Categories") {
      filtered = filtered.filter(report => report.category === filters.category);
    }
    
    if (filters.type !== "All") {
      filtered = filtered.filter(report => report.type === filters.type);
    }
    
    setFilteredReports(filtered);
  };

  const handleLogout = () => {
    alert("Logged out!");
    navigate("/");
  };

  const handleBrowse = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowBrowse(true);
      setExpandedReportId(null);
      setIsAnimating(false);
    }, 300);
  };

  const handleDashboard = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowBrowse(false);
      setExpandedReportId(null);
      setIsAnimating(false);
    }, 300);
  };

  const toggleViewDetails = (reportId) => {
    setExpandedReportId(expandedReportId === reportId ? null : reportId);
  };

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
    if (!dateString) return "Invalid Date";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      keyword: "",
      category: "All Categories",
      type: "All"
    });
  };

  const uniqueCategories = ["All Categories", ...new Set(reports.map(r => r.category).filter(Boolean))];

  return (
    <div className="student-dashboard-container">
      <header className="student-full-header">
        <div className="student-header-content">
          <div className="student-logo">
            <img src={founduLogo} alt="FoundU" className="student-logo-img" />
          </div>
          <div className="student-header-actions">
            <span className="student-lang" onClick={handleBrowse}>Browse</span>
            <span className="student-lang" onClick={handleDashboard}>Dashboard</span>
            <div className="user-dropdown" ref={dropdownRef}>
              <div 
                className="user-dropdown-trigger" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="user-icon">
                  <img src={studentUserIcon} alt="user" className="user-icon-img" />
                </div>
                <div className="dropdown-icon">
                  <img src={studentDropdownIcon} alt="dropdown" className="dropdown-icon-img" />
                </div>
              </div>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={handleLogout}>
                    <img src={studentLogoutIcon} alt="logout" className="dropdown-icon-img" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className={`student-main-content ${isAnimating ? 'fade-out' : 'fade-in'}`}>
        {!showBrowse ? (
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
        ) : (
          <div className="browse-layout">
            <div className="browse-sidebar">
              <div className="browse-sidebar-section">
                <h3>Search Item</h3>
              </div>
              
              <div className="browse-sidebar-section">
                <h3>KEYWORDS</h3>
                <input 
                  type="text" 
                  className="browse-keyword-input"
                  placeholder="Search..."
                  value={filters.keyword}
                  onChange={(e) => handleFilterChange("keyword", e.target.value)}
                />
              </div>
              
              <div className="browse-sidebar-section">
                <h3>CATEGORY</h3>
                <select 
                  className="browse-category-select"
                  value={filters.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                >
                  {uniqueCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="browse-sidebar-section">
                <h3>TYPE</h3>
                <div className="browse-type-options">
                  <label className="browse-type-option">
                    <input 
                      type="radio" 
                      name="type" 
                      value="All" 
                      checked={filters.type === "All"}
                      onChange={(e) => handleFilterChange("type", e.target.value)}
                    />
                    All
                  </label>
                  <label className="browse-type-option">
                    <input 
                      type="radio" 
                      name="type" 
                      value="lost" 
                      checked={filters.type === "lost"}
                      onChange={(e) => handleFilterChange("type", e.target.value)}
                    />
                    Lost
                  </label>
                  <label className="browse-type-option">
                    <input 
                      type="radio" 
                      name="type" 
                      value="found" 
                      checked={filters.type === "found"}
                      onChange={(e) => handleFilterChange("type", e.target.value)}
                    />
                    Found
                  </label>
                </div>
              </div>
              
              <div className="browse-sidebar-section">
                <button className="browse-apply-filters-btn" onClick={applyFilters}>
                  APPLY FILTERS
                </button>
                <button className="browse-reset-btn" onClick={resetFilters}>
                  Reset
                </button>
              </div>
            </div>
            
            <div className="browse-content-area">
              <div className="browse-results-header">
                <div className="browse-breadcrumb">
                  <span className="browse-home-link" onClick={handleDashboard}>Home</span> / Browse Items
                </div>
                <div className="browse-results-count">
                  <strong>{filteredReports.length}</strong> items found
                </div>
              </div>
              
              <div className="browse-items-grid">
                {filteredReports.length === 0 ? (
                  <div className="empty-state">
                    <p>No reports found</p>
                  </div>
                ) : (
                  filteredReports.map((report) => {
                    const isExpanded = expandedReportId === report.id;
                    return (
                      <div key={report.id} className="browse-item-card">
                        <div className="browse-item-card-image">
                          {report.photo_url ? (
                            <img src={report.photo_url} alt={report.title} />
                          ) : (
                            <span>No image</span>
                          )}
                        </div>
                        <div className="browse-item-card-content">
                          <div className="browse-item-card-header">
                            <div className={`browse-item-type-badge ${report.type}`}>
                              {report.type === "lost" ? "LOST" : "FOUND"}
                            </div>
                            <div className="browse-item-date">
                              {formatDate(report.created_at)}
                            </div>
                          </div>
                          <div className="browse-item-category">{report.category || "Item"}</div>
                          <div className="browse-item-title">{report.title}</div>
                          <div className="browse-item-location">{report.location}</div>
                        </div>
                        <button 
                               className="browse-view-details-btn"
                               onClick={() => navigate(`/item-details/${report.id}`)}
                               >
                                VIEW DETAILS
                                </button>
                        {isExpanded && (
                          <div className="browse-item-details-expanded">
                            <div className="browse-expanded-description">
                              <strong>Description:</strong><br />
                              {report.description}
                            </div>
                            <div className="browse-expanded-description">
                              <strong>Date {report.type === "lost" ? "Lost" : "Found"}:</strong><br />
                              {formatDate(report.date)}
                            </div>
                            <div className="browse-expanded-status">
                              <span className={`status-badge ${getStatusBadgeClass(report.status)}`}>
                                {report.status.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;