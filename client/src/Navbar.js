import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const items = [
  { key: 'smart', label: 'Smart Redirects' },
  { key: 'expiring', label: 'Expiring' },
  { key: 'password', label: 'Password Links' },
  { key: 'ai', label: 'AI Slugs' },
  { key: 'malware', label: 'Malware Scan' },
  { key: 'qr', label: 'QR Codes' },
  { key: 'profile', label: 'Profile' }
];

function Navbar({ current, onNavigate, user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const initial = user?.username?.charAt(0)?.toUpperCase() || '?';
  const avatar = user?.avatarUrl;

  return (
    <header className="app-topnav">
      <div className="app-topnav-inner">
        <button
          type="button"
          className="app-topnav-brand"
          onClick={() => onNavigate('smart')}
          aria-label="Home"
        >
          <span className="app-topnav-logo" aria-hidden>⚡</span>
          <span className="app-topnav-title">LinkVault</span>
        </button>

        <nav className="app-topnav-links" aria-label="Main">
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              className={
                'app-nav-pill' + (current === item.key ? ' app-nav-pill-active' : '')
              }
              onClick={() => onNavigate(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="app-topnav-actions">
          <div className="nav-profile" ref={menuRef}>
            <button
              type="button"
              className="app-user-chip"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              {avatar ? (
                <img src={avatar} alt="" className="app-user-avatar-img" />
              ) : (
                <span className="nav-avatar">{initial}</span>
              )}
              <span className="nav-username">{user?.username}</span>
            </button>
            {menuOpen && (
              <div className="profile-dropdown-glass" role="menu">
                <button type="button" role="menuitem" onClick={() => { onNavigate('profile'); setMenuOpen(false); }}>
                  Profile
                </button>
                <button type="button" role="menuitem" onClick={() => { onLogout(); setMenuOpen(false); }}>
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
