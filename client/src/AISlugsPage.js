import React, { useState } from 'react';
import './App.css';

function AISlugsPage() {
  const [url, setUrl] = useState('');
  const [suggestedSlug, setSuggestedSlug] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSuggest = (e) => {
    e.preventDefault();
    if (!url) {
      setError('Please enter a destination URL.');
      return;
    }
    setError('');
    setSuggestedSlug('ai-' + Math.random().toString(36).substring(2, 8));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url || !(customSlug || suggestedSlug)) {
      setError('Please enter a URL and choose a slug.');
      return;
    }
    setError('');
    setResult({ url, slug: customSlug || suggestedSlug });
  };

  return (
    <div className="page-shell page-ai">
      <header className="page-hero-ai">
        <div className="page-hero-ai-inner">
          <span className="page-kicker ai-kicker">Suggestions</span>
          <h1 className="page-title">AI slugs</h1>
          <p className="page-lead">
            Get memorable, brand-safe aliases from your destination URL—or type your own. Production builds plug in a real model on the server.
          </p>
        </div>
      </header>

      <section className="card page-panel ai-panel">
        <form className="feature-form ai-suggest-form" onSubmit={handleSuggest}>
          <label className="ai-url-field">
            Destination URL
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://your-site.com/campaign" />
          </label>
          <button type="submit" className="ai-glow-btn">Suggest slug</button>
        </form>

        {suggestedSlug && (
          <div className="ai-chip-row">
            <span className="ai-chip-label">Suggestion</span>
            <code className="ai-chip-code">{suggestedSlug}</code>
          </div>
        )}

        <form className="feature-form" onSubmit={handleSubmit}>
          <label>
            Use suggestion or custom slug
            <input
              type="text"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              placeholder={suggestedSlug || 'my-brand-link'}
            />
          </label>
          <button type="submit">Create link</button>
        </form>
        {error && <div className="form-error">{error}</div>}
        {result && (
          <div className="feature-result ai-result">
            <h3 className="page-result-title">Preview</h3>
            <p>
              Short URL: <span className="slug-preview">https://yourshort.url/{result.slug}</span>
            </p>
            <ul>
              <li><strong>Destination</strong> {result.url}</li>
              <li><strong>Slug</strong> {result.slug}</li>
            </ul>
            <p className="note">Demo uses random tokens; wire your model in the API.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default AISlugsPage;
