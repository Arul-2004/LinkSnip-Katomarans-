import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" style={{ background: 'var(--color-bg-dark)', color: 'var(--color-text-light)', padding: 'var(--space-16) 0 var(--space-8)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 var(--space-6)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-8)' }}>
        <div>
          <h3 style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-xl)' }}>LinkSnip</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
            Replicating the premium url shortener experience with custom aliases, custom QR codes, and advanced analytics.
          </p>
        </div>

        <div>
          <h4 style={{ color: 'white', marginBottom: 'var(--space-4)' }}>Platform</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <li><Link to="/features" style={{ color: 'var(--color-text-muted)' }}>URL Shortener</Link></li>
            <li><Link to="/features" style={{ color: 'var(--color-text-muted)' }}>QR Codes</Link></li>
            <li><Link to="/features" style={{ color: 'var(--color-text-muted)' }}>Analytics</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'white', marginBottom: 'var(--space-4)' }}>Company</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <li><Link to="/features" style={{ color: 'var(--color-text-muted)' }}>About Us</Link></li>
            <li><Link to="/features" style={{ color: 'var(--color-text-muted)' }}>Careers</Link></li>
            <li><Link to="/features" style={{ color: 'var(--color-text-muted)' }}>Partners</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'white', marginBottom: 'var(--space-4)' }}>Resources</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <li><Link to="/features" style={{ color: 'var(--color-text-muted)' }}>Blog</Link></li>
            <li><Link to="/features" style={{ color: 'var(--color-text-muted)' }}>Developers</Link></li>
            <li><Link to="/features" style={{ color: 'var(--color-text-muted)' }}>Support</Link></li>
          </ul>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: 'var(--space-12) auto 0', padding: 'var(--space-6) var(--space-6) 0', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexWrap: 'wrap', justifyContent: 'between', alignItems: 'center', gap: 'var(--space-4)' }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
          &copy; {currentYear} LinkSnip Inc. All rights reserved. Made for hackathon URL Shortener.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          <Link to="/" style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>Privacy Policy</Link>
          <Link to="/" style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
