import { useCallback, useEffect, useState } from 'react';
import {
  register,
  login,
  getProfile,
  createShortUrl,
  getMyUrls
} from './services/api';
import Landing from './Landing';
import LoginPage from './LoginPage';
import './App.css';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [mode, setMode] = useState('login');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ username: '', email: '', identifier: '', password: '' });
  const [urlForm, setUrlForm] = useState({
    longUrl: '',
    expiresAt: '',
    password: '',
    customSlug: '',
    androidUrl: '',
    iosUrl: '',
    desktopUrl: ''
  });
  const [urls, setUrls] = useState([]);

  const loadUrls = async (owned) => {
    if (!owned) return;
    const result = await getMyUrls();
    if (result.success) {
      setUrls(result.data);
    }
  };

  const fetchProfile = useCallback(async () => {
    const result = await getProfile();
    if (result.success) {
      setUser(result.data.user);
      setMessage('Logged in as ' + result.data.user.username);
      setShowLanding(false);
      await loadUrls(true);
    } else {
      setShowLanding(true);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onSubmitAuth = async (e) => {
    e.preventDefault();

    try {
      let result;
      if (mode === 'register') {
        result = await register({ username: form.username, email: form.email, password: form.password });
      } else {
        result = await login({ identifier: form.identifier, password: form.password });
      }

      if (!result.success) {
        setMessage(result.message || 'Auth failed');
        return;
      }

      localStorage.setItem('token', result.data.token);
      setUser(result.data.user);
      setMessage(result.message || 'Authenticated');
      setShowLanding(false);
      await fetchProfile();
    } catch (error) {
      console.error(error);
      setMessage('Auth error');
    }
  };

  const onCreateUrl = async (e) => {
    e.preventDefault();
    try {
      const result = await createShortUrl({
        longUrl: urlForm.longUrl,
        expiresAt: urlForm.expiresAt || null,
        password: urlForm.password || null,
        customSlug: urlForm.customSlug || null,
        redirectRules: {
          android: urlForm.androidUrl || undefined,
          ios: urlForm.iosUrl || undefined,
          desktop: urlForm.desktopUrl || undefined
        }
      });

      if (!result.success) {
        setMessage(result.message || 'Failed to create URL');
        return;
      }

      setMessage('Short URL created: ' + result.data.shortUrl);
      setUrlForm({ longUrl: '', expiresAt: '', password: '', customSlug: '', androidUrl: '', iosUrl: '', desktopUrl: '' });
      await loadUrls(true);
    } catch (error) {
      console.error(error);
      setMessage(error.message || 'Create URL error');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setUrls([]);
    setMessage('Logged out');
    setShowLanding(true);
    setMode('login');
  };

  return (
    <>
      {showLanding && !user ? (
        <Landing onLoginClick={() => setShowLanding(false)} />
      ) : !user ? (
        <LoginPage
          mode={mode}
          onModeChange={() => setMode((cur) => (cur === 'register' ? 'login' : 'register'))}
          onSubmit={onSubmitAuth}
          form={form}
          onFormChange={(field, value) => setForm((prev) => ({ ...prev, [field]: value }))}
          message={message}
          onBackClick={() => setShowLanding(true)}
        />
      ) : (
        <div className="App">
          <div className="container">
            <div className="card">
              <h1 className="title">URL Shortener Dashboard</h1>
              <p className="subtitle">Everything in one place: smart redirects, expiring links, password security, AI slug suggestions, malware checks, and QR codes.</p>

              <div className="card" style={{ marginBottom: '20px' }}>
                <h2 className="subtitle">Features</h2>
                <ul className="url-list" style={{ color: '#cedfff' }}>
                  <li>✅ Smart device-based redirects (Android / iOS / desktop)</li>
                  <li>✅ Expiring links (set a timeout date/time)</li>
                  <li>✅ Password protected links (must enter password to use)</li>
                  <li>✅ AI-generated slugs (smart unique alias or custom slug)</li>
                  <li>✅ Malware detection (safe / risky block)</li>
                  <li>✅ QR code generation for shareable access</li>
                </ul>
              </div>

              <div className="user-row">
                <div>
                  <h2 className="subtitle">Welcome {user.username}</h2>
                  <p style={{ color: '#8ba8cf', margin: '8px 0 0 0' }}>{user.email}</p>
                </div>
                <button className="secondary" onClick={logout}>Logout</button>
              </div>

              {message && <p className="status">{message}</p>}

              <form onSubmit={onCreateUrl} className="form-group">
                <h3 className="subtitle">Create Short URL</h3>
                <input
                  placeholder="Long URL"
                  value={urlForm.longUrl}
                  onChange={(e) => setUrlForm((prev) => ({ ...prev, longUrl: e.target.value }))}
                  required
                />
                <input
                  placeholder="Custom slug (optional, alphanumeric, - or _)"
                  value={urlForm.customSlug}
                  onChange={(e) => setUrlForm((prev) => ({ ...prev, customSlug: e.target.value }))}
                />
                <input
                  placeholder="Password (optional)"
                  type="password"
                  value={urlForm.password}
                  onChange={(e) => setUrlForm((prev) => ({ ...prev, password: e.target.value }))}
                />
                <label style={{ fontSize: 14, color: '#aab7d6' }}>Device-specific redirect URLs</label>
                <input
                  placeholder="Android URL (optional)"
                  value={urlForm.androidUrl}
                  onChange={(e) => setUrlForm((prev) => ({ ...prev, androidUrl: e.target.value }))}
                />
                <input
                  placeholder="iOS URL (optional)"
                  value={urlForm.iosUrl}
                  onChange={(e) => setUrlForm((prev) => ({ ...prev, iosUrl: e.target.value }))}
                />
                <input
                  placeholder="Desktop URL (optional)"
                  value={urlForm.desktopUrl}
                  onChange={(e) => setUrlForm((prev) => ({ ...prev, desktopUrl: e.target.value }))}
                />
                <input
                  placeholder="Expiration Date (optional)"
                  type="datetime-local"
                  value={urlForm.expiresAt}
                  onChange={(e) => setUrlForm((prev) => ({ ...prev, expiresAt: e.target.value }))}
                />
                <button type="submit">Create</button>
              </form>

              <h3 className="subtitle">Your URLs</h3>
              <ul className="url-list">
                {urls.map((item) => (
                  <li className="url-card" key={item._id}>
                    <a href={item.shortUrl} target="_blank" rel="noreferrer">
                      {item.shortUrl}
                    </a>
                    <p>Original: {item.longUrl}</p>
                    {item.qrCode && <img style={{ maxWidth: 120, marginTop: 8 }} src={item.qrCode} alt="QR code" />}
                    <p>Expires: {item.expiresAt ? new Date(item.expiresAt).toLocaleString() : 'Never'}</p>
                    <p>Password-protected: {item.passwordHash ? 'Yes' : 'No'}</p>
                    <p>Redirect rules: {item.redirectRules && (item.redirectRules.android || item.redirectRules.ios || item.redirectRules.desktop) ? 'yes' : 'none'}</p>
                    <p>Malware status: {item.malwareStatus}</p>
                    <p>Clicks: {item.clicks}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
