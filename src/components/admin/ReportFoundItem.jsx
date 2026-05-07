import React, { useState, useRef } from "react";
import "./ReportFoundItem.css";
import reportFoundIcon from "../../assets/icons/report-found-icon.png";
import { saveReport } from "../../services/reportService";

const ReportFoundItem = () => {
  const [formData, setFormData] = useState({
    itemTitle: "",
    category: "",
    dateFound: "",
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
      dateFound: "",
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
      type: "found",
      itemTitle: formData.itemTitle,
      category: formData.category,
      date: formData.dateFound,
      location: formData.location,
      description: formData.description,
      photo: formData.photo
    };
    
    const result = await saveReport(reportData, 'admin');
    
    if (result) {
      alert(`Report Found Item submitted and automatically verified!\n\nItem: ${formData.itemTitle}\nCategory: ${formData.category}\nLocation: ${formData.location}`);
      resetForm();
      scrollToTop();
    } else {
      alert("Error saving report. Please try again.");
    }
  };

  return (
    <div className="reportfound-page" ref={formTopRef}>
      <div className="reportfound-form-container">
        <div className="reportfound-form-header">
          <img src={reportFoundIcon} alt="report icon" className="reportfound-header-icon" />
          <div className="reportfound-header-content">
            <h1 className="reportfound-title">Report Found Item</h1>
            <div className="reportfound-subtitle-row">
              <span className="reportfound-subtitle-label">REPORTING AS ADMIN</span>
              <p className="reportfound-subtitle-text">Helping the community reconnect.</p>
            </div>
          </div>
        </div>

        <div className="reportfound-form-body">
          <form onSubmit={handleSubmit}>
            <div className="reportfound-form-grid">
              <div className="reportfound-form-group reportfound-full-width">
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

              <div className="reportfound-form-group">
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

              <div className="reportfound-form-group">
                <label>DATE FOUND</label>
                <input type="date" name="dateFound" value={formData.dateFound} onChange={handleInputChange} required />
              </div>

              <div className="reportfound-form-group reportfound-full-width">
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

              <div className="reportfound-form-group reportfound-full-width">
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

              <div className="reportfound-form-group reportfound-full-width">
                <label>UPLOAD PHOTO (OPTIONAL)</label>
                <div className="reportfound-photo-upload-area" onClick={() => document.getElementById('reportfound-photoInput').click()}>
                  <input
                    type="file"
                    id="reportfound-photoInput"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    style={{ display: 'none' }}
                  />
                  <div className="reportfound-upload-icon"></div>
                  <p>Click or drop image here</p>
                  <span className="reportfound-upload-hint">Max file size: 5 MB</span>
                  {formData.photo && (
                    <div className="reportfound-selected-file">
                      Photo uploaded
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="reportfound-form-buttons">
              <button type="submit" className="reportfound-submit-btn">UPLOAD REPORT</button>
              <button type="button" className="reportfound-cancel-btn" onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportFoundItem;