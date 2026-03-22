import React, { useState } from 'react';
import './App.css';

function QRCodePage() {
  const [url, setUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url || !slug) {
      setError('Please enter a destination URL and slug.');
      return;
    }
    setError('');
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(`https://yourshort.url/${slug}`)}`);
  };

  return (
    <div className="page-shell page-qr">
      <header className="page-hero page-hero-qr">
        <span className="page-kicker">Print &amp; share</span>
        <h1 className="page-title">QR codes</h1>
        <p className="page-lead">
          Turn any short link into a scannable code for posters, packaging, and slides—vector-friendly in production.
        </p>
      </header>

      <div className="qr-layout">
        <section className="card page-panel qr-form-panel">
          <h2 className="page-panel-title">Build code</h2>
          <form className="feature-form" onSubmit={handleSubmit}>
            <label>
              Destination URL
              <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
            </label>
            <label>
              Slug
              <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. event2024" />
            </label>
            <button type="submit">Generate QR</button>
          </form>
          {error && <div className="form-error">{error}</div>}
        </section>

        <aside className="card qr-preview-panel">
          {qrUrl ? (
            <>
              <div className="qr-frame">
                <img src={qrUrl} alt={`QR for ${slug}`} className="qr-image-lg" />
              </div>
              <p className="qr-slug-label">
                Encodes <span className="slug-preview">yourshort.url/{slug}</span>
              </p>
              <a href={qrUrl} download={`qr-${slug}.png`} className="download-link qr-download">
                Download PNG
              </a>
              <p className="note">SVG export and brand colors ship in the full product.</p>
            </>
          ) : (
            <div className="qr-placeholder">
              <span className="qr-placeholder-icon" aria-hidden>▦</span>
              <p>Your QR preview appears here</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default QRCodePage;
