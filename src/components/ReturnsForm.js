import React, { useState } from 'react';
import './ReturnsForm.css';

function ReturnsForm() {
  // Form states
  const [formData, setFormData] = useState({
    returnDate: new Date().toISOString().split('T')[0], // Today's date
    customerName: '',
    orderNumber: '',
    customerEmail: '',
    customerPhone: '',
    productSKU: '',
    productName: '',
    quantity: 1,
    returnReason: 'defective',
    additionalNotes: '',
    urgency: 'normal'
  });

  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // Validate form
    if (!formData.customerName || !formData.orderNumber || !formData.customerEmail) {
      setSubmitMessage({ type: 'error', text: 'Please fill in all required fields' });
      setIsSubmitting(false);
      return;
    }

    if (files.length === 0) {
      setSubmitMessage({ type: 'error', text: 'Please upload at least one document' });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call (we'll replace with real Firebase later)
    setTimeout(() => {
      console.log('Form Data:', formData);
      console.log('Files:', files);
      
      setSubmitMessage({ 
        type: 'success', 
        text: 'Return submitted successfully! Documents will be emailed shortly.' 
      });
      setIsSubmitting(false);
      
      // Reset form after successful submission
      setFormData({
        returnDate: new Date().toISOString().split('T')[0],
        customerName: '',
        orderNumber: '',
        customerEmail: '',
        customerPhone: '',
        productSKU: '',
        productName: '',
        quantity: 1,
        returnReason: 'defective',
        additionalNotes: '',
        urgency: 'normal'
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
        <h2>📋 New Return Submission</h2>
        <p>Complete all fields and upload supporting documents</p>
      </div>

      {submitMessage && (
        <div className={`submit-message ${submitMessage.type}`}>
          {submitMessage.type === 'success' ? '✅' : '⚠️'} {submitMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="returns-form">
        
        {/* Section 1: Customer Information */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-number">1</span>
            Customer Information
          </h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="customerName">Full Name *</label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="John Smith"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="customerEmail">Email Address *</label>
              <input
                type="email"
                id="customerEmail"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleInputChange}
                placeholder="customer@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="customerPhone">Phone Number</label>
              <input
                type="tel"
                id="customerPhone"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="form-group">
              <label htmlFor="orderNumber">Order/Reference Number *</label>
              <input
                type="text"
                id="orderNumber"
                name="orderNumber"
                value={formData.orderNumber}
                onChange={handleInputChange}
                placeholder="ORD-2024-00123"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Return Details */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-number">2</span>
            Return Details
          </h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="returnDate">Return Date</label>
              <input
                type="date"
                id="returnDate"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="productSKU">Product SKU</label>
              <input
                type="text"
                id="productSKU"
                name="productSKU"
                value={formData.productSKU}
                onChange={handleInputChange}
                placeholder="SKU-12345"
              />
            </div>

            <div className="form-group">
              <label htmlFor="productName">Product Name</label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                placeholder="Widget Pro 5000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="1"
                max="100"
              />
            </div>

            <div className="form-group">
              <label htmlFor="returnReason">Return Reason</label>
              <select
                id="returnReason"
                name="returnReason"
                value={formData.returnReason}
                onChange={handleInputChange}
              >
                <option value="defective">Defective Product</option>
                <option value="wrong-item">Wrong Item Received</option>
                <option value="damaged">Damaged During Shipping</option>
                <option value="size">Size/Color Incorrect</option>
                <option value="change-mind">Change of Mind</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="urgency">Urgency Level</label>
              <select
                id="urgency"
                name="urgency"
                value={formData.urgency}
                onChange={handleInputChange}
              >
                <option value="low">Low Priority</option>
                <option value="normal">Normal</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="additionalNotes">Additional Notes</label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleInputChange}
              placeholder="Please provide any additional details about this return..."
              rows="4"
            />
          </div>
        </div>

        {/* Section 3: Document Upload */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-number">3</span>
            Supporting Documents
          </h3>
          
          <div className="upload-area">
            <div className="upload-instructions">
              <p>📸 <strong>Upload photos or documents:</strong></p>
              <ul>
                <li>Product photos showing the issue</li>
                <li>Receipt or proof of purchase</li>
                <li>Shipping labels</li>
                <li>Any other relevant documents</li>
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

        {/* Submit Section */}
        <div className="form-submit-section">
          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => {
                setFormData({
                  returnDate: new Date().toISOString().split('T')[0],
                  customerName: '',
                  orderNumber: '',
                  customerEmail: '',
                  customerPhone: '',
                  productSKU: '',
                  productName: '',
                  quantity: 1,
                  returnReason: 'defective',
                  additionalNotes: '',
                  urgency: 'normal'
                });
                setFiles([]);
                setSubmitMessage('');
              }}
              disabled={isSubmitting}
            >
              🗑️ Clear Form
            </button>
            
            <button
              type="submit"
              className="primary-submit-btn"
              disabled={isSubmitting || files.length === 0}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-small"></span>
                  Processing...
                </>
              ) : (
                '📧 Submit Return & Send Email'
              )}
            </button>
          </div>
          
          <div className="form-note">
            <p>✅ <strong>Submission Process:</strong></p>
            <ol>
              <li>Form data will be validated</li>
              <li>Documents will be uploaded securely</li>
              <li>Email will be sent to designated address</li>
              <li>You'll receive a confirmation</li>
            </ol>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ReturnsForm;