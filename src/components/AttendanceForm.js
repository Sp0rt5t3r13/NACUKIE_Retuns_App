import React, { useState } from 'react';
import './AttendanceForm.css';

function AttendanceForm() {
  // District and Congregation data
  const [locationData, setLocationData] = useState({
    district: '',
    congregation: ''
  });

  // Current entry state
  const [currentEntry, setCurrentEntry] = useState({
    sheetNumber: '',
    date: '',
    month: new Date().getMonth() + 1, // Current month (1-12)
    year: new Date().getFullYear(),
    serviceType: 'S', // S for Sunday, M for Midweek
    members: '',
    guests: '',
    offerings: '',
    notes: ''
  });

  // All entries for the month
  const [monthlyEntries, setMonthlyEntries] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Handle district/congregation changes
  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setLocationData({
      ...locationData,
      [name]: value
    });
  };

  // Handle input changes for current entry
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'sheetNumber') {
      // Ensure 3 digits max
      if (value === '' || (/^\d{0,3}$/.test(value))) {
        setCurrentEntry({
          ...currentEntry,
          [name]: value
        });
      }
    } else if (name === 'date') {
      // Ensure valid day (1-31)
      if (value === '' || (/^\d{0,2}$/.test(value) && (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 31)))) {
        setCurrentEntry({
          ...currentEntry,
          [name]: value
        });
      }
    } else if (name === 'members' || name === 'guests') {
      // Allow numbers only
      if (value === '' || /^\d+$/.test(value)) {
        setCurrentEntry({
          ...currentEntry,
          [name]: value
        });
      }
    } else if (name === 'offerings') {
      // Allow numbers and one decimal point
      if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
        setCurrentEntry({
          ...currentEntry,
          [name]: value
        });
      }
    } else {
      setCurrentEntry({
        ...currentEntry,
        [name]: value
      });
    }
  };

  // Add current entry to monthly sheet
  const addToMonthlySheet = () => {
    // Validate location data
    if (!locationData.district || !locationData.congregation) {
      setSubmitMessage({ type: 'error', text: 'Please enter District and Congregation' });
      return;
    }

    // Validate required fields
    if (!currentEntry.sheetNumber || currentEntry.sheetNumber.length !== 3) {
      setSubmitMessage({ type: 'error', text: 'Sheet Number must be 3 digits (001-999)' });
      return;
    }

    if (!currentEntry.date) {
      setSubmitMessage({ type: 'error', text: 'Date is required' });
      return;
    }

    if (!currentEntry.serviceType) {
      setSubmitMessage({ type: 'error', text: 'Service Type is required' });
      return;
    }

    // Add to monthly entries
    const newEntry = {
      ...currentEntry,
      ...locationData, // Include district and congregation
      id: Date.now(), // Unique ID for each entry
      totalAttendance: (parseInt(currentEntry.members) || 0) + (parseInt(currentEntry.guests) || 0),
      timestamp: new Date().toISOString()
    };

    setMonthlyEntries([...monthlyEntries, newEntry]);
    
    // Reset current entry (keep month/year and location)
    setCurrentEntry(prev => ({
      sheetNumber: prev.sheetNumber, // Keep same sheet number for month
      date: '',
      month: prev.month,
      year: prev.year,
      serviceType: 'S',
      members: '',
      guests: '',
      offerings: '',
      notes: ''
    }));

    setSubmitMessage({ 
      type: 'success', 
      text: `Entry added for Day ${currentEntry.date}` 
    });
  };

  // Remove entry from monthly sheet
  const removeEntry = (id) => {
    setMonthlyEntries(monthlyEntries.filter(entry => entry.id !== id));
  };

  // Calculate monthly totals
  const calculateMonthlyTotals = () => {
    const totals = monthlyEntries.reduce((acc, entry) => {
      acc.totalMembers += parseInt(entry.members) || 0;
      acc.totalGuests += parseInt(entry.guests) || 0;
      acc.totalOfferings += parseFloat(entry.offerings) || 0;
      acc.totalEntries++;
      return acc;
    }, {
      totalMembers: 0,
      totalGuests: 0,
      totalOfferings: 0,
      totalEntries: 0
    });

    totals.totalAttendance = totals.totalMembers + totals.totalGuests;
    return totals;
  };

  const monthlyTotals = calculateMonthlyTotals();

  // Handle final submission
  const handleSubmitMonthlySheet = async () => {
    if (monthlyEntries.length === 0) {
      setSubmitMessage({ type: 'error', text: 'No entries to submit' });
      return;
    }

    if (!locationData.district || !locationData.congregation) {
      setSubmitMessage({ type: 'error', text: 'Please enter District and Congregation before submitting' });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage({ type: 'info', text: 'Submitting monthly data...' });

    // Simulate API call
    setTimeout(() => {
      const submissionData = {
        ...locationData,
        month: currentEntry.month,
        year: currentEntry.year,
        entries: monthlyEntries,
        totals: monthlyTotals,
        submittedAt: new Date().toISOString()
      };

      console.log('Monthly Submission Data:', submissionData);
      
      setSubmitMessage({ 
        type: 'success', 
        text: `Monthly sheet submitted! ${monthlyEntries.length} entries sent for ${locationData.district} - ${locationData.congregation}` 
      });
      setIsSubmitting(false);

      // Clear after successful submission (keep location data)
      setMonthlyEntries([]);
    }, 3000);
  };

  // Month names for display
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get unique sheet numbers used
  const uniqueSheetNumbers = [...new Set(monthlyEntries.map(entry => entry.sheetNumber))];

  return (
    <div className="attendance-form-container">
      {submitMessage && (
        <div className={`submit-message ${submitMessage.type}`}>
          {submitMessage.type === 'success' ? '✅' : 
           submitMessage.type === 'error' ? '⚠️' : 'ℹ️'} {submitMessage.text}
        </div>
      )}

      {/* Location Information */}
      <div className="location-section">
        <h3 className="section-title">
          <span className="section-number">📍</span>
          Location Information
        </h3>
        <div className="location-form-grid">
          <div className="location-cell">
            <label htmlFor="district">District *</label>
            <input
              type="text"
              id="district"
              name="district"
              value={locationData.district}
              onChange={handleLocationChange}
              placeholder="e.g., North District"
              required
            />
          </div>

          <div className="location-cell">
            <label htmlFor="congregation">Congregation *</label>
            <input
              type="text"
              id="congregation"
              name="congregation"
              value={locationData.congregation}
              onChange={handleLocationChange}
              placeholder="e.g., Central Church"
              required
            />
          </div>

          <div className="location-cell month-display-cell">
            <div className="month-year-display">
              <span className="month-label">{monthNames[currentEntry.month - 1]}</span>
              <span className="year-label">{currentEntry.year}</span>
            </div>
            <small>Current Month</small>
          </div>
        </div>
      </div>

      {/* Month/Year Selection */}
      <div className="month-year-section">
        <div className="month-year-grid">
          <div className="month-year-cell">
            <label htmlFor="month">Select Month:</label>
            <select
              id="month"
              name="month"
              value={currentEntry.month}
              onChange={handleInputChange}
            >
              {monthNames.map((month, index) => (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div className="month-year-cell">
            <label htmlFor="year">Select Year:</label>
            <input
              type="number"
              id="year"
              name="year"
              value={currentEntry.year}
              onChange={handleInputChange}
              min="2000"
              max="2100"
            />
          </div>

          <div className="month-year-cell sheet-number-cell">
            <label htmlFor="sheetNumber">Sheet # for Month:</label>
            <div className="sheet-number-input-container">
              <input
                type="text"
                id="sheetNumber"
                name="sheetNumber"
                value={currentEntry.sheetNumber}
                onChange={handleInputChange}
                placeholder="001"
                maxLength="3"
                className="sheet-number-input"
              />
              <small>3-digit sheet number for this month</small>
            </div>
          </div>
        </div>
      </div>

      {/* Entry Form - Single Row */}
      <div className="entry-form-section">
        <h3 className="section-title">
          <span className="section-number">1</span>
          Add New Service Entry
        </h3>
        
        <div className="entry-form-row">
          {/* Date */}
          <div className="form-field">
            <label htmlFor="date">Date</label>
            <input
              type="number"
              id="date"
              name="date"
              value={currentEntry.date}
              onChange={handleInputChange}
              placeholder="1-31"
              min="1"
              max="31"
              className="date-input"
            />
            <small>Day</small>
          </div>

          {/* Service Type */}
          <div className="form-field">
            <label htmlFor="serviceType">Service</label>
            <select
              id="serviceType"
              name="serviceType"
              value={currentEntry.serviceType}
              onChange={handleInputChange}
              className="service-type-select"
            >
              <option value="S">S (Sunday)</option>
              <option value="M">M (Midweek)</option>
            </select>
          </div>

          {/* Members */}
          <div className="form-field">
            <label htmlFor="members">Members</label>
            <input
              type="number"
              id="members"
              name="members"
              value={currentEntry.members}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              className="members-input"
            />
          </div>

          {/* Guests */}
          <div className="form-field">
            <label htmlFor="guests">Guests</label>
            <input
              type="number"
              id="guests"
              name="guests"
              value={currentEntry.guests}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              className="guests-input"
            />
          </div>

          {/* Offerings */}
          <div className="form-field">
            <label htmlFor="offerings">Offerings</label>
            <input
              type="text"
              id="offerings"
              name="offerings"
              value={currentEntry.offerings}
              onChange={handleInputChange}
              placeholder="0.00"
              className="offerings-input"
            />
            <small>Amount</small>
          </div>

          {/* Notes */}
          <div className="form-field wide-field">
            <label htmlFor="notes">Notes</label>
            <input
              type="text"
              id="notes"
              name="notes"
              value={currentEntry.notes}
              onChange={handleInputChange}
              placeholder="Optional notes..."
              className="notes-input"
            />
          </div>

          {/* Add Button */}
          <div className="form-field add-button-field">
            <button
              type="button"
              className="add-entry-btn"
              onClick={addToMonthlySheet}
              disabled={isSubmitting}
              title="Add this service entry to monthly sheet"
            >
              Add
            </button>
          </div>
        </div>

        {/* Sheet Number Display */}
        {currentEntry.sheetNumber && (
          <div className="current-sheet-info">
            <span className="sheet-label">Using Sheet #:</span>
            <span className="sheet-number-badge">{currentEntry.sheetNumber}</span>
            <small>for all entries this month</small>
          </div>
        )}
      </div>

      {/* Monthly Sheet Display */}
      <div className="monthly-sheet-section">
        <div className="sheet-header">
          <div className="sheet-title">
            <h3 className="section-title">
              <span className="section-number">2</span>
              Monthly Sheet - {monthNames[currentEntry.month - 1]} {currentEntry.year}
            </h3>
            <div className="sheet-info">
              <span className="entry-count">{monthlyEntries.length} entries</span>
              {locationData.district && locationData.congregation && (
                <span className="location-info">
                  {locationData.district} • {locationData.congregation}
                </span>
              )}
            </div>
          </div>
          
          {monthlyEntries.length > 0 && (
            <div className="sheet-actions">
              <button
                type="button"
                className="clear-sheet-btn"
                onClick={() => {
                  if (window.confirm('Clear entire monthly sheet? This cannot be undone.')) {
                    setMonthlyEntries([]);
                  }
                }}
              >
                🗑️ Clear Sheet
              </button>
            </div>
          )}
        </div>

        {/* Spreadsheet Table */}
        {monthlyEntries.length > 0 ? (
          <div className="sheet-table-container">
            <table className="sheet-table">
              <thead>
                <tr>
                  <th>Sheet #</th>
                  <th>Date</th>
                  <th>Service</th>
                  <th>Members</th>
                  <th>Guests</th>
                  <th>Total</th>
                  <th>Offerings</th>
                  <th>Notes</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {monthlyEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="sheet-number-cell">{entry.sheetNumber}</td>
                    <td className="date-cell">{entry.date}</td>
                    <td className="service-cell">
                      <span className={`service-badge ${entry.serviceType === 'S' ? 'sunday' : 'midweek'}`}>
                        {entry.serviceType}
                      </span>
                    </td>
                    <td className="members-cell">{entry.members || '0'}</td>
                    <td className="guests-cell">{entry.guests || '0'}</td>
                    <td className="total-cell">
                      <span className="total-badge">
                        {(parseInt(entry.members) || 0) + (parseInt(entry.guests) || 0)}
                      </span>
                    </td>
                    <td className="offerings-cell">
                      {entry.offerings ? parseFloat(entry.offerings).toFixed(2) : '0.00'}
                    </td>
                    <td className="notes-cell">{entry.notes}</td>
                    <td className="action-cell">
                      <button
                        type="button"
                        className="remove-row-btn"
                        onClick={() => removeEntry(entry.id)}
                        title="Remove this entry"
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Monthly Totals Row */}
              <tfoot>
                <tr className="totals-row">
                  <td colSpan="3" className="totals-label">
                    <strong>Monthly Totals:</strong>
                  </td>
                  <td className="total-members">
                    <strong>{monthlyTotals.totalMembers}</strong>
                  </td>
                  <td className="total-guests">
                    <strong>{monthlyTotals.totalGuests}</strong>
                  </td>
                  <td className="grand-total">
                    <strong className="grand-total-number">
                      {monthlyTotals.totalAttendance}
                    </strong>
                  </td>
                  <td className="total-offerings">
                    <strong>{monthlyTotals.totalOfferings.toFixed(2)}</strong>
                  </td>
                  <td colSpan="2">
                    <small>{monthlyEntries.length} services</small>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="empty-sheet">
            <div className="empty-sheet-icon">📋</div>
            <p>No entries added yet. Add service data above to populate the monthly sheet.</p>
          </div>
        )}
      </div>

      {/* Submission Section */}
      <div className="submission-section">
        <div className="submission-summary">
          <h4>📊 Submission Summary</h4>
          <div className="summary-cards">
            <div className="summary-card">
              <div className="card-icon">📍</div>
              <div className="card-content">
                <div className="card-label">Location</div>
                <div className="card-value">
                  {locationData.district && locationData.congregation 
                    ? `${locationData.district} - ${locationData.congregation}`
                    : 'Not set'}
                </div>
              </div>
            </div>
            
            <div className="summary-card">
              <div className="card-icon">📅</div>
              <div className="card-content">
                <div className="card-label">Month</div>
                <div className="card-value">{monthNames[currentEntry.month - 1]} {currentEntry.year}</div>
              </div>
            </div>
            
            <div className="summary-card">
              <div className="card-icon">📝</div>
              <div className="card-content">
                <div className="card-label">Entries</div>
                <div className="card-value">{monthlyEntries.length} services</div>
              </div>
            </div>
            
            <div className="summary-card">
              <div className="card-icon">👥</div>
              <div className="card-content">
                <div className="card-label">Total Attendance</div>
                <div className="card-value">{monthlyTotals.totalAttendance} people</div>
              </div>
            </div>
            
            <div className="summary-card">
              <div className="card-icon">💰</div>
              <div className="card-content">
                <div className="card-label">Total Offerings</div>
                <div className="card-value">{monthlyTotals.totalOfferings.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="submission-actions">
          <button
            type="button"
            className="submit-monthly-btn"
            onClick={handleSubmitMonthlySheet}
            disabled={isSubmitting || monthlyEntries.length === 0 || !locationData.district || !locationData.congregation}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-small"></span>
                Sending Monthly Report...
              </>
            ) : (
              '📧 Submit Monthly Sheet'
            )}
          </button>
          
          <div className="submission-note">
            <p>✅ <strong>Submission Process:</strong></p>
            <ul>
              <li>Complete monthly data will be formatted as a report</li>
              <li>Sent to the designated email address</li>
              <li>Includes all entries and calculated totals</li>
              <li>You'll receive a confirmation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceForm;