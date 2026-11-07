import React, { useState, useEffect } from 'react';
import { Menu, ExternalLink, ShieldCheck, RefreshCw } from 'lucide-react';
import { Link, useRouter } from '../../router/Router';
import api from '../../services/api';

const ROUTE_LABELS = {
  '/admin': 'Dashboard Overview',
  '/admin/profile': 'Profile Management',
  '/admin/about': 'About Section Management',
  '/admin/skills': 'Skills Management',
  '/admin/projects': 'Projects Management',
  '/admin/education': 'Education & Timeline',
  '/admin/certificates': 'Certificates Management',
  '/admin/social-media': 'Social Media Links',
  '/admin/messages': 'Contact Messages Inbox',
  '/admin/settings': 'System Settings'
};

export const AdminNavbar = ({ onToggleSidebar }) => {
  const { path } = useRouter();
  const [backendStatus, setBackendStatus] = useState('checking'); // 'healthy' | 'offline' | 'checking'

  const currentTitle = ROUTE_LABELS[path] || 'Admin Hub';

  const checkHealth = async () => {
    try {
      const res = await api.health.check();
      if (res.status === 'success' || res.data?.database?.connected) {
        setBackendStatus('healthy');
      } else {
        setBackendStatus('warning');
      }
    } catch {
      setBackendStatus('offline');
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="admin-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleSidebar}
          className="admin-btn admin-btn-secondary admin-btn-sm"
          style={{ padding: '0.4rem', border: '1px solid rgba(0, 217, 255, 0.25)' }}
          aria-label="Toggle Navigation"
        >
          <Menu size={18} />
        </button>

        <div className="admin-breadcrumb">
          <Link to="/admin" style={{ color: 'inherit', textDecoration: 'none' }}>Admin</Link>
          <span>/</span>
          <span className="admin-breadcrumb-active">{currentTitle}</span>
        </div>
      </div>

      <div className="admin-navbar-actions">
        {backendStatus === 'healthy' && (
          <div className="admin-status-pill" title="PHP backend and MySQL connected">
            <span className="admin-status-dot" />
            <span>API Online</span>
          </div>
        )}
        {backendStatus === 'offline' && (
          <div 
            className="admin-status-pill" 
            style={{ color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.1)' }}
            title="Backend server offline. Start PHP with: php -S 127.0.0.1:8000"
          >
            <span className="admin-status-dot" style={{ background: '#EF4444', boxShadow: '0 0 8px #EF4444' }} />
            <span>API Offline</span>
          </div>
        )}

        <Link to="/" className="admin-btn admin-btn-secondary admin-btn-sm" title="View live portfolio">
          <ExternalLink size={14} />
          <span style={{ display: 'inline-block' }}>View Website</span>
        </Link>
      </div>
    </header>
  );
};

export default AdminNavbar;

