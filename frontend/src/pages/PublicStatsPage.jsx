import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { publicAPI } from '../services/api';
import { FiLink, FiBarChart2, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';

const PublicStatsPage = () => {
  const { shortCode } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublicStats = async () => {
      try {
        const res = await publicAPI.getStats(shortCode);
        if (res.data?.success) {
          setStats(res.data.data);
        } else {
          setError('Could not retrieve stats for this link.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load link statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicStats();
  }, [shortCode]);

  const formattedDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMMM dd, yyyy');
    } catch {
      return 'N/A';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ flex: 1, padding: 'var(--space-16) 0', background: 'var(--color-bg-primary)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 var(--space-6)' }}>
          {loading ? (
            <LoadingSpinner size="lg" />
          ) : error ? (
            <div className="card text-center" style={{ padding: 'var(--space-10)' }}>
              <h2 style={{ color: 'var(--color-error)', marginBottom: 'var(--space-4)' }}>Error</h2>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>{error}</p>
              <Link to="/" className="btn btn-primary">Go to Homepage</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)', color: 'white' }}>
                <h1 style={{ color: 'white', fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
                  Public Link Stats
                </h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                  Statistics for short code: <strong style={{ color: 'var(--color-accent)' }}>{shortCode}</strong>
                </p>
              </div>

              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                  <div style={{ fontSize: '2rem', color: 'var(--color-blue)', background: 'var(--color-bg-secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                    <FiLink />
                  </div>
                  <div style={{ overflow: 'hidden', flex: 1 }}>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
                      Destination URL
                    </div>
                    <a href={stats.originalUrl} target="_blank" rel="noopener noreferrer" className="truncate" style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, display: 'block', color: 'var(--color-text-primary)' }}>
                      {stats.originalUrl}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)' }}>
                  <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-1)' }}>
                      <FiBarChart2 />
                      Total Clicks
                    </div>
                    <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                      {stats.totalClicks}
                    </div>
                  </div>

                  <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-1)' }}>
                      <FiCalendar />
                      Created On
                    </div>
                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-text-primary)', marginTop: '6px' }}>
                      {formattedDate(stats.createdAt)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card text-center" style={{ background: 'white' }}>
                <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-2)' }}>Want detailed analytics?</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-6)' }}>
                  Sign up for a free account to track referrers, devices, operating systems, browsers, and detailed geolocation stats.
                </p>
                <Link to="/register" className="btn btn-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  Create Free Account <FiArrowRight />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PublicStatsPage;
