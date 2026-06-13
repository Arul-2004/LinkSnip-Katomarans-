import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FiLink, FiBarChart2, FiArrowRight } from 'react-icons/fi';
import { BsQrCode } from 'react-icons/bs';
import { useAuth } from '../context/AuthContext';
import { urlAPI } from '../services/api';
import toast from 'react-hot-toast';

const LandingPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [longUrl, setLongUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [shortenedResult, setShortenedResult] = useState(null);

  const handleQuickShorten = async (e) => {
    e.preventDefault();
    if (!longUrl) {
      toast.error('Please enter a URL to shorten');
      return;
    }

    if (!token) {
      toast.error('Please log in or sign up to shorten URLs');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const res = await urlAPI.create({ originalUrl: longUrl });
      if (res.data?.success) {
        setShortenedResult(res.data.data.url);
        toast.success('URL shortened successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!shortenedResult) return;
    try {
      await navigator.clipboard.writeText(shortenedResult.shortUrl);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
        color: 'white',
        padding: 'var(--space-20) 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 var(--space-6)', display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-12)', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h1 style={{ color: 'white', fontSize: 'var(--font-size-5xl)', fontWeight: 800, lineHeight: 1.1, marginBottom: 'var(--space-6)', maxWidth: '800px' }}>
              Build stronger digital connections
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-10)', maxWidth: '600px' }}>
              Use our premium URL shortener, custom aliases, QR codes, and real-time tracking analytics to optimize your links.
            </p>

            {/* Quick Shortener Panel */}
            <div className="card" style={{ width: '100%', maxWidth: '700px', background: 'white', color: 'var(--color-text-primary)', textAlign: 'left', boxShadow: 'var(--shadow-xl)' }}>
              <h3 style={{ marginBottom: 'var(--space-4)', fontWeight: 700 }}>Shorten a link</h3>
              <form onSubmit={handleQuickShorten} style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Paste your long URL here (e.g. https://example.com/very-long-path)"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  className="form-input"
                  style={{ flex: 1, minWidth: '280px' }}
                />
                <button type="submit" disabled={loading} className="btn btn-blue" style={{ minWidth: '150px' }}>
                  {loading ? 'Shortening...' : 'Get LinkSnip'}
                </button>
              </form>

              {shortenedResult && (
                <div style={{
                  marginTop: 'var(--space-6)',
                  padding: 'var(--space-4)',
                  background: 'var(--color-bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'var(--space-4)',
                  flexWrap: 'wrap',
                  animation: 'fadeIn 0.3s ease'
                }}>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-blue)', fontSize: 'var(--font-size-lg)' }}>
                      {shortenedResult.shortUrl}
                    </div>
                    <div className="truncate" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
                      {shortenedResult.originalUrl}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button onClick={copyToClipboard} className="btn btn-primary btn-sm">Copy</button>
                    <Link to="/login" className="btn btn-outline btn-sm">Track Clicks</Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section style={{ padding: 'var(--space-20) 0', background: 'var(--color-bg-primary)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 var(--space-6)' }}>
          <h2 style={{ textAlign: 'center', fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--space-12)' }}>
            One platform, three powerful features
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-8)' }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ fontSize: '2.5rem', color: 'var(--color-accent)' }}><FiLink /></div>
              <h3 style={{ fontWeight: 700 }}>URL Shortening</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Create clean, memorable shortened URLs. Customize aliases to match your brand or campaign name.
              </p>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ fontSize: '2.5rem', color: 'var(--color-blue)' }}><BsQrCode /></div>
              <h3 style={{ fontWeight: 700 }}>QR Codes</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Generate custom, high-resolution QR codes for every shortened link. Instantly download PNG or SVG formats.
              </p>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ fontSize: '2.5rem', color: 'var(--color-success)' }}><FiBarChart2 /></div>
              <h3 style={{ fontWeight: 700 }}>Link Analytics</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Track visits, location data, browser types, operating systems, and referrers in real time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Action Banner */}
      <section style={{
        background: 'var(--color-primary)',
        color: 'white',
        padding: 'var(--space-16) 0',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 var(--space-6)' }}>
          <h2 style={{ color: 'white', fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--space-4)', fontWeight: 800 }}>
            Start Snipping and Connecting
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-8)', fontSize: 'var(--font-size-base)' }}>
            Join millions of users who trust LinkSnip to manage and optimize their digital connections.
          </p>
          <Link to={token ? "/dashboard/home" : "/register"} className="btn btn-accent btn-lg" style={{ background: 'var(--color-accent)', color: 'white', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            Get Started For Free <FiArrowRight />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
