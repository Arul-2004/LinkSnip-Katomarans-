import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCopy, FiExternalLink, FiBarChart2, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { BsQrCode } from 'react-icons/bs';
import { format, parseISO } from 'date-fns';
import CopyButton from './CopyButton';
import Modal from './Modal';
import QRCodeDisplay from './QRCodeDisplay';

const LinkCard = ({ url, onDelete }) => {
  const [isQrOpen, setIsQrOpen] = useState(false);

  const formattedDate = () => {
    try {
      const date = parseISO(url.createdAt);
      return format(date, 'MMM dd, yyyy');
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <h3 className="truncate" style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-1)' }}>
            {url.title || url.customAlias || url.shortCode}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <a 
              href={url.shortUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: 'var(--color-blue)', fontWeight: 600, fontSize: 'var(--font-size-base)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              {url.shortUrl.replace(/^https?:\/\//, '')}
              <FiExternalLink style={{ fontSize: '12px' }} />
            </a>
            <CopyButton text={url.shortUrl} className="btn-sm" />
          </div>
          <p className="truncate" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-2)' }}>
            {url.originalUrl}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: '80px' }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-text-primary)' }}>
            {url.totalClicks}
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Clicks
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border-light)', paddingTop: 'var(--space-3)', marginTop: 'var(--space-1)' }}>
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
          Created {formattedDate()}
        </span>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button 
            onClick={() => setIsQrOpen(true)} 
            className="btn btn-icon btn-ghost" 
            title="QR Code"
            style={{ padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <BsQrCode />
          </button>
          
          <Link 
            to={`/dashboard/links/${url.id || url._id}`} 
            className="btn btn-icon btn-ghost" 
            title="View Details & Edit"
            style={{ padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <FiEdit2 />
          </Link>
          
          <Link 
            to={`/dashboard/links/${url.id || url._id}`} 
            className="btn btn-icon btn-ghost" 
            title="Analytics"
            style={{ padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <FiBarChart2 style={{ color: 'var(--color-blue)' }} />
          </Link>

          <button 
            onClick={() => onDelete(url.id || url._id)} 
            className="btn btn-icon btn-ghost" 
            title="Delete Link"
            style={{ padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <FiTrash2 style={{ color: 'var(--color-error)' }} />
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      <Modal isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} title="QR Code" size="sm">
        <QRCodeDisplay value={url.shortUrl} title={url.title || url.shortCode} />
      </Modal>
    </div>
  );
};

export default LinkCard;
