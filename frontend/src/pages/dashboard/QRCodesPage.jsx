import { useState, useEffect } from 'react';
import { urlAPI } from '../../services/api';
import QRCodeDisplay from '../../components/QRCodeDisplay';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import Pagination from '../../components/Pagination';
import { FiGrid } from 'react-icons/fi';
import toast from 'react-hot-toast';

const QRCodesPage = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUrls = async () => {
    setLoading(true);
    try {
      const res = await urlAPI.getAll({
        page: currentPage,
        limit: 9
      });

      if (res.data?.success) {
        setUrls(res.data.data.urls);
        setTotalPages(res.data.data.pagination.pages);
      }
    } catch (err) {
      console.error('Error fetching URLs for QR Codes:', err);
      toast.error('Failed to load QR codes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, [currentPage]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800 }}>QR Codes</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          Download and manage custom QR codes for your shortened links.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : urls.length === 0 ? (
        <EmptyState
          title="No QR codes available"
          message="Create a shortened link to automatically generate and view its QR code."
          actionText="Create Link"
          actionLink="/dashboard/create"
          icon={<FiGrid />}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
            {urls.map((url) => (
              <div key={url.id || url._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', alignItems: 'center' }}>
                <h3 className="truncate" style={{ width: '100%', textAlign: 'center', fontSize: 'var(--font-size-base)', fontWeight: 700 }}>
                  {url.title || url.shortCode}
                </h3>
                
                <QRCodeDisplay value={url.shortUrl} size={160} title={url.title || url.shortCode} />
                
                <div style={{ width: '100%', borderTop: '1px solid var(--color-border-light)', paddingTop: 'var(--space-2)', textAlign: 'center' }}>
                  <a href={url.shortUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-blue)' }}>
                    {url.shortUrl.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default QRCodesPage;
