import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { urlAPI, analyticsAPI } from '../../services/api';
import ClickChart from '../../components/ClickChart';
import LoadingSpinner from '../../components/LoadingSpinner';
import QRCodeDisplay from '../../components/QRCodeDisplay';
import ConfirmDialog from '../../components/ConfirmDialog';
import { FiLink, FiCalendar, FiClock, FiEdit3, FiTrash2, FiArrowLeft, FiActivity, FiGlobe } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

const LinkDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [url, setUrl] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit Link Form State
  const [isEditing, setIsEditing] = useState(false);
  const [originalUrl, setOriginalUrl] = useState('');
  const [title, setTitle] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const fetchDetails = async () => {
    try {
      const [urlRes, analyticsRes] = await Promise.all([
        urlAPI.getOne(id),
        analyticsAPI.getUrlAnalytics(id)
      ]);

      if (urlRes.data?.success) {
        setUrl(urlRes.data.data.url);
        // Sync edit form states
        setOriginalUrl(urlRes.data.data.url.originalUrl);
        setTitle(urlRes.data.data.url.title || '');
        if (urlRes.data.data.url.expiresAt) {
          setExpiresAt(urlRes.data.data.url.expiresAt.substring(0, 10)); // YYYY-MM-DD
        } else {
          setExpiresAt('');
        }
      }

      if (analyticsRes.data?.success) {
        setAnalytics(analyticsRes.data.data);
      }
    } catch (err) {
      console.error('Error loading link details:', err);
      toast.error('Failed to load link details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!originalUrl) {
      toast.error('Destination URL is required');
      return;
    }

    setEditLoading(true);
    try {
      const res = await urlAPI.update(id, {
        originalUrl,
        title,
        expiresAt: expiresAt || null
      });

      if (res.data?.success) {
        toast.success('Link updated successfully');
        setIsEditing(false);
        fetchDetails();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update link');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await urlAPI.delete(id);
      if (res.data?.success) {
        toast.success('Link deleted successfully');
        navigate('/dashboard/links');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete link');
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (!url) {
    return (
      <div className="card text-center" style={{ padding: 'var(--space-12)' }}>
        <h2>Link not found</h2>
        <p style={{ margin: 'var(--space-4) 0' }}>The link you are trying to view does not exist or you do not have permission to view it.</p>
        <Link to="/dashboard/links" className="btn btn-primary">Back to Links</Link>
      </div>
    );
  }

  const formattedDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return 'N/A';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header with back button */}
      <div>
        <Link to="/dashboard/links" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
          <FiArrowLeft /> Back to Links
        </Link>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800 }}>{url.title || url.shortCode}</h1>
            <a href={url.shortUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: 'var(--color-blue)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              {url.shortUrl.replace(/^https?:\/\//, '')}
            </a>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button onClick={() => setIsEditing(!isEditing)} className="btn btn-outline" style={{ gap: 'var(--space-2)' }}>
              <FiEdit3 /> {isEditing ? 'Cancel Edit' : 'Edit Link'}
            </button>
            <button onClick={() => setIsDeleteDialogOpen(true)} className="btn btn-danger" style={{ gap: 'var(--space-2)' }}>
              <FiTrash2 /> Delete
            </button>
          </div>
        </div>
      </div>

      {/* Toggle View: Edit Form vs Analytics Dashboard */}
      {isEditing ? (
        <div className="card">
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>Edit Short Link</h2>
          <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: '600px' }}>
            <div className="form-group">
              <label className="form-label">Destination URL</label>
              <input
                type="text"
                placeholder="https://example.com/long-original-url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Expiry Date (Optional)</label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="form-input"
              />
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
              <button type="submit" disabled={editLoading} className="btn btn-primary">
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="btn btn-outline">
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {/* Analytics Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <div style={{ fontSize: '1.5rem', color: 'var(--color-blue)', background: 'var(--color-bg-secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                <FiActivity />
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>{url.totalClicks}</div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', fontWeight: 600 }}>TOTAL CLICKS</div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <div style={{ fontSize: '1.5rem', color: 'var(--color-accent)', background: 'var(--color-bg-secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                <FiCalendar />
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 700 }}>{formattedDate(url.createdAt)}</div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', fontWeight: 600 }}>CREATED ON</div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <div style={{ fontSize: '1.5rem', color: 'var(--color-success)', background: 'var(--color-bg-secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                <FiClock />
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700 }}>
                  {url.expiresAt ? formattedDate(url.expiresAt) : 'Never'}
                </div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', fontWeight: 600 }}>EXPIRATION DATE</div>
              </div>
            </div>
          </div>

          {/* Grid Layout: Chart vs QR Code */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)' }} className="grid-2">
            
            {/* Click Trend Chart */}
            <div className="card">
              <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Click Trend</h2>
              <ClickChart data={analytics?.clicksOverTime || []} />
            </div>

            {/* QR Code */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-4)', textAlign: 'center' }}>QR Code</h2>
              <QRCodeDisplay value={url.shortUrl} title={url.title || url.shortCode} />
            </div>
          </div>

          {/* Breakdown Tables (Referrers, Browser, Country, OS) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }} className="grid-2">
            
            {/* Referrers */}
            <div className="card">
              <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Top Referrers</h2>
              {analytics?.topReferrers?.length === 0 ? (
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>No referrers recorded yet.</p>
              ) : (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Referrer</th>
                        <th style={{ textAlign: 'right' }}>Clicks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics?.topReferrers?.map((ref, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 600 }}>{ref._id || 'Direct / Email'}</td>
                          <td style={{ textAlign: 'right', fontWeight: 700 }}>{ref.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Geographic distribution */}
            <div className="card">
              <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Geographical Distribution</h2>
              {analytics?.topCountries?.length === 0 ? (
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>No location logs recorded yet.</p>
              ) : (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Country</th>
                        <th style={{ textAlign: 'right' }}>Clicks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics?.topCountries?.map((c, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 600 }}>{c._id || 'Unknown'}</td>
                          <td style={{ textAlign: 'right', fontWeight: 700 }}>{c.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Devices and Browsers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }} className="grid-2">
            {/* Top Browsers */}
            <div className="card">
              <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Top Browsers</h2>
              {analytics?.topBrowsers?.length === 0 ? (
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>No browser logs yet.</p>
              ) : (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Browser</th>
                        <th style={{ textAlign: 'right' }}>Clicks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics?.topBrowsers?.map((b, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 600 }}>{b._id || 'Unknown'}</td>
                          <td style={{ textAlign: 'right', fontWeight: 700 }}>{b.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Top OS */}
            <div className="card">
              <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Top Operating Systems</h2>
              {analytics?.topOs?.length === 0 ? (
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>No OS logs yet.</p>
              ) : (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>OS</th>
                        <th style={{ textAlign: 'right' }}>Clicks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics?.topOs?.map((o, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 600 }}>{o._id || 'Unknown'}</td>
                          <td style={{ textAlign: 'right', fontWeight: 700 }}>{o.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Delete confirmation dialogue */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Link"
        message="Are you sure you want to delete this link? All associated analytics data will be removed forever."
        confirmText="Yes, delete"
      />
    </div>
  );
};

export default LinkDetailPage;
