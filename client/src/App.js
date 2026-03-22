import { useCallback, useEffect, useState } from 'react';
import {
  register,
  login,
  getProfile
} from './services/api';
import Landing from './Landing';
import LoginPage from './LoginPage';
import Navbar from './Navbar';
import SmartRedirectsPage from './SmartRedirectsPage';
import ExpiringLinksPage from './ExpiringLinksPage';
import PasswordLinksPage from './PasswordLinksPage';
import AISlugsPage from './AISlugsPage';
import MalwareDetectionPage from './MalwareDetectionPage';
import QRCodePage from './QRCodePage';
import Profile from './Profile';
import './App.css';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [mode, setMode] = useState('login');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ username: '', email: '', identifier: '', password: '' });

  const fetchProfile = useCallback(async () => {
    const result = await getProfile();
    if (result.success) {
      setUser(result.data.user);
      setMessage('Logged in as ' + result.data.user.username);
      setShowLanding(false);
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
      setPage('smart');
      await fetchProfile();
    } catch (error) {
      console.error(error);
      setMessage('Auth error');
    }
  };

  const [page, setPage] = useState('smart');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setMessage('Logged out');
    setShowLanding(true);
    setMode('login');
  };

  const handleProfile = () => {
    setShowLanding(false);
    setPage('profile');
  };

  const handleUserUpdate = (updated) => {
    setUser(updated);
  };

  const handleAccountDeleted = () => {
    localStorage.removeItem('token');
    setUser(null);
    setMessage('Account deleted');
    setShowLanding(true);
    setMode('login');
  };

  return (
    <>
      {showLanding ? (
        <Landing
          onLoginClick={() => setShowLanding(false)}
          user={user}
          onProfile={handleProfile}
          onLogout={handleLogout}
        />
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
        <div className="App app-logged-in">
          <Navbar
            current={page}
            onNavigate={setPage}
            user={user}
            onLogout={handleLogout}
          />
          <main className="app-main">
            <div className="container app-main-inner">
              {page === 'smart' && <SmartRedirectsPage />}
              {page === 'expiring' && <ExpiringLinksPage />}
              {page === 'password' && <PasswordLinksPage />}
              {page === 'ai' && <AISlugsPage />}
              {page === 'malware' && <MalwareDetectionPage />}
              {page === 'qr' && <QRCodePage />}
              {page === 'profile' && (
                <Profile
                  user={user}
                  onUserUpdate={handleUserUpdate}
                  onLogout={handleLogout}
                  onAccountDeleted={handleAccountDeleted}
                />
              )}
            </div>
          </main>
        </div>
      )}
    </>
  );
}

export default App;
