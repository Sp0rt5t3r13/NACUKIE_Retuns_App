import React, { useState } from 'react';
import './ReturnsForm.css';

function ReturnsForm() {
  // Form states - UPDATED FIELDS
  const [formData, setFormData] = useState({
    sheetNumber: '',
    date: '', // Day of month (1-31)
    serviceType: 'sunday', // sunday or midweek
    members: 0,
    guests: 0,
    offerings: '0.00',
    notes: ''
  });

  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for number fields
    if (name === 'members' || name === 'guests') {
      const numValue = parseInt(value) || 0;
      setFormData({
        ...formData,
        [name]: numValue
      });
    } else if (name === 'offerings') {
      // Allow only numbers and one decimal point
      const validValue = value.replace(/[^0-9.]/g, '');
      const parts = validValue.split('.');
      if (parts.length <= 2) { // Only allow one decimal point
        setFormData({
          ...formData,
          [name]: validValue
        });
      }
    } else if (name === 'date') {
      // Validate day of month (1-31)
      const day = parseInt(value);
      if ((day >= 1 && day <= 31) || value === '') {
        setFormData({
          ...formData,
          [name]: value
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  // Remove a file
  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  // Calculate total attendance
  const totalAttendance = formData.members + formData.guests;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // Validate form - UPDATED VALIDATION
    if (!formData.sheetNumber || !formData.date || !formData.serviceType) {
      setSubmitMessage({ type: 'error', text: 'Please fill in all required fields' });
      setIsSubmitting(false);
      return;
    }

    if (formData.date < 1 || formData.date > 31) {
      setSubmitMessage({ type: 'error', text: 'Date must be between 1 and 31' });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      console.log('Form Data Submitted:', {
        ...formData,
        totalAttendance,
        files: files.map(f => ({ name: f.name, size: f.size }))
      });
      
      setSubmitMessage({ 
        type: 'success', 
        text: `Attendance data submitted successfully! ${files.length > 0 ? 'Documents uploaded.' : ''} Email will be sent shortly.` 
      });
      setIsSubmitting(false);
      
      // Reset form after successful submission
      setFormData({
        sheetNumber: '',
        date: '',
        serviceType: 'sunday',
        members: 0,
        guests: 0,
        offerings: '0.00',
        notes: ''
      });
      setFiles([]);
    }, 2000);
  };

  // Calculate total file size
  const totalFileSize = files.reduce((total, file) => total + file.size, 0);
  const maxSize = 10 * 1024 * 1024; // 10MB limit

  return (
    <div className="returns-form-container">
      <div className="form-header">
        <h2>📊 Attendance & Offering Submission</h2>
        <p>Record service attendance and upload supporting documents</p>
      </div>

      {submitMessage && (
        <div className={`submit-message ${submitMessage.type}`}>
          {submitMessage.type === 'success' ? '✅' : '⚠️'} {submitMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="returns-form">
        
        {/* Section 1: Service Information */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-number">1</span>
            Service Information
          </h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="sheetNumber">Sheet Number *</label>
              <input
                type="text"
                id="sheetNumber"
                name="sheetNumber"
                value={formData.sheetNumber}
                onChange={handleInputChange}
                placeholder="e.g., SHT-001, Week-1"
                required
              />
              <small className="field-hint">Unique identifier for this submission</small>
            </div>

            <div className="form-group">
              <label htmlFor="date">Day of Month *</label>
              <input
                type="number"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                placeholder="1-31"
                min="1"
                max="31"
                required
              />
              <small className="field-hint">Enter day number (1-31)</small>
            </div>

            <div className="form-group">
              <label htmlFor="serviceType">Service Type *</label>
              <select
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleInputChange}
                required
              >
                <option value="sunday">Sunday Service</option>
                <option value="midweek">Mid-Week Service</option>
                <option value="special">Special Service</option>
                <option value="prayer">Prayer Meeting</option>
                <option value="youth">Youth Service</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Attendance & Offerings */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-number">2</span>
            Attendance & Financials
          </h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="members">Members Present</label>
              <div className="number-input-container">
                <button
                  type="button"
                  className="number-btn minus"
                  onClick={() => setFormData({
                    ...formData,
                    members: Math.max(0, formData.members - 1)
                  })}
                >
                  −
                </button>
                <input
                  type="number"
                  id="members"
                  name="members"
                  value={formData.members}
                  onChange={handleInputChange}
                  min="0"
                />
                <button
                  type="button"
                  className="number-btn plus"
                  onClick={() => setFormData({
                    ...formData,
                    members: formData.members + 1
                  })}
                >
                  +
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="guests">Guests / Visitors</label>
              <div className="number-input-container">
                <button
                  type="button"
                  className="number-btn minus"
                  onClick={() => setFormData({
                    ...formData,
                    guests: Math.max(0, formData.guests - 1)
                  })}
                >
                  −
                </button>
                <input
                  type="number"
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleInputChange}
                  min="0"
                />
                <button
                  type="button"
                  className="number-btn plus"
                  onClick={() => setFormData({
                    ...formData,
                    guests: formData.guests + 1
                  })}
                >
                  +
                </button>
              </div>
            </div>

            <div className="form-group attendance-total">
              <label>Total Attendance</label>
              <div className="total-display">
                <span className="total-number">{totalAttendance}</span>
                <span className="total-label">People</span>
              </div>
              <small className="field-hint">Members + Guests</small>
            </div>

            <div className="form-group">
              <label htmlFor="offerings">Offerings Amount ($)</label>
              <div className="currency-input-container">
                <span className="currency-symbol">$</span>
                <input
                  type="text"
                  id="offerings"
                  name="offerings"
                  value={formData.offerings}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="currency-input"
                />
              </div>
              <small className="field-hint">Enter amount with decimals</small>
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="notes">Additional Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Any special notes about the service, announcements, or other observations..."
              rows="4"
            />
          </div>
        </div>

        {/* Section 3: Document Upload */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-number">3</span>
            Supporting Documents (Optional)
          </h3>
          
          <div className="upload-area">
            <div className="upload-instructions">
              <p>📸 <strong>Upload supporting documents:</strong></p>
              <ul>
                <li>Offering count sheets</li>
                <li>Attendance registers</li>
                <li>Service program/notes</li>
                <li>Photographs from service</li>
                <li>Other relevant documents</li>
              </ul>
              <p className="file-limits">Maximum: 10 files • 10MB total • Images, PDF, Word, Excel</p>
            </div>

            <div className="file-input-container">
              <input
                type="file"
                id="fileUpload"
                multiple
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                disabled={files.length >= 10 || totalFileSize >= maxSize}
              />
              <label htmlFor="fileUpload" className="file-upload-btn">
                📁 Choose Files
              </label>
              <span className="file-count">{files.length} files selected</span>
            </div>

            {/* File Preview */}
            {files.length > 0 && (
              <div className="file-preview">
                <h4>Selected Files:</h4>
                <div className="file-list">
                  {files.map((file, index) => (
                    <div key={index} className="file-item">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      <button
                        type="button"
                        className="remove-file"
                        onClick={() => removeFile(index)}
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="file-stats">
                  <span>Total: {files.length} files</span>
                  <span>Size: {(totalFileSize / 1024 / 1024).toFixed(2)} MB</span>
                  {totalFileSize >= maxSize && (
                    <span className="error-text">⚠️ Maximum size reached</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form Summary */}
        <div className="form-summary">
          <h4>📋 Submission Summary</h4>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Sheet Number:</span>
              <span className="summary-value">{formData.sheetNumber || 'Not entered'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Service Date:</span>
              <span className="summary-value">
                Day {formData.date || 'Not specified'}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Service Type:</span>
              <span className="summary-value">
                {formData.serviceType === 'sunday' ? 'Sunday Service' : 
                 formData.serviceType === 'midweek' ? 'Mid-Week Service' : 
                 formData.serviceType === 'special' ? 'Special Service' :
                 formData.serviceType === 'prayer' ? 'Prayer Meeting' : 'Youth Service'}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Attendance:</span>
              <span className="summary-value highlight">{totalAttendance} people</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Offerings:</span>
              <span className="summary-value highlight">
                ${parseFloat(formData.offerings || 0).toFixed(2)}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Documents:</span>
              <span className="summary-value">{files.length} files</span>
            </div>
          </div>
        </div>

        {/* Submit Section */}
        <div className="form-submit-section">
          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all form data?')) {
                  setFormData({
                    sheetNumber: '',
                    date: '',
                    serviceType: 'sunday',
                    members: 0,
                    guests: 0,
                    offerings: '0.00',
                    notes: ''
                  });
                  setFiles([]);
                  setSubmitMessage('');
                }
              }}
              disabled={isSubmitting}
            >
              🗑️ Clear Form
            </button>
            
            <button
              type="submit"
              className="primary-submit-btn"
              disabled={isSubmitting || !formData.sheetNumber || !formData.date}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-small"></span>
                  Processing Submission...
                </>
              ) : (
                '📧 Submit Attendance Data'
              )}
            </button>
          </div>
          
          <div className="form-note">
            <p>✅ <strong>Submission Process:</strong></p>
            <ol>
              <li>Data will be validated and saved</li>
              <li>Documents will be uploaded securely</li>
              <li>Email report will be sent to designated address</li>
              <li>You'll receive a confirmation</li>
            </ol>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ReturnsForm;