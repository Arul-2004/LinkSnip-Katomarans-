import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      toast.success('Welcome back!');
      navigate('/dashboard/home');
    } else {
      toast.error(result.message || 'Login failed');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      {/* Left Pane: Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 var(--space-10)',
        maxWidth: '540px',
        background: 'white'
      }}>
        <div style={{ width: '100%' }}>
          <Link to="/" style={{
            fontSize: 'var(--font-size-3xl)',
            fontWeight: 900,
            color: 'var(--color-accent)',
            textDecoration: 'none',
            display: 'block',
            marginBottom: 'var(--space-10)'
          }}>
            Link<span style={{ color: 'var(--color-primary)' }}>Snip</span>
          </Link>

          <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Log in</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--color-blue)', fontWeight: 600 }}>Sign up</Link>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-secondary)',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <FiMail />
                </span>
                <input
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-secondary)',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <FiLock />
                </span>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-blue btn-full btn-lg"
              style={{ marginTop: 'var(--space-4)' }}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>
        </div>
      </div>

      {/* Right Pane: Branding illustration */}
      <div style={{
        flex: 1.2,
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 var(--space-16)',
        position: 'relative'
      }} className="desktop-only">
        <div style={{ maxWidth: '480px' }}>
          <h2 style={{ color: 'white', fontSize: 'var(--font-size-4xl)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>
            Track link performance in real-time.
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-base)', lineHeight: 1.6 }}>
            Understand your audience demographics, browser metrics, referral platforms, and geographics to design better user experiences.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
