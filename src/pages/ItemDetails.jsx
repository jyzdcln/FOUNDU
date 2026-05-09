import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import "./ItemDetails.css";
import founduLogo from "../assets/icons/foundulogo-icon.png";
import studentUserIcon from "../assets/icons/admin-user-icon.png";
import studentDropdownIcon from "../assets/icons/admin-dropdown-icon.png";
import studentLogoutIcon from "../assets/icons/Studentlogout-icon.png";

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  useEffect(() => {
    loadItemDetails();
  }, [id]);

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

  const loadItemDetails = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        users(name, email)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error loading item:", error);
    } else {
      setItem(data);
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + 
           " at " + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleLogout = () => {
    alert("Logged out!");
    navigate("/");
  };

  const handleClaimClick = () => {
    setShowClaimForm(true);
  };

  if (loading) {
    return <div className="item-details-container">Loading...</div>;
  }

  if (!item) {
    return <div className="item-details-container">Item not found</div>;
  }

  return (
    <div className="item-details-container">
      <header className="student-full-header">
        <div className="student-header-content">
          <div className="student-logo">
            <img src={founduLogo} alt="FoundU" className="student-logo-img" />
          </div>
          <div className="student-header-actions">
            <span className="student-lang" onClick={() => navigate('/student-dashboard')}>Browse</span>
            <span className="student-lang" onClick={() => navigate('/student-dashboard')}>Dashboard</span>
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

      <div className="item-details-main">
        <div className="breadcrumb">
          <span onClick={() => navigate('/student-dashboard')}>Home</span> / 
          <span> Browse Items</span> / 
          <span> Item Details</span>
        </div>

        <div className="item-details-card">
          <div className="item-details-header">
            <h1>{item.title}</h1>
            <span className="item-id">ID: #{item.id.slice(0, 8)}</span>
          </div>

          <div className="item-details-content">
            {item.photo_url && (
              <div className="item-image">
                <img src={item.photo_url} alt={item.title} />
              </div>
            )}

            <div className="item-info">
              <div className="info-row">
                <div className="info-box">
                  <label>CATEGORY</label>
                  <p>{item.category || "Uncategorized"}</p>
                </div>
                <div className="info-box">
                  <label>DATE REPORTED</label>
                  <p>{formatDate(item.created_at)}</p>
                </div>
              </div>
              <div className="info-row">
                <div className="info-box">
                  <label>LOCATION</label>
                  <p>{item.location}</p>
                </div>
              </div>
              <div className="info-box full-width">
                <label>DESCRIPTION</label>
                <p>{item.description || "No description provided"}</p>
              </div>
            </div>
          </div>

          {item.type === "found" && (
            <div className="claim-section">
              <div className="reported-by">
                <span className="reported-by-label">REPORTED BY</span>
                <p className="reported-by-name">TEACHER</p>
                <p className="reported-by-email">{item.users?.name || item.users?.email || "Anonymous"}</p>
              </div>
              <p className="claim-message">
                Are you the owner of this item? Submit your proof to claim it back.
              </p>
              <button className="claim-item-btn" onClick={handleClaimClick}>
                Claim This Item
              </button>
              <p className="posted-date">
                Posted on {formatDateTime(item.created_at)}
              </p>
              <p className="security-notice">
                Security Notice: All items are securely stored and inventoried. 
                They are kept for strictly 30 days before being donated to local 
                charities or disposed of according to SIIT policy.
              </p>
            </div>
          )}
        </div>
      </div>

      {showClaimForm && (
        <ClaimFormModal item={item} onClose={() => setShowClaimForm(false)} />
      )}
    </div>
  );
};

const ClaimFormModal = ({ item, onClose }) => {
  const [formData, setFormData] = useState({
    description: "",
    colorBrand: "",
    uniqueMarks: "",
    proofFile: null
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, proofFile: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const { error } = await supabase
      .from('claims')
      .insert([{
        report_id: item.id,
        student_id: user.id,
        proof_of_ownership: formData.description + " | Brand: " + formData.colorBrand + " | Marks: " + formData.uniqueMarks,
        claim_date: new Date(),
        status: 'pending'
      }]);
    
    if (error) {
      alert("Error submitting claim: " + error.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <h2>Claim Submitted!</h2>
          <p>Your claim has been submitted. Admin will review it shortly.</p>
          <button onClick={onClose} className="close-modal-btn">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Submit Claim Request</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <p className="modal-subtitle">
          To prevent fake claims, please provide accurate details that only the owner would know.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>DETAILED DESCRIPTION</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe specific details of the item..."
              required
            />
          </div>
          
          <div className="form-group">
            <label>COLOR / BRAND</label>
            <input
              type="text"
              name="colorBrand"
              value={formData.colorBrand}
              onChange={handleChange}
              placeholder="e.g. Silver / Apple"
              required
            />
          </div>
          
          <div className="form-group">
            <label>UNIQUE MARKS / FEATURES</label>
            <input
              type="text"
              name="uniqueMarks"
              value={formData.uniqueMarks}
              onChange={handleChange}
              placeholder="Scratches, specific stickers, contents inside, etc."
              required
            />
          </div>
          
          <div className="form-group">
            <label>UPLOAD ID OR PROOF (OPTIONAL)</label>
            <div className="file-input-wrapper">
              <input type="file" onChange={handleFileChange} accept="image/*" id="proof-file" />
              <label htmlFor="proof-file" className="file-label">Choose File</label>
              <span className="file-name">{formData.proofFile ? formData.proofFile.name : "No file chosen"}</span>
            </div>
            <small>Receipt, photo of you with the item, or Student ID.</small>
          </div>
          
          <button type="submit" disabled={submitting} className="submit-claim-btn">
            {submitting ? "Submitting..." : "SUBMIT PROOF & CLAIM"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ItemDetails;