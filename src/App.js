import React, { useState } from 'react';
import './App.css';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Temporary - will connect to Firebase later
    alert('Login would connect to Firebase here');
    setIsAuthenticated(true);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    alert('Signup would connect to Firebase here');
    setIsAuthenticated(true);
  };

  if (isAuthenticated) {
    return (
      <div className="App">
        <header>
          <h1>📄 DataSender App</h1>
          <button 
            className="logout-btn"
            onClick={() => setIsAuthenticated(false)}
          >
            Logout
          </button>
        </header>
        
        <main>
          <div className="dashboard">
            <h2>Welcome to Dashboard!</h2>
            <p>Next step: Document upload form will go here</p>
            <div className="coming-soon">
              <h3>Features Coming Soon:</h3>
              <ul>
                <li>📋 Document input form</li>
                <li>📸 Photo capture/upload</li>
                <li>📧 Email submission</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <header>
        <h1>📄 DataSender App</h1>
        <p>Secure document submission made simple</p>
      </header>
      
      <main>
        <div className="auth-container">
          <div className="auth-tabs">
            <button 
              className={isLogin ? 'active' : ''}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button 
              className={!isLogin ? 'active' : ''}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>
          
          {isLogin ? (
            <form className="login-form" onSubmit={handleLogin}>
              <h2>Welcome Back</h2>
              <input type="email" placeholder="Email address" required />
              <input type="password" placeholder="Password" required />
              <button type="submit" className="submit-btn">Login</button>
            </form>
          ) : (
            <form className="signup-form" onSubmit={handleSignup}>
              <h2>Create Account</h2>
              <input type="text" placeholder="Full Name" required />
              <input type="email" placeholder="Email address" required />
              <input type="password" placeholder="Create Password" required />
              <input type="password" placeholder="Confirm Password" required />
              <button type="submit" className="submit-btn">Sign Up</button>
            </form>
          )}
        </div>
      </main>
      
      <footer>
        <p>Built with React • Documents are securely processed and emailed</p>
      </footer>
    </div>
  );
}

export default App;