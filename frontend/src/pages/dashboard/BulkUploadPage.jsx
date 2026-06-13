import { useState } from 'react';
import { urlAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiUpload, FiCheck, FiX, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';

const BulkUploadPage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type !== 'text/csv' && !selected.name.endsWith('.csv')) {
        toast.error('Only CSV files are allowed');
        return;
      }
      setFile(selected);
      setResults(null);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a CSV file');
      return;
    }

    const formData = new FormData();
    formData.append('csv', file);

    setUploading(true);
    try {
      const res = await urlAPI.bulkCreate(formData);
      if (res.data?.success) {
        setResults(res.data.data);
        toast.success(res.data.message || 'Bulk upload complete!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Bulk upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800 }}>Bulk Upload</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          Create up to 100 shortened links at once using a CSV file.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: 'var(--space-6)', alignItems: 'start' }} className="grid-2">
        {/* Upload Form and Instructions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="card">
            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Upload CSV</h2>
            
            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <label 
                className="dropzone" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  padding: 'var(--space-10)',
                  border: '2px dashed var(--color-border-dark)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  background: 'var(--color-bg-primary)'
                }}
              >
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleFileChange} 
                  style={{ display: 'none' }}
                />
                <FiUpload style={{ fontSize: '2.5rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }} />
                <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
                  {file ? file.name : 'Click to select CSV file'}
                </span>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Max size: 5MB
                </span>
              </label>

              <button type="submit" disabled={uploading || !file} className="btn btn-primary btn-full">
                {uploading ? 'Processing CSV...' : 'Process Upload'}
              </button>
            </form>
          </div>

          <div className="card" style={{ background: 'var(--color-info-bg)', borderColor: 'rgba(42, 91, 215, 0.2)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-2)', color: 'var(--color-blue)', marginBottom: 'var(--space-2)' }}>
              <FiInfo style={{ fontSize: '1.25rem', marginTop: '2px' }} />
              <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-blue)', margin: 0 }}>Instructions</h3>
            </div>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              Your CSV file should have a header row. The primary headers recognized are:
              <br />
              <strong>url</strong> (required) — the target destination link
              <br />
              <strong>title</strong> (optional) — title for the link
              <br />
              <strong>alias</strong> (optional) — a unique custom slug/short-slug
            </p>
          </div>
        </div>

        {/* Results view */}
        <div className="card" style={{ minHeight: '300px' }}>
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Results</h2>
          
          {uploading ? (
            <LoadingSpinner size="lg" />
          ) : results ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <div style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--color-success-bg)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', fontWeight: 600 }}>SUCCESS</span>
                  <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: '#047857' }}>{results.successCount}</div>
                </div>
                <div style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--color-error-bg)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', fontWeight: 600 }}>FAILED</span>
                  <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: '#c53030' }}>{results.errorCount}</div>
                </div>
              </div>

              <div className="table-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Original URL</th>
                      <th>Short Link / Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.results.map((r, idx) => (
                      <tr key={idx}>
                        <td style={{ maxWidth: '200px' }} className="truncate" title={r.url}>{r.url}</td>
                        <td>
                          {r.status === 'success' ? (
                            <a href={r.shortUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                              {r.shortUrl.replace(/^https?:\/\//, '')}
                            </a>
                          ) : (
                            <span style={{ color: 'var(--color-error)', fontWeight: 600, fontSize: 'var(--font-size-xs)' }}>
                              Failed: {r.message}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: 'var(--space-10) 0' }}>
              Upload and submit a CSV file to view generation details here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkUploadPage;
