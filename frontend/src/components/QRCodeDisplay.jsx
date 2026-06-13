import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { FiDownload } from 'react-icons/fi';

const QRCodeDisplay = ({ value, size = 200, title = 'LinkSnip QR Code' }) => {
  const canvasRef = useRef(null);

  const downloadQRCode = () => {
    const canvas = document.getElementById('qrcanvas');
    if (!canvas) return;
    
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${title.toLowerCase().replace(/\s+/g, '_')}_qr.png`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="qr-display flex-center flex-col">
      <div style={{ background: 'white', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', marginBottom: 'var(--space-4)' }}>
        <QRCodeCanvas
          id="qrcanvas"
          value={value}
          size={size}
          level="H"
          includeMargin={true}
        />
      </div>
      <button onClick={downloadQRCode} className="btn btn-outline" style={{ gap: 'var(--space-2)' }}>
        <FiDownload />
        Download PNG
      </button>
    </div>
  );
};

export default QRCodeDisplay;
