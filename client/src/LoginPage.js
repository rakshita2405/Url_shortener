import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage({ mode, onModeChange, onSubmit, form, onFormChange, message, onBackClick }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-page">
      {/* Left side - branding and info */}
      <div className="login-side login-left">
        <div className="login-branding">
          <h1 className="login-logo">⚡ LinkVault</h1>
          <p className="login-tagline">Smart URL Shortening Platform</p>
          <p className="login-description">
            Create powerful short links with smart device redirects, password protection, QR codes, and more.
          </p>

          <div className="login-features">
            <div className="login-feature">
              <span className="feature-icon">🔐</span>
              <span className="feature-text">Secure & Private</span>
            </div>
            <div className="login-feature">
              <span className="feature-icon">⚡</span>
              <span className="feature-text">Lightning Fast</span>
            </div>
            <div className="login-feature">
              <span className="feature-icon">📊</span>
              <span className="feature-text">Analytics Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="login-side login-right">
        <button className="back-button" onClick={onBackClick}>
          ← Back
        </button>

        <div className="login-form-container">
          <h2 className="login-title">
            {mode === 'register' ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="login-subtitle">
            {mode === 'register'
              ? 'Join thousands of users shortening URLs'
              : 'Login to your LinkVault account'}
          </p>

          {message && (
            <div className={`login-message ${message.toLowerCase().includes('error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          <form onSubmit={onSubmit} className="login-form">
            {mode === 'register' && (
              <>
                <div className="form-field">
                  <label htmlFor="username" className="form-label">Username</label>
                  <div className="form-input-wrapper">
                    <span className="input-icon">👤</span>
                    <input
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      className="form-input"
                      value={form.username}
                      onChange={(e) => onFormChange('username', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <div className="form-input-wrapper">
                    <span className="input-icon">📧</span>
                    <input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="form-input"
                      value={form.email}
                      onChange={(e) => onFormChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {mode === 'login' && (
              <div className="form-field">
                <label htmlFor="identifier" className="form-label">Email or Username</label>
                <div className="form-input-wrapper">
                  <span className="input-icon">🔑</span>
                  <input
                    id="identifier"
                    type="text"
                    placeholder="Enter email or username"
                    className="form-input"
                    value={form.identifier}
                    onChange={(e) => onFormChange('identifier', e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-field">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="form-input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={mode === 'register' ? 'Create a strong password' : 'Enter your password'}
                  className="form-input"
                  value={form.password}
                  onChange={(e) => onFormChange('password', e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {mode === 'register' && form.password && (
              <div className="password-strength">
                <div className="strength-text">
                  {form.password.length < 8 && 'Weak'}
                  {form.password.length >= 8 && form.password.length < 12 && 'Fair'}
                  {form.password.length >= 12 && 'Strong'} password
                </div>
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: `${Math.min((form.password.length / 20) * 100, 100)}%`,
                      background:
                        form.password.length < 8
                          ? '#ff6b6b'
                          : form.password.length < 12
                            ? '#ffd93d'
                            : '#51cf66'
                    }}
                  />
                </div>
              </div>
            )}

            <button type="submit" className="submit-button">
              {mode === 'register' ? 'Create Account' : 'Login'}
            </button>
          </form>

          <div className="login-divider">
            <span>Or</span>
          </div>

          <button
            type="button"
            className="toggle-mode-button"
            onClick={onModeChange}
          >
            {mode === 'register'
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </button>
        </div>

        <p className="login-footer">
          By {mode === 'register' ? 'registering' : 'logging in'}, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
