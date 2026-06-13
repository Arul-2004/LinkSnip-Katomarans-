import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FiLink, FiBarChart2, FiUpload, FiSettings } from 'react-icons/fi';
import { BsQrCode } from 'react-icons/bs';

const FeaturesPage = () => {
  const features = [
    {
      icon: <FiLink />,
      title: 'Advanced URL Shortening',
      description: 'Quickly shorten any URL. Generate short, readable, and clean codes or create fully customized aliases to fit your requirements. Validate URL safety and structure automatically.'
    },
    {
      icon: <BsQrCode />,
      title: 'Custom QR Codes',
      description: 'Create high-quality QR codes for every link you shorten. Download them in SVG or PNG format to print on flyers, business cards, or product packaging.'
    },
    {
      icon: <FiBarChart2 />,
      title: 'Detailed Real-time Analytics',
      description: 'Gain rich visitor insights. Monitor clicks, timestamp details, browser versions, operating system families, referrer sources, and geographics (country and city) at the click of a button.'
    },
    {
      icon: <FiUpload />,
      title: 'Bulk CSV Import',
      description: 'Need to shorten multiple links at once? Upload a CSV file containing your long destination URLs, titles, and custom aliases to generate short codes instantly.'
    },
    {
      icon: <FiSettings />,
      title: 'Control and Customization',
      description: 'Add safety expirations to your links to enforce deadlines. Deactivate or update destination targets at any time to fix broken links.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <section style={{
        background: 'var(--color-bg-secondary)',
        padding: 'var(--space-16) 0',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 var(--space-6)' }}>
          <h1 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>
            LinkSnip Features
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-lg)' }}>
            Discover all the premium tools designed to help you shorten, optimize, and track your links.
          </p>
        </div>
      </section>

      <section style={{ padding: 'var(--space-20) 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="card"
              style={{
                display: 'flex',
                gap: 'var(--space-6)',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                flexDirection: idx % 2 === 0 ? 'row' : 'row-reverse'
              }}
            >
              <div style={{
                fontSize: '2.5rem',
                color: idx % 2 === 0 ? 'var(--color-accent)' : 'var(--color-blue)',
                background: 'var(--color-bg-primary)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-lg)'
              }}>
                {feature.icon}
              </div>
              <div style={{ flex: 1, minWidth: '280px' }}>
                <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-base)', lineHeight: 1.7 }}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeaturesPage;
