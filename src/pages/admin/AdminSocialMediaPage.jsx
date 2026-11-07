import React, { useState } from 'react';
import { Share2, Save, CheckCircle2, ExternalLink, Globe } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { SOCIAL_LINKS } from '../../data/socialLinks';

export const AdminSocialMediaPage = () => {
  const [links, setLinks] = useState([...SOCIAL_LINKS]);
  const [saved, setSaved] = useState(false);

  const handleUrlChange = (id, newUrl) => {
    setLinks(prev => prev.map(item => item.id === id ? { ...item, url: newUrl } : item));
  };

  const handleUsernameChange = (id, newUsername) => {
    setLinks(prev => prev.map(item => item.id === id ? { ...item, username: newUsername } : item));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            <Share2 size={28} color="var(--color-neon-cyan, #00D9FF)" /> Social Media Links Management
          </h1>
          <p className="admin-page-subtitle">
            Configure links and handles for GitHub, Telegram, Instagram, and TikTok across the Navbar, Contact, and Footer.
          </p>
        </div>

        <button onClick={handleSave} className="admin-btn admin-btn-primary">
          <Save size={16} /> Save Links
        </button>
      </div>

      {saved && (
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
          <span>Social media profile URLs updated successfully.</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {links.map((platform) => (
          <div key={platform.id} className="admin-card">
            <div className="admin-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: platform.accentColor || '#00D9FF',
                  boxShadow: `0 0 10px ${platform.accentColor || '#00D9FF'}`
                }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
                  {platform.name}
                </h3>
              </div>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono, monospace)', color: 'rgba(245, 248, 255, 0.5)' }}>
                {platform.id}
              </span>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Profile / Channel URL</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="admin-input"
                  value={platform.url}
                  onChange={(e) => handleUrlChange(platform.id, e.target.value)}
                  placeholder={`https://${platform.id}.com/username`}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Display Handle / Username</label>
              <input
                type="text"
                className="admin-input"
                value={platform.username}
                onChange={(e) => handleUsernameChange(platform.id, e.target.value)}
                placeholder="@mubdev"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Section Description</label>
              <p style={{ fontSize: '0.82rem', color: 'rgba(245, 248, 255, 0.6)', margin: 0 }}>
                {platform.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminSocialMediaPage;

