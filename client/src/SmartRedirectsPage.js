import React, { useState } from 'react';
import './App.css';

function SmartRedirectsPage() {
  const [androidUrl, setAndroidUrl] = useState('');
  const [iosUrl, setIosUrl] = useState('');
  const [desktopUrl, setDesktopUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!androidUrl || !iosUrl || !desktopUrl || !slug) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setResult({ slug, androidUrl, iosUrl, desktopUrl });
  };

  return (
    <div className="page-shell page-smart">
      <header className="page-hero page-hero-smart">
        <span className="page-kicker">Device routing</span>
        <h1 className="page-title">Smart redirects</h1>
        <p className="page-lead">
          One short link that sends Android, iOS, and desktop visitors to the right destination—ideal for app stores and web fallback.
        </p>
      </header>

      <div className="smart-bento">
        <div className="smart-bento-card">
          <span className="smart-bento-icon" aria-hidden>🤖</span>
          <h3>Android</h3>
          <p>Play Store or deep link</p>
        </div>
        <div className="smart-bento-card">
          <span className="smart-bento-icon" aria-hidden>🍎</span>
          <h3>iOS</h3>
          <p>App Store or universal link</p>
        </div>
        <div className="smart-bento-card">
          <span className="smart-bento-icon" aria-hidden>🖥</span>
          <h3>Desktop</h3>
          <p>Marketing site or web app</p>
        </div>
      </div>

      <section className="card page-panel">
        <h2 className="page-panel-title">Configure link</h2>
        <form className="feature-form smart-form-grid" onSubmit={handleSubmit}>
          <label className="smart-field-span">
            Custom slug
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. myapp" />
          </label>
          <label>
            Android URL
            <input type="url" value={androidUrl} onChange={(e) => setAndroidUrl(e.target.value)} placeholder="https://play.google.com/..." />
          </label>
          <label>
            iOS URL
            <input type="url" value={iosUrl} onChange={(e) => setIosUrl(e.target.value)} placeholder="https://apps.apple.com/..." />
          </label>
          <label className="smart-field-span">
            Desktop URL
            <input type="url" value={desktopUrl} onChange={(e) => setDesktopUrl(e.target.value)} placeholder="https://yoursite.com" />
          </label>
          <div className="smart-field-span">
            <button type="submit">Generate smart link</button>
          </div>
        </form>
        {error && <div className="form-error">{error}</div>}
        {result && (
          <div className="feature-result smart-result">
            <h3 className="page-result-title">Preview</h3>
            <p>
              Short URL:{' '}
              <span className="slug-preview">https://yourshort.url/{result.slug}</span>
            </p>
            <ul className="smart-result-list">
              <li><strong>Android</strong> {result.androidUrl}</li>
              <li><strong>iOS</strong> {result.iosUrl}</li>
              <li><strong>Desktop</strong> {result.desktopUrl}</li>
            </ul>
            <p className="note">Redirection is enforced by the server when you create a real link.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default SmartRedirectsPage;
