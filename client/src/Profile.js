import React, { useState, useRef, useEffect } from 'react';
import { updateProfile, deleteAccount } from './services/api';
import './App.css';

const AVATAR_MAX_BYTES = 400 * 1024;

function Profile({ user, onUserUpdate, onLogout, onAccountDeleted }) {
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [showDelete, setShowDelete] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);

  const fileRef = useRef(null);

  useEffect(() => {
    if (!editing && user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user, editing]);

  if (!user) return null;

  const displayAvatar = user.avatarUrl;
  const initial = user.username?.charAt(0)?.toUpperCase() || '?';

  const resetForm = () => {
    setUsername(user.username);
    setEmail(user.email);
    setCurrentPassword('');
    setNewPassword('');
    setError('');
    setMessage('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    const payload = { username: username.trim(), email: email.trim() };
    if (newPassword) {
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
    }
    const result = await updateProfile(payload);
    setSaving(false);
    if (!result.success) {
      setError(result.message || 'Could not update profile');
      return;
    }
    onUserUpdate(result.data.user);
    setMessage('Profile saved.');
    setCurrentPassword('');
    setNewPassword('');
    setEditing(false);
  };

  const onPickPhoto = () => fileRef.current?.click();

  const onFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > AVATAR_MAX_BYTES) {
      setError('Image must be under 400KB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result;
      setSaving(true);
      setError('');
      const result = await updateProfile({ avatarUrl: dataUrl });
      setSaving(false);
      if (!result.success) {
        setError(result.message || 'Could not upload photo');
        return;
      }
      onUserUpdate(result.data.user);
      setMessage('Photo updated.');
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = async () => {
    setSaving(true);
    setError('');
    const result = await updateProfile({ avatarUrl: '' });
    setSaving(false);
    if (!result.success) {
      setError(result.message || 'Could not remove photo');
      return;
    }
    onUserUpdate(result.data.user);
    setMessage('Photo removed.');
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleting(true);
    setError('');
    const result = await deleteAccount(deletePassword);
    setDeleting(false);
    if (!result.success) {
      setError(result.message || 'Could not delete account');
      return;
    }
    setShowDelete(false);
    onAccountDeleted();
  };

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '—';

  return (
    <div className="profile-page">
      <div className="profile-hero card profile-card-accent">
        <div className="profile-hero-main">
          <div className="profile-avatar-wrap">
            {displayAvatar ? (
              <img src={displayAvatar} alt="" className="profile-avatar-lg" />
            ) : (
              <div className="profile-avatar-placeholder">{initial}</div>
            )}
            {saving && <span className="profile-saving">Saving…</span>}
          </div>
          <div className="profile-hero-text">
            <h1 className="profile-name">{user.username}</h1>
            <p className="profile-email-line">{user.email}</p>
            <p className="profile-meta">Member since {memberSince}</p>
          </div>
        </div>
        <div className="profile-photo-actions">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="visually-hidden"
            onChange={onFile}
            aria-hidden
          />
          <button type="button" className="secondary" onClick={onPickPhoto} disabled={saving}>
            Add / change photo
          </button>
          {displayAvatar ? (
            <button type="button" className="secondary danger-outline" onClick={removePhoto} disabled={saving}>
              Remove photo
            </button>
          ) : null}
        </div>
      </div>

      {(message || error) && (
        <div className={`profile-banner ${error ? 'profile-banner-error' : 'profile-banner-ok'}`}>
          {error || message}
        </div>
      )}

      <section className="card profile-section">
        <div className="profile-section-head">
          <h2 className="subtitle profile-section-title">Account details</h2>
          {!editing ? (
            <button type="button" className="secondary" onClick={() => { setEditing(true); resetForm(); }}>
              Edit profile
            </button>
          ) : (
            <div className="profile-inline-actions">
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  setEditing(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {!editing ? (
          <dl className="profile-dl">
            <div>
              <dt>Username</dt>
              <dd>{user.username}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
          </dl>
        ) : (
          <form className="profile-form" onSubmit={handleSave}>
            <label className="profile-label">
              Username
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                minLength={3}
                maxLength={50}
                required
              />
            </label>
            <label className="profile-label">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <div className="profile-password-block">
              <p className="profile-hint">Change password (optional)</p>
              <label className="profile-label">
                Current password
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Required if setting a new password"
                />
              </label>
              <label className="profile-label">
                New password
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Leave blank to keep current"
                  minLength={6}
                />
              </label>
            </div>
            <button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        )}
      </section>

      <section className="card profile-section profile-danger-zone">
        <h2 className="subtitle profile-section-title">Session</h2>
        <p className="profile-hint">Sign out on this device. You can sign in again anytime.</p>
        <button type="button" className="secondary" onClick={onLogout}>
          Log out
        </button>
      </section>

      <section className="card profile-section profile-danger-zone">
        <h2 className="subtitle profile-section-title">Delete account</h2>
        <p className="profile-hint">
          Permanently delete your account and associated short links. This cannot be undone.
        </p>
        {!showDelete ? (
          <button type="button" className="danger-btn" onClick={() => { setShowDelete(true); setDeletePassword(''); setError(''); }}>
            Delete account…
          </button>
        ) : (
          <form className="profile-delete-form" onSubmit={handleDeleteAccount}>
            <label className="profile-label">
              Enter your password to confirm
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </label>
            <div className="profile-inline-actions">
              <button type="submit" className="danger-btn" disabled={deleting}>
                {deleting ? 'Deleting…' : 'Yes, delete my account'}
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  setShowDelete(false);
                  setDeletePassword('');
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

export default Profile;
