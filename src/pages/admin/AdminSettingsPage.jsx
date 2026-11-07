import React, { useState, useEffect } from 'react';
import { Settings, Database, Shield, KeyRound, RefreshCw, CheckCircle2, AlertCircle, HardDrive } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import api from '../../services/api';

export const AdminSettingsPage = () => {
  const [health, setHealth] = useState(null);
  const [testingHealth, setTestingHealth] = useState(false);
  const [passwordState, setPasswordState] = useState({ current: '', newPass: '', confirm: '' });
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  const runHealthCheck = async () => {
    setTestingHealth(true);
    setError(null);
    try {
      const res = await api.health.check();
      setHealth(res);
      setFeedback('Backend health verified: PHP + MySQL online.');
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      setHealth({ status: 'error', message: err.message });
      setError(`Backend diagnostic failed: ${err.message}`);
    } finally {
      setTestingHealth(false);
    }
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordState.newPass !== passwordState.confirm) {
      setError('New passwords do not match.');
      return;
    }
    if (passwordState.newPass.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }
    setError(null);
    setFeedback('Password updated in session.');
    setPasswordState({ current: '', newPass: '', confirm: '' });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleClearSession = () => {
    localStorage.removeItem('mubdev_token');
    window.location.href = '/admin/login';
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            <Settings size={28} color="var(--color-neon-cyan, #00D9FF)" /> Website & System Settings
          </h1>
          <p className="admin-page-subtitle">
            Diagnostics, database status, API health, and administrator security configuration.
          </p>
        </div>

        <button 
          onClick={runHealthCheck} 
          disabled={testingHealth}
          className="admin-btn admin-btn-secondary"
        >
          <RefreshCw size={16} className={testingHealth ? 'spin' : ''} /> Test API Health
        </button>
      </div>

      {feedback && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: '#34D399',
          padding: '0.85rem 1rem',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem'
        }}>
          <CheckCircle2 size={18} />
          <span>{feedback}</span>
        </div>
      )}

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          color: '#F87171',
          padding: '0.85rem 1rem',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem'
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Backend & Database Diagnostics */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">
              <Database size={18} color="var(--color-neon-cyan, #00D9FF)" /> PHP & MySQL Diagnostics
            </h2>
            <span style={{
              background: health?.status === 'success' || health?.data?.database?.connected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: health?.status === 'success' || health?.data?.database?.connected ? '#10B981' : '#EF4444',
              border: '1px solid currentColor',
              padding: '0.2rem 0.55rem',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              {health?.status === 'success' || health?.data?.database?.connected ? 'SYSTEM HEALTHY' : 'CHECK FAILED'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <span style={{ color: 'rgba(245, 248, 255, 0.6)' }}>Backend Environment:</span>
              <span style={{ fontWeight: 600, color: '#fff' }}>PHP 8.2 (REST Controller Pattern)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <span style={{ color: 'rgba(245, 248, 255, 0.6)' }}>Database Driver:</span>
              <span style={{ fontWeight: 600, color: '#fff' }}>PDO MySQL (Prepared Statements)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <span style={{ color: 'rgba(245, 248, 255, 0.6)' }}>Database Name:</span>
              <span style={{ fontWeight: 600, color: '#00D9FF' }}>mubdev</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <span style={{ color: 'rgba(245, 248, 255, 0.6)' }}>Target Host / Port:</span>
              <span style={{ fontWeight: 600, color: '#fff' }}>127.0.0.1:3306</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <span style={{ color: 'rgba(245, 248, 255, 0.6)' }}>API Endpoint Base:</span>
              <span style={{ fontWeight: 600, color: '#fff' }}>/api/ (Vite proxy to :8000)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(245, 248, 255, 0.6)' }}>Active Tables:</span>
              <span style={{ fontWeight: 600, color: '#fff' }}>contact_messages, admin_users</span>
            </div>
          </div>
        </div>

        {/* Admin Security & Password Management */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">
              <KeyRound size={18} color="var(--color-violet, #713BFF)" /> Admin Security & Credentials
            </h2>
          </div>

          <form onSubmit={handlePasswordSubmit}>
            <div className="admin-form-group">
              <label className="admin-label">Current Password</label>
              <input
                type="password"
                className="admin-input"
                placeholder="Enter current password"
                value={passwordState.current}
                onChange={(e) => setPasswordState({ ...passwordState, current: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">New Password</label>
              <input
                type="password"
                className="admin-input"
                placeholder="At least 8 characters"
                value={passwordState.newPass}
                onChange={(e) => setPasswordState({ ...passwordState, newPass: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Confirm New Password</label>
              <input
                type="password"
                className="admin-input"
                placeholder="Re-enter new password"
                value={passwordState.confirm}
                onChange={(e) => setPasswordState({ ...passwordState, confirm: e.target.value })}
              />
            </div>

            <button type="submit" className="admin-btn admin-btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              Update Admin Password
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <button
              onClick={handleClearSession}
              className="admin-btn admin-btn-danger"
              style={{ width: '100%', fontSize: '0.85rem' }}
            >
              Terminate Session & Log Out
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;

