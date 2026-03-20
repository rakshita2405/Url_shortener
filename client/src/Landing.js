import { useEffect, useRef, useState } from 'react';
import './Landing.css';

function Landing({ onLoginClick }) {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const stats = [
    { value: '10M+', label: 'Links Created', change: '+245%' },
    { value: '500M+', label: 'Clicks Tracked', change: '+156%' },
    { value: '150K+', label: 'Active Users', change: '+89%' },
    { value: '99.9%', label: 'Uptime', change: 'Verified' }
  ];

  // Particle system setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let ctx;
    try {
      ctx = canvas.getContext('2d');
    } catch (e) {
      return;
    }
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 40;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.3 + 0.1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw(ctx) {
        ctx.fillStyle = `hsla(210, 70%, 60%, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.update();
        particle.draw(ctx);
      });
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="premium-landing">
      <canvas ref={canvasRef} className="bg-canvas"></canvas>
      
      <div className="cursor-dot" style={{
        left: mousePos.x + 'px',
        top: mousePos.y + 'px'
      }}></div>

      {/* Navigation */}
      <nav className="premium-nav">
        <div className="nav-content">
          <div className="nav-brand">⚡ LinkVault</div>
          <div className="nav-menu">
            <a href="#features">Features</a>
            <a href="#benefits">Benefits</a>
            <a href="#pricing">Pricing</a>
            <button className="nav-btn" onClick={onLoginClick}>Login</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-premium">
        <div className="hero-content-premium">
          <div className="hero-badge">✨ The Future of URL Shortening</div>
          <h1 className="hero-title-premium">
            Links That<br />
            <span className="gradient-title">Perform. Secure. Scale.</span>
          </h1>
          <p className="hero-desc">
            Enterprise-grade URL shortening with AI-powered insights, real-time analytics, and military-grade security. Perfect for teams that demand more.
          </p>
          <button className="cta-primary" onClick={onLoginClick}>
            Start Free Trial
            <span className="arrow">→</span>
          </button>
          <p className="hero-subtext">No credit card required • 14-day free access</p>
        </div>

        {/* Dashboard Preview Card */}
        <div className="dashboard-preview">
          <div className="preview-header">
            <div className="preview-title">Real-time Dashboard</div>
            <div className="preview-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="preview-content">
            <div className="mini-chart">
              <div className="chart-bar" style={{height: '40%'}}></div>
              <div className="chart-bar" style={{height: '70%'}}></div>
              <div className="chart-bar" style={{height: '55%'}}></div>
              <div className="chart-bar" style={{height: '85%'}}></div>
              <div className="chart-bar" style={{height: '60%'}}></div>
              <div className="chart-bar" style={{height: '90%'}}></div>
            </div>
            <div className="preview-stats">
              <div className="stat-mini">
                <span className="value">2.4K</span>
                <span className="label">Clicks/min</span>
              </div>
              <div className="stat-mini">
                <span className="value">98%</span>
                <span className="label">CTR</span>
              </div>
              <div className="stat-mini">
                <span className="value">1.2s</span>
                <span className="label">Avg. Load</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <section className="live-stats">
        <div className="stats-container">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-card">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-change">
                <span className="change-icon">📈</span>
                {stat.change}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="premium-features">
        <div className="section-header">
          <h2>Powerful Features Built for Growth</h2>
          <p>Everything you need to create, track, and optimize your links at scale</p>
        </div>

        <div className="features-showcase">
          <div className="feature-box feature-primary">
            <div className="feature-icon">🎯</div>
            <h3>Smart Redirects</h3>
            <p>Device-aware routing sends users to the perfect experience every time.</p>
            <div className="feature-badge">AI-Powered</div>
          </div>

          <div className="feature-box">
            <div className="feature-icon">🔐</div>
            <h3>Security First</h3>
            <p>Military-grade encryption and malware detection at enterprise scale.</p>
          </div>

          <div className="feature-box">
            <div className="feature-icon">📊</div>
            <h3>Real-time Analytics</h3>
            <p>Track every click, device, location, and user behavior instantly.</p>
          </div>

          <div className="feature-box">
            <div className="feature-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>Global CDN ensures your links load in under 100ms, anywhere on Earth.</p>
          </div>

          <div className="feature-box">
            <div className="feature-icon">🎨</div>
            <h3>Custom Branding</h3>
            <p>Use your own domain, logos, and colors to maintain brand consistency.</p>
          </div>

          <div className="feature-box">
            <div className="feature-icon">📱</div>
            <h3>QR Codes</h3>
            <p>Auto-generated QR codes for every link with instant tracking integration.</p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="benefits-section">
        <h2>Why LinkVault Wins</h2>
        
        <div className="benefits-grid">
          <div className="benefit-item">
            <div className="benefit-number">01</div>
            <h4>Trust & Security</h4>
            <p>ISO 27001 certified, GDPR compliant, with 24/7 security monitoring. Your data is always protected.</p>
          </div>

          <div className="benefit-item">
            <div className="benefit-number">02</div>
            <h4>Enterprise Scale</h4>
            <p>Handle millions of requests per second with 99.9% uptime SLA and automatic failover.</p>
          </div>

          <div className="benefit-item">
            <div className="benefit-number">03</div>
            <h4>Smart Analytics</h4>
            <p>AI-powered insights reveal patterns you never knew existed in your user behavior.</p>
          </div>

          <div className="benefit-item">
            <div className="benefit-number">04</div>
            <h4>API-First Design</h4>
            <p>Powerful REST API with comprehensive documentation and SDKs for every platform.</p>
          </div>

          <div className="benefit-item">
            <div className="benefit-number">05</div>
            <h4>Team Collaboration</h4>
            <p>Invite team members, set permissions, and track changes with full audit logs.</p>
          </div>

          <div className="benefit-item">
            <div className="benefit-number">06</div>
            <h4>24/7 Support</h4>
            <p>Expert support team ready to help via chat, email, or phone whenever you need it.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-premium">
        <div className="cta-content">
          <h2>Ready to go premium?</h2>
          <p>Join 150K+ teams who trust LinkVault to power their growth</p>
          <div className="cta-buttons">
            <button className="btn-primary-large" onClick={onLoginClick}>
              Start Your Free Trial
              <span className="arrow">→</span>
            </button>
            <button className="btn-secondary">See Pricing</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="premium-footer">
        <div className="footer-content">
          <p>&copy; 2026 LinkVault. Building the future of link management.</p>
          <div className="footer-links">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#security">Security</a>
            <a href="#status">Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
