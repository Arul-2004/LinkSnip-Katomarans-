import { FiInbox } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const EmptyState = ({ title, message, actionText, actionLink, icon = <FiInbox /> }) => {
  return (
    <div className="card flex-center flex-col text-center" style={{ padding: 'var(--space-12) var(--space-6)' }}>
      <div style={{
        fontSize: '3.5rem',
        color: 'var(--color-text-muted)',
        background: 'var(--color-bg-secondary)',
        width: '80px',
        height: '80px',
        borderRadius: 'var(--radius-full)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 'var(--space-6)'
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--color-text-secondary)', maxWidth: '400px', marginBottom: 'var(--space-6)', fontSize: 'var(--font-size-sm)' }}>
        {message}
      </p>
      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-primary">
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
