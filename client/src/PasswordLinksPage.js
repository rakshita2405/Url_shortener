import React, { useState } from 'react';
import './App.css';

function PasswordLinksPage() {
  const [url, setUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url || !slug || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setResult({ url, slug, password });
  };

  return (
    <div className="page-shell page-password">
      <div className="password-split">
        <aside className="password-aside card">
          <span className="page-kicker">Private access</span>
          <h1 className="page-title">Password links</h1>
          <p className="page-lead">
            Gate the destination behind a secret phrase. Share the short URL publicly and the password only with trusted people.
          </p>
          <ul className="password-bullets">
            <li>Server verifies password before redirect</li>
            <li>Ideal for docs, decks, and beta invites</li>
            <li>Rotate password anytime from your dashboard</li>
          </ul>
        </aside>

        <section className="card page-panel password-main">
          <div className="password-lock-row">
            <span className="password-lock-icon" aria-hidden>🔐</span>
            <h2 className="page-panel-title">Create protected link</h2>
          </div>
          <form className="feature-form" onSubmit={handleSubmit}>
            <label>
              Destination URL
              <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
            </label>
            <label>
              Custom slug
              <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. secret-link" />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </label>
            <button type="submit">Generate password link</button>
          </form>
          {error && <div className="form-error">{error}</div>}
          {result && (
            <div className="feature-result password-result">
              <h3 className="page-result-title">Preview</h3>
              <p>
                Short URL: <span className="slug-preview">https://yourshort.url/{result.slug}</span>
              </p>
              <ul>
                <li><strong>Destination</strong> {result.url}</li>
                <li>
                  <strong>Password</strong>{' '}
                  <span className="password-preview">{result.password}</span>
                </li>
              </ul>
              <p className="note">Visitors see an unlock screen before the redirect.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default PasswordLinksPage;
