import { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';

const CopyButton = ({ text, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`btn btn-icon btn-ghost ${className}`}
      title="Copy to clipboard"
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {copied ? <FiCheck style={{ color: 'var(--color-success)' }} /> : <FiCopy />}
    </button>
  );
};

export default CopyButton;
