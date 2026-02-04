import React, { useState, useEffect } from 'react';
import './App.css';
import { 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut 
} from './services/firebase';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!loginEmail || !loginPassword) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      // Success - onAuthStateChanged will update state
    } catch (error) {
      setError('Login failed: ' + error.message);
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (signupPassword !== signupConfirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      // Success - onAuthStateChanged will update state
    } catch (error) {
      setError('Signup failed: ' + error.message);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Reset form states
      setLoginEmail('');
      setLoginPassword('');
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
      setSignupConfirmPassword('');
      setError('');
    } catch (error) {
      setError('Logout failed: ' + error.message);
    }
  };

  // Show loading screen
  if (loading) {
    return (
      <div className="App loading">
        <div className="spinner"></div>
        <p>Loading NACUKIE Returns App...</p>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="App">
        <header>
          <h1>📦 NACUKIE Returns App</h1>
          <div className="user-info">
            <span className="user-email">{user.email}</span>
            <button 
              className="logout-btn"
              onClick={handleLogout}
              disabled={loading}
            >
              {loading ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </header>
        
        <main>
          <div className="dashboard">
            <div className="welcome-message">
              <h2>Welcome to Returns Management</h2>
              <p className="subtitle">Efficient document processing for NACUKIE returns</p>
            </div>
            
            <div className="app-description">
              <p>This app helps you manage return documents by:</p>
              <ul className="features-list">
                <li>✅ Capturing return information</li>
                <li>✅ Uploading supporting documents</li>
                <li>✅ Sending completed returns to designated email</li>
                <li>✅ Tracking submission history</li>
              </ul>
            </div>
            
            <div className="quick-actions">
              <h3>Ready to Start?</h3>
              <div className="action-buttons">
                <button className="primary-action" disabled>
                  📋 Start New Return
                </button>
                <button className="secondary-action" disabled>
                  📸 Upload Documents
                </button>
                <button className="secondary-action" disabled>
                  📧 View Submissions
                </button>
              </div>
            </div>
            
            <div className="coming-soon">
              <h4>Next Features in Development:</h4>
              <div className="feature-cards">
                <div className="feature-card">
                  <div className="feature-icon">📄</div>
                  <h5>Return Form</h5>
                  <p>Input fields for return details</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">📷</div>
                  <h5>Photo Capture</h5>
                  <p>Document/image upload</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">✉️</div>
                  <h5>Email Integration</h5>
                  <p>Send to designated email</p>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <footer>
          <div className="footer-content">
            <p className="app-version">NACUKIE Returns App v1.0 • Powered by Firebase</p>
            <p className="user-id">User: {user.email} • ID: {user.uid.substring(0, 8)}...</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="App">
      <header>
        <div className="app-brand">
          <h1>📦 NACUKIE Returns App</h1>
          <p className="tagline">Streamlined Document Processing for Returns Management</p>
        </div>
      </header>
      
      <main>
        <div className="auth-container">
          <div className="auth-header">
            <h2>Secure Authentication</h2>
            <p>Sign in to manage return documents</p>
          </div>
          
          <div className="auth-tabs">
            <button 
              className={isLogin ? 'active' : ''}
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
            >
              🔐 Login
            </button>
            <button 
              className={!isLogin ? 'active' : ''}
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
            >
              📝 Sign Up
            </button>
          </div>
          
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}
          
          {isLogin ? (
            <form className="login-form" onSubmit={handleLogin}>
              <h3>Existing Users</h3>
              <div className="input-group">
                <label htmlFor="loginEmail">Email Address</label>
                <input 
                  id="loginEmail"
                  type="email" 
                  placeholder="your.email@company.com" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required 
                  disabled={loading}
                />
              </div>
              <div className="input-group">
                <label htmlFor="loginPassword">Password</label>
                <input 
                  id="loginPassword"
                  type="password" 
                  placeholder="Enter your password" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required 
                  disabled={loading}
                />
              </div>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? '🔐 Logging in...' : '🔐 Login to Dashboard'}
              </button>
            </form>
          ) : (
            <form className="signup-form" onSubmit={handleSignup}>
              <h3>New User Registration</h3>
              <div className="input-group">
                <label htmlFor="signupName">Full Name</label>
                <input 
                  id="signupName"
                  type="text" 
                  placeholder="John Smith" 
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required 
                  disabled={loading}
                />
              </div>
              <div className="input-group">
                <label htmlFor="signupEmail">Work Email</label>
                <input 
                  id="signupEmail"
                  type="email" 
                  placeholder="john.smith@nacukie.com" 
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required 
                  disabled={loading}
                />
              </div>
              <div className="input-group">
                <label htmlFor="signupPassword">Password (min. 6 characters)</label>
                <input 
                  id="signupPassword"
                  type="password" 
                  placeholder="Create secure password" 
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required 
                  disabled={loading}
                />
              </div>
              <div className="input-group">
                <label htmlFor="signupConfirmPassword">Confirm Password</label>
                <input 
                  id="signupConfirmPassword"
                  type="password" 
                  placeholder="Re-enter password" 
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  required 
                  disabled={loading}
                />
              </div>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? '🔄 Creating Account...' : '📝 Create Account'}
              </button>
            </form>
          )}
          
          <div className="security-notice">
            <p>🔒 <strong>Secure Authentication:</strong> Powered by Firebase</p>
            <p className="small">Your credentials are encrypted and securely stored</p>
          </div>
        </div>
      </main>
      
      <footer>
        <div className="footer-content">
          <p>NACUKIE Returns Management System • v1.0</p>
          <p className="copyright">© 2024 NACUKIE. For authorized personnel only.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;