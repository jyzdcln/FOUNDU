import React, { useState, useRef } from "react";
import "./ReportLostItem.css";
import reportLostIcon from "../../assets/icons/report-lost-icon.png";
import { saveReport } from "../../services/reportService";

const ReportLostItem = () => {
  const [formData, setFormData] = useState({
    itemTitle: "",
    category: "",
    dateLost: "",
    location: "",
    description: "",
    photo: null
  });
  const formTopRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert("File size must be less than 5MB");
    }
  };

  const resetForm = () => {
    setFormData({
      itemTitle: "",
      category: "",
      dateLost: "",
      location: "",
      description: "",
      photo: null
    });
  };

  const scrollToTop = () => {
    if (formTopRef.current) {
      formTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCancel = () => {
    resetForm();
    scrollToTop();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const reportData = {
      type: "lost",
      itemTitle: formData.itemTitle,
      category: formData.category,
      date: formData.dateLost,
      location: formData.location,
      description: formData.description,
      photo: formData.photo
    };
    
    const result = await saveReport(reportData);
    
    if (result) {
      alert(`Report Lost Item submitted!\n\nItem: ${formData.itemTitle}\nCategory: ${formData.category}\nLocation: ${formData.location}`);
      resetForm();
      scrollToTop();
    } else {
      alert("Error saving report. Please try again.");
    }
  };

  return (
    <div className="reportlost-page" ref={formTopRef}>
      <div className="reportlost-form-container">
        <div className="reportlost-form-header">
          <img src={reportLostIcon} alt="report icon" className="reportlost-header-icon" />
          <div className="reportlost-header-content">
            <h1 className="reportlost-title">Report Lost Item</h1>
            <div className="reportlost-subtitle-row">
              <span className="reportlost-subtitle-label">REPORTING AS ADMIN</span>
              <p className="reportlost-subtitle-text">Helping the community reconnect.</p>
            </div>
          </div>
        </div>

        <div className="reportlost-form-body">
          <form onSubmit={handleSubmit}>
            <div className="reportlost-form-grid">
              <div className="reportlost-form-group reportlost-full-width">
                <label>ITEM TITLE</label>
                <input
                  type="text"
                  name="itemTitle"
                  placeholder="e.g. Silver Dell Laptop, Red Umbrella"
                  value={formData.itemTitle}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="reportlost-form-group">
                <label>CATEGORY</label>
                <select name="category" value={formData.category} onChange={handleInputChange} required>
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Documents">Documents</option>
                  <option value="Bags">Bags</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div className="reportlost-form-group">
                <label>DATE LOST</label>
                <input type="date" name="dateLost" value={formData.dateLost} onChange={handleInputChange} required />
              </div>

              <div className="reportlost-form-group reportlost-full-width">
                <label>LOCATION</label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Library Rooftop, STI Building Room 201"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="reportlost-form-group reportlost-full-width">
                <label>DETAILED DESCRIPTION</label>
                <textarea
                  name="description"
                  rows="4"
                  placeholder="Describe the item's unique features, color, brand, condition, etc."
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <div className="reportlost-form-group reportlost-full-width">
                <label>UPLOAD PHOTO (OPTIONAL)</label>
                <div className="reportlost-photo-upload-area" onClick={() => document.getElementById('reportlost-photoInput').click()}>
                  <input
                    type="file"
                    id="reportlost-photoInput"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    style={{ display: 'none' }}
                  />
                  <div className="reportlost-upload-icon"></div>
                  <p>Click or drop image here</p>
                  <span className="reportlost-upload-hint">Max file size: 5 MB</span>
                  {formData.photo && (
                    <div className="reportlost-selected-file">
                      Photo uploaded
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="reportlost-form-buttons">
              <button type="submit" className="reportlost-submit-btn">UPLOAD REPORT</button>
              <button type="button" className="reportlost-cancel-btn" onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportLostItem;