import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsAPI, urlAPI } from '../../services/api';
import StatsCard from '../../components/StatsCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import CopyButton from '../../components/CopyButton';
import { FiLink, FiBarChart2, FiCalendar, FiPlusCircle, FiCopy, FiExternalLink } from 'react-icons/fi';
import toast from 'react-hot-toast';

const DashboardHome = () => {
  const [summary, setSummary] = useState(null);
  const [recentUrls, setRecentUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Quick Create Form
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [title, setTitle] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [summaryRes, urlsRes] = await Promise.all([
        analyticsAPI.getDashboardSummary(),
        urlAPI.getAll({ page: 1, limit: 5 })
      ]);

      if (summaryRes.data?.success) {
        setSummary(summaryRes.data.data);
      }
      if (urlsRes.data?.success) {
        setRecentUrls(urlsRes.data.data.urls);
      }
    } catch (err) {
      console.error('Error fetching dashboard home data:', err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleQuickCreate = async (e) => {
    e.preventDefault();
    if (!longUrl) {
      toast.error('Please enter a destination URL');
      return;
    }

    setCreateLoading(true);
    try {
      const res = await urlAPI.create({
        originalUrl: longUrl,
        customAlias: customAlias || undefined,
        title: title || undefined
      });

      if (res.data?.success) {
        toast.success('Short link created!');
        setLongUrl('');
        setCustomAlias('');
        setTitle('');
        fetchData(); // Refresh summary and list
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create short link');
    } finally {
      setCreateLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800 }}>Dashboard</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            Welcome back! Here is a summary of your link performance.
          </p>
        </div>
      </div>

      {/* Aggregate Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-6)' }}>
        <StatsCard
          title="Total Links"
          value={summary?.totalUrls || 0}
          icon={<FiLink />}
          color="blue"
        />
        <StatsCard
          title="Total Clicks"
          value={summary?.totalClicks || 0}
          icon={<FiBarChart2 />}
          color="orange"
        />
        <StatsCard
          title="Links Created Today"
          value={summary?.createdToday || 0}
          icon={<FiCalendar />}
          color="green"
        />
      </div>

      {/* Main Grid: Quick Create & Recent Links */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: 'var(--space-6)', alignItems: 'start' }} className="grid-2">
        
        {/* Quick Create Widget */}
        <div className="card">
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
            Quick Create Link
          </h2>
          <form onSubmit={handleQuickCreate} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Destination URL</label>
              <input
                type="text"
                placeholder="https://example.com/long-original-url"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Title (Optional)</label>
              <input
                type="text"
                placeholder="My website homepage"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Custom Alias (Optional)</label>
              <input
                type="text"
                placeholder="custom-short-slug"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                className="form-input"
              />
              <span className="form-helper">Letters, numbers, dashes, underscores only.</span>
            </div>

            <button type="submit" disabled={createLoading} className="btn btn-primary btn-full">
              {createLoading ? 'Creating...' : 'Shorten Link'}
            </button>
          </form>
        </div>

        {/* Recent Links Table */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>
              Recent Links
            </h2>
            <Link to="/dashboard/links" style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-blue)' }}>
              View all
            </Link>
          </div>

          {recentUrls.length === 0 ? (
            <EmptyState
              title="No links created yet"
              message="Shorten your first destination URL using the creator widget."
              actionText="Create Link"
              actionLink="/dashboard/create"
            />
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Short Link</th>
                    <th>Destination</th>
                    <th style={{ textAlign: 'center' }}>Clicks</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUrls.map((url) => (
                    <tr key={url.id || url._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <a href={url.shortUrl} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>
                            {url.shortCode}
                          </a>
                          <CopyButton text={url.shortUrl} className="btn-sm" />
                        </div>
                      </td>
                      <td style={{ maxWidth: '200px' }} className="truncate">
                        {url.originalUrl}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700 }}>
                        {url.totalClicks}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Link to={`/dashboard/links/${url.id || url._id}`} className="btn btn-outline btn-sm">
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
