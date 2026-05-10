import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./StudentDashboard.css";
import { getReports } from "../services/reportService";
import founduLogo from "../assets/icons/foundulogo-icon.png";
import studentUserIcon from "../assets/icons/admin-user-icon.png";
import studentDropdownIcon from "../assets/icons/admin-dropdown-icon.png";
import ReportLostItemModal from "../components/student/ReportLostItemModal";
import ReportFoundItemModal from "../components/student/ReportFoundItemModal";
import locationIcon from "../assets/icons/location-icons.png";
import tagIcon from "../assets/icons/tag-icons.png";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [showBrowse, setShowBrowse] = useState(true);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isReportDropdownOpen, setIsReportDropdownOpen] = useState(false);
  const [showReportLostModal, setShowReportLostModal] = useState(false);
  const [showReportFoundModal, setShowReportFoundModal] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const userDropdownRef = useRef(null);
  const reportDropdownRef = useRef(null);
  
  const [filters, setFilters] = useState({
    keyword: "",
    category: "All Categories",
    type: "All"
  });

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    if (location.state?.showBrowse !== undefined) {
      setShowBrowse(location.state.showBrowse);
    }
  }, [location]);

  useEffect(() => {
    if (reports.length > 0) {
      applyFilters();
    }
  }, [filters, reports]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
      if (reportDropdownRef.current && !reportDropdownRef.current.contains(event.target)) {
        setIsReportDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const loadReports = async () => {
    setInitialLoading(true);
    const allReports = await getReports();
    setReports(allReports);
    
    setTimeout(() => {
      setInitialLoading(false);
    }, 500);
  };

  const applyFilters = () => {
    let filtered = reports.filter(report => report.status === "verified");
    
    if (filters.keyword) {
      filtered = filtered.filter(report => 
        report.title?.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        report.description?.toLowerCase().includes(filters.keyword.toLowerCase())
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
    setShowBrowse(true);
  };

  const handleDashboard = () => {
    setShowBrowse(false);
  };

  const handleViewDetails = (reportId) => {
    navigate(`/item-details/${reportId}`);
  };

  const handleReportLost = () => {
    setShowReportLostModal(true);
    setIsReportDropdownOpen(false);
  };

  const handleReportFound = () => {
    setShowReportFoundModal(true);
    setIsReportDropdownOpen(false);
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

  if (initialLoading && reports.length === 0) {
    return (
      <div className="student-dashboard-container">
        <header className="student-full-header">
          <div className="student-header-content">
            <div className="student-logo">
              <img src={founduLogo} alt="FoundU" className="student-logo-img" />
            </div>
            <div className="student-header-actions">
              <span className="student-lang">Browse</span>
              <span className="student-lang">Dashboard</span>
              <div className="user-dropdown">
                <div className="user-dropdown-trigger">
                  <div className="user-icon">
                    <img src={studentUserIcon} alt="user" className="user-icon-img" />
                  </div>
                  <div className="dropdown-icon">
                    <img src={studentDropdownIcon} alt="dropdown" className="dropdown-icon-img" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

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
            <div className="user-dropdown" ref={userDropdownRef}>
              <div 
                className="user-dropdown-trigger" 
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              >
                <div className="user-icon">
                  <img src={studentUserIcon} alt="user" className="user-icon-img" />
                </div>
                <div className="dropdown-icon">
                  <img src={studentDropdownIcon} alt="dropdown" className="dropdown-icon-img" />
                </div>
              </div>
              {isUserDropdownOpen && (
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="student-main-content">
        {!showBrowse ? (
          <>
            <div className="report-new-item-section">
              <div className="report-dropdown" ref={reportDropdownRef}>
                <button 
                  className="report-dropdown-btn"
                  onClick={() => setIsReportDropdownOpen(!isReportDropdownOpen)}
                >
                  Report New Item
                  <img src={studentDropdownIcon} alt="dropdown" className="report-dropdown-arrow" />
                </button>
                {isReportDropdownOpen && (
                  <div className="report-dropdown-menu">
                    <button className="report-dropdown-item" onClick={handleReportLost}>
                      I Lost Something
                    </button>
                    <button className="report-dropdown-item" onClick={handleReportFound}>
                      I Found Something
                    </button>
                  </div>
                )}
              </div>
            </div>

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
          </>
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
                  filteredReports.map((report) => (
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
                          <div className="browse-item-type-wrapper">
                            <div className={`browse-item-type-badge ${report.type}`}>
                              {report.type === "lost" ? "LOST" : "FOUND"}
                            </div>
                            <div className={`status-badge ${report.status}`}>
                              {report.status === "verified" ? "VERIFIED" : "PENDING"}
                            </div>
                          </div>
                          <div className="browse-item-date">
                            {formatDate(report.created_at)}
                          </div>
                        </div>
                        <div className="browse-item-category">
                          <img src={tagIcon} alt="category" className="browse-category-icon-img" />
                          {report.category || "Item"}
                        </div>
                        <div className="browse-item-title">{report.title}</div>
                        <div className="browse-item-location">
                          <img src={locationIcon} alt="location" className="browse-location-icon-img" />
                          {report.location}
                        </div>
                      </div>
                      <button 
                        className="browse-view-details-btn"
                        onClick={() => handleViewDetails(report.id)}
                      >
                        VIEW DETAILS
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {showReportLostModal && (
        <ReportLostItemModal onClose={() => setShowReportLostModal(false)} onSuccess={loadReports} />
      )}
      {showReportFoundModal && (
        <ReportFoundItemModal onClose={() => setShowReportFoundModal(false)} onSuccess={loadReports} />
      )}
    </div>
  );
};

export default StudentDashboard;