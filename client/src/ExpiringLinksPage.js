import React, { useState } from 'react';
import './App.css';

function ExpiringLinksPage() {
  const [url, setUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [expiry, setExpiry] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url || !slug || !expiry) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setResult({ url, slug, expiry });
  };

  return (
    <div className="page-shell page-expiring">
      <header className="page-hero page-hero-expiring">
        <span className="page-kicker">Time-bound access</span>
        <h1 className="page-title">Expiring links</h1>
        <p className="page-lead">
          Share URLs that automatically stop working after a date—perfect for flash sales, invites, and sensitive drops.
        </p>
      </header>

      <div className="expiring-timeline">
        <div className="expiring-step">
          <span className="expiring-dot" />
          <div>
            <strong>Create</strong>
            <p>Pick destination and slug</p>
          </div>
        </div>
        <div className="expiring-step">
          <span className="expiring-dot" />
          <div>
            <strong>Schedule</strong>
            <p>Set expiry date &amp; time</p>
          </div>
        </div>
        <div className="expiring-step">
          <span className="expiring-dot expiring-dot-end" />
          <div>
            <strong>Expire</strong>
            <p>Link returns gone after cutoff</p>
          </div>
        </div>
      </div>

      <section className="card page-panel expiring-panel">
        <div className="expiring-panel-head">
          <h2 className="page-panel-title">New expiring link</h2>
          <span className="expiring-badge">ISO-local time</span>
        </div>
        <form className="feature-form" onSubmit={handleSubmit}>
          <label>
            Destination URL
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
          </label>
          <label>
            Custom slug
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. promo2024" />
          </label>
          <label className="expiring-datetime">
            <span className="expiring-datetime-label">Expires</span>
            <input type="datetime-local" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
          </label>
          <button type="submit">Generate expiring link</button>
        </form>
        {error && <div className="form-error">{error}</div>}
        {result && (
          <div className="feature-result expiring-result">
            <h3 className="page-result-title">Preview</h3>
            <p>
              Short URL: <span className="slug-preview">https://yourshort.url/{result.slug}</span>
            </p>
            <ul>
              <li><strong>Destination</strong> {result.url}</li>
              <li><strong>Expires</strong> {new Date(result.expiry).toLocaleString()}</li>
            </ul>
            <p className="note">After expiry, visitors see your configured fallback or 410 Gone.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default ExpiringLinksPage;
