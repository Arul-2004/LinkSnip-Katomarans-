import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { urlAPI } from '../../services/api';
import QRCodeDisplay from '../../components/QRCodeDisplay';
import CopyButton from '../../components/CopyButton';
import { FiLink, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CreateLinkPage = () => {
  const navigate = useNavigate();

  // Form inputs
  const [originalUrl, setOriginalUrl] = useState('');
  const [title, setTitle] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  
  // Loading & validation states
  const [loading, setLoading] = useState(false);
  const [aliasChecking, setAliasChecking] = useState(false);
  const [aliasAvailable, setAliasAvailable] = useState(null);

  // Success state
  const [createdUrl, setCreatedUrl] = useState(null);

  const checkAliasAvailability = async (alias) => {
    if (!alias) {
      setAliasAvailable(null);
      return;
    }

    const aliasRegex = /^[a-zA-Z0-9_-]+$/;
    if (!aliasRegex.test(alias) || alias.length < 3 || alias.length > 30) {
      setAliasAvailable(false);
      return;
    }

    setAliasChecking(true);
    try {
      const res = await urlAPI.checkAlias(alias);
      if (res.data?.success) {
        setAliasAvailable(res.data.data.available);
      }
    } catch {
      setAliasAvailable(false);
    } finally {
      setAliasChecking(false);
    }
  };

  const handleAliasChange = (e) => {
    const val = e.target.value.trim();
    setCustomAlias(val);
    
    // Debounce the alias availability check
    const timeoutId = setTimeout(() => {
      checkAliasAvailability(val);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!originalUrl) {
      toast.error('Destination URL is required');
      return;
    }

    if (customAlias && aliasAvailable === false) {
      toast.error('Custom alias is not available');
      return;
    }

    setLoading(true);
    try {
      const res = await urlAPI.create({
        originalUrl,
        title: title || undefined,
        customAlias: customAlias || undefined,
        expiresAt: expiresAt || undefined
      });

      if (res.data?.success) {
        setCreatedUrl(res.data.data.url);
        toast.success('Short link generated!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create short link');
    } finally {
      setLoading(false);
    }
  };

  if (createdUrl) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '600px', margin: '0 auto' }}>
        <div className="card text-center" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', padding: 'var(--space-10)' }}>
          <div style={{
            fontSize: '3rem',
            color: 'var(--color-success)',
            background: 'var(--color-success-bg)',
            width: '80px',
            height: '80px',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-4)'
          }}>
            <FiCheck />
          </div>
          <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>Short Link Generated!</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            Your link has been created and is ready to share.
          </p>

          <div style={{
            padding: 'var(--space-4)',
            background: 'var(--color-bg-secondary)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
            marginTop: 'var(--space-4)'
          }}>
            <a href={createdUrl.shortUrl} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, color: 'var(--color-blue)', fontSize: 'var(--font-size-lg)' }}>
              {createdUrl.shortUrl.replace(/^https?:\/\//, '')}
            </a>
            <CopyButton text={createdUrl.shortUrl} />
          </div>
          
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', wordBreak: 'break-all' }}>
            Destination: {createdUrl.originalUrl}
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)', textAlign: 'center' }}>QR Code</h3>
          <QRCodeDisplay value={createdUrl.shortUrl} title={createdUrl.title || createdUrl.shortCode} />
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button onClick={() => setCreatedUrl(null)} className="btn btn-outline btn-full">
            Shorten Another Link
          </button>
          <Link to="/dashboard/links" className="btn btn-primary btn-full">
            Go to My Links
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '600px', margin: '0 auto' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800 }}>Create New Link</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          Shorten a URL, customize the slug, and configure expiration.
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
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
            <span className="form-helper">Enter the full destination URL, including http:// or https://</span>
          </div>

          <div className="form-group">
            <label className="form-label">Title (Optional)</label>
            <input
              type="text"
              placeholder="My website homepage"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />
            <span className="form-helper">An internal name to help organize your links.</span>
          </div>

          <div className="form-group">
            <label className="form-label">Custom Alias (Optional)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="custom-short-slug"
                value={customAlias}
                onChange={handleAliasChange}
                className={`form-input ${
                  aliasAvailable === true ? 'border-success' : aliasAvailable === false ? 'form-input-error' : ''
                }`}
              />
              {customAlias && (
                <span style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 'var(--font-size-sm)'
                }}>
                  {aliasChecking ? (
                    <span style={{ color: 'var(--color-text-secondary)' }}>Checking...</span>
                  ) : aliasAvailable === true ? (
                    <FiCheck style={{ color: 'var(--color-success)' }} />
                  ) : aliasAvailable === false ? (
                    <FiX style={{ color: 'var(--color-error)' }} />
                  ) : null}
                </span>
              )}
            </div>
            <span className="form-helper">
              {aliasAvailable === false ? (
                <span style={{ color: 'var(--color-error)' }}>This custom alias is already taken or invalid.</span>
              ) : aliasAvailable === true ? (
                <span style={{ color: 'var(--color-success)' }}>Alias is available!</span>
              ) : (
                'Use letters, numbers, hyphens, and underscores only.'
              )}
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Expiration Date (Optional)</label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="form-input"
              min={new Date().toISOString().split('T')[0]}
            />
            <span className="form-helper">After this date, the link will no longer redirect.</span>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-full btn-lg" style={{ marginTop: 'var(--space-4)' }}>
            {loading ? 'Generating...' : 'Create Short Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateLinkPage;
