import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Code, 
  Briefcase, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  User, 
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Database,
  Cpu
} from 'lucide-react';
import { Link } from '../../router/Router';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { PROJECTS } from '../../data/projectsData';
import { SKILL_CATEGORIES } from '../../data/skillsData';
import api from '../../services/api';

export const AdminDashboardPage = () => {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [backendHealth, setBackendHealth] = useState(null);

  const totalSkills = SKILL_CATEGORIES.reduce((acc, cat) => acc + cat.skills.length, 0);
  const totalProjects = PROJECTS.length;

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch recent messages
        const msgRes = await api.messages.list({ limit: 5 });
        if (msgRes.data) {
          setMessages(msgRes.data);
          setUnreadCount(msgRes.meta?.unread_count || 0);
          setTotalCount(msgRes.meta?.total_count || msgRes.data.length);
        }
      } catch (err) {
        console.warn('Could not fetch messages from PHP backend:', err.message);
      }

      try {
        // Fetch health
        const healthRes = await api.health.check();
        setBackendHealth(healthRes);
      } catch (err) {
        setBackendHealth({ status: 'offline', message: err.message });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            Mubdev Control Panel
          </h1>
          <p className="admin-page-subtitle">
            Welcome back, Mubarek. Overview of portfolio content, client inquiries, and backend status.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/messages" className="admin-btn admin-btn-primary admin-btn-sm">
            <Mail size={16} /> View Messages ({unreadCount} new)
          </Link>
          <Link to="/" className="admin-btn admin-btn-secondary admin-btn-sm">
            <ExternalLink size={16} /> Preview Site
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="admin-metrics-grid">
        <div className="admin-metric-card">
          <div>
            <div className="admin-metric-label">Contact Messages</div>
            <div className="admin-metric-value">{totalCount}</div>
            <div style={{ fontSize: '0.8rem', color: unreadCount > 0 ? '#00D9FF' : 'rgba(245, 248, 255, 0.5)' }}>
              {unreadCount} unread inquiry{unreadCount === 1 ? '' : 'ies'}
            </div>
          </div>
          <div className="admin-metric-icon-wrap">
            <Mail size={24} />
          </div>
        </div>

        <div className="admin-metric-card">
          <div>
            <div className="admin-metric-label">Featured Projects</div>
            <div className="admin-metric-value">{totalProjects}</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(245, 248, 255, 0.5)' }}>
              Academic & lab works
            </div>
          </div>
          <div className="admin-metric-icon-wrap">
            <Briefcase size={24} />
          </div>
        </div>

        <div className="admin-metric-card">
          <div>
            <div className="admin-metric-label">Cataloged Skills</div>
            <div className="admin-metric-value">{totalSkills}</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(245, 248, 255, 0.5)' }}>
              Across {SKILL_CATEGORIES.length} categories
            </div>
          </div>
          <div className="admin-metric-icon-wrap">
            <Code size={24} />
          </div>
        </div>

        <div className="admin-metric-card">
          <div>
            <div className="admin-metric-label">Backend Engine</div>
            <div className="admin-metric-value" style={{ fontSize: '1.45rem', marginTop: '0.65rem' }}>
              PHP + MySQL
            </div>
            <div style={{ fontSize: '0.8rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.35rem' }}>
              <span className="admin-status-dot" /> REST API Online
            </div>
          </div>
          <div className="admin-metric-icon-wrap" style={{ color: '#10B981', borderColor: 'rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.1)' }}>
            <Database size={24} />
          </div>
        </div>
      </div>

      {/* Main Grid: Messages Preview + Quick Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Recent Inquiries Card */}
        <div className="admin-card" style={{ gridColumn: 'span 2' }}>
          <div className="admin-card-header">
            <h2 className="admin-card-title">
              <Mail size={18} color="var(--color-neon-cyan, #00D9FF)" /> Recent Contact Inquiries
            </h2>
            <Link to="/admin/messages" className="admin-btn admin-btn-secondary admin-btn-sm">
              All Messages <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(245, 248, 255, 0.5)' }}>
              Loading inquiries from database...
            </div>
          ) : messages.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'rgba(245, 248, 255, 0.5)' }}>
              <CheckCircle2 size={36} color="var(--color-neon-cyan, #00D9FF)" style={{ margin: '0 auto 0.75rem' }} />
              <div>No messages in your inbox. Test the contact form on your portfolio to see submissions here!</div>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Sender</th>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((msg) => (
                    <tr key={msg.id} className={!msg.is_read ? 'unread' : ''}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#fff' }}>{msg.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'rgba(245, 248, 255, 0.5)' }}>{msg.email}</div>
                      </td>
                      <td style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {msg.subject || '(No Subject)'}
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'rgba(245, 248, 255, 0.6)' }}>
                        {new Date(msg.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td>
                        {!msg.is_read ? (
                          <span style={{
                            background: 'rgba(0, 217, 255, 0.15)',
                            color: 'var(--color-neon-cyan, #00D9FF)',
                            border: '1px solid rgba(0, 217, 255, 0.3)',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '999px',
                            fontSize: '0.72rem',
                            fontWeight: 700
                          }}>
                            NEW
                          </span>
                        ) : (
                          <span style={{
                            color: 'rgba(245, 248, 255, 0.45)',
                            fontSize: '0.75rem'
                          }}>
                            Read
                          </span>
                        )}
                      </td>
                      <td>
                        <Link to="/admin/messages" className="admin-btn admin-btn-secondary admin-btn-sm" style={{ padding: '0.25rem 0.6rem' }}>
                          Open
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* System Architecture Summary */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">
              <Cpu size={18} color="var(--color-violet, #713BFF)" /> System Architecture
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <span style={{ color: 'rgba(245, 248, 255, 0.6)' }}>Backend Server:</span>
              <span style={{ fontWeight: 600, color: '#fff' }}>PHP 8.2 (Core REST API)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <span style={{ color: 'rgba(245, 248, 255, 0.6)' }}>Database Engine:</span>
              <span style={{ fontWeight: 600, color: '#fff' }}>MySQL (PDO Prepared)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <span style={{ color: 'rgba(245, 248, 255, 0.6)' }}>Frontend Stack:</span>
              <span style={{ fontWeight: 600, color: '#fff' }}>React 19 + Vite SPA</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <span style={{ color: 'rgba(245, 248, 255, 0.6)' }}>Security Token:</span>
              <span style={{ fontWeight: 600, color: '#00D9FF' }}>HMAC Bearer Authentication</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(245, 248, 255, 0.6)' }}>CORS Policy:</span>
              <span style={{ fontWeight: 600, color: '#10B981' }}>Strict Origin Safe</span>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Link to="/admin/settings" className="admin-btn admin-btn-secondary" style={{ width: '100%', fontSize: '0.85rem' }}>
              Open Diagnostics & Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: '#fff' }}>
        Content Management Sections
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {[
          { title: 'Profile Info', to: '/admin/profile', desc: 'Name, bio, hero highlights' },
          { title: 'About Details', to: '/admin/about', desc: 'Academic path & philosophy' },
          { title: 'Technical Skills', to: '/admin/skills', desc: 'Proficiency categories' },
          { title: 'Project Catalog', to: '/admin/projects', desc: 'Portfolio cards & links' },
          { title: 'Education Track', to: '/admin/education', desc: 'Haramaya University milestones' },
          { title: 'Certificates', to: '/admin/certificates', desc: 'Credentials & coursework' },
          { title: 'Achievements', to: '/admin/achievements', desc: 'Awards & technical milestones' },
          { title: 'Social Media', to: '/admin/social-media', desc: 'GitHub, Telegram, Instagram, TikTok' },
          { title: 'Settings', to: '/admin/settings', desc: 'API health & credentials' },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="admin-card"
            style={{ textDecoration: 'none', transition: 'all 0.2s', padding: '1.1rem' }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.45)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.16)'}
          >
            <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
              {item.title}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(245, 248, 255, 0.6)' }}>
              {item.desc}
            </div>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;

