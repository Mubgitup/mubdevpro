import React, { useState, useEffect } from 'react';
import { Shield, Lock, User, AlertCircle, ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react';
import { useRouter, Link } from '../../router/Router';
import { MubdevLogo } from '../../assets/logo/MubdevLogo';
import api from '../../services/api';
import '../../styles/admin.css';

export const AdminLoginPage = () => {
  const { navigate } = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('AdminMubdev2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // If already authenticated, redirect to /admin
  useEffect(() => {
    const existingToken = localStorage.getItem('mubdev_token');
    if (existingToken) {
      // Optional check or quick redirect
    }
  }, []);

  const handleFillDefaults = () => {
    setUsername('admin');
    setPassword('AdminMubdev2026!');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.auth.login({ username, password });
      
      if (response.status === 'success' || response.data?.token) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/admin');
        }, 500);
      } else {
        setError(response.message || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify the PHP backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-box">
        {/* Logo and Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-block', marginBottom: '1rem' }}>
            <MubdevLogo size="lg" showText={true} showTagline={true} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <span className="admin-brand-badge" style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}>
              <Shield size={12} /> SECURE CONTROL PANEL
            </span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'rgba(245, 248, 255, 0.65)', marginTop: '0.75rem' }}>
            Authenticate with your administrator credentials to access the portfolio management system.
          </p>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#F87171',
            borderRadius: '10px',
            padding: '0.85rem 1rem',
            marginBottom: '1.25rem',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34D399',
            borderRadius: '10px',
            padding: '0.85rem 1rem',
            marginBottom: '1.25rem',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem'
          }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>Authentication verified. Redirecting to dashboard...</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-label" htmlFor="username">
              Username or Email
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(0, 217, 255, 0.6)' }}>
                <User size={16} />
              </span>
              <input
                id="username"
                type="text"
                className="admin-input"
                style={{ paddingLeft: '2.75rem' }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label" htmlFor="password">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(0, 217, 255, 0.6)' }}>
                <Lock size={16} />
              </span>
              <input
                id="password"
                type="password"
                className="admin-input"
                style={{ paddingLeft: '2.75rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Quick Credential Helper Pill */}
          <div style={{
            background: 'rgba(8, 123, 255, 0.08)',
            border: '1px dashed rgba(0, 217, 255, 0.3)',
            borderRadius: '8px',
            padding: '0.75rem',
            marginBottom: '1.5rem',
            fontSize: '0.78rem',
            color: 'rgba(245, 248, 255, 0.7)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--color-neon-cyan, #00D9FF)' }}>Seeded Admin Account:</span>
              <button 
                type="button" 
                onClick={handleFillDefaults}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-neon-cyan, #00D9FF)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  textDecoration: 'underline'
                }}
              >
                Auto-fill
              </button>
            </div>
            <div>Username: <code style={{ color: '#fff', background: 'rgba(0,0,0,0.3)', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>admin</code></div>
            <div style={{ marginTop: '0.2rem' }}>Password: <code style={{ color: '#fff', background: 'rgba(0,0,0,0.3)', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>AdminMubdev2026!</code></div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <KeyRound size={16} /> Sign In to Admin
              </>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
          <Link
            to="/"
            style={{
              color: 'rgba(245, 248, 255, 0.6)',
              textDecoration: 'none',
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-neon-cyan, #00D9FF)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'rgba(245, 248, 255, 0.6)'}
          >
            <ArrowLeft size={14} /> Back to Mubdev Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;

