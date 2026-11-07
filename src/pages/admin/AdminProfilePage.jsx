import React, { useState } from 'react';
import { User, Save, CheckCircle2, Shield, GraduationCap, Code, Compass, Sparkles } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { BRAND_PROFILE, ASSET_PATHS } from '../../data/brandConfig';

export const AdminProfilePage = () => {
  const [profile, setProfile] = useState({ ...BRAND_PROFILE });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            <User size={28} color="var(--color-neon-cyan, #00D9FF)" /> Profile Management
          </h1>
          <p className="admin-page-subtitle">
            Configure your brand identity, educational background, and hero profile metadata.
          </p>
        </div>

        <button 
          onClick={handleSubmit} 
          className="admin-btn admin-btn-primary"
        >
          <Save size={16} /> Save Changes
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
          <span>Profile configuration updated successfully.</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 2fr) minmax(280px, 1fr)', gap: '1.5rem' }}>
        {/* Profile Form */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Personal & Academic Details</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="admin-form-group">
                <label className="admin-label">Full Name</label>
                <input
                  type="text"
                  className="admin-input"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Brand Name</label>
                <input
                  type="text"
                  className="admin-input"
                  value={profile.brand}
                  onChange={(e) => setProfile({ ...profile, brand: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Professional Role & Direction</label>
              <input
                type="text"
                className="admin-input"
                value={profile.role}
                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="admin-form-group">
                <label className="admin-label">University</label>
                <input
                  type="text"
                  className="admin-input"
                  value={profile.education.university}
                  onChange={(e) => setProfile({
                    ...profile,
                    education: { ...profile.education, university: e.target.value }
                  })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Academic Standing</label>
                <input
                  type="text"
                  className="admin-input"
                  value={profile.education.year}
                  onChange={(e) => setProfile({
                    ...profile,
                    education: { ...profile.education, year: e.target.value }
                  })}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Short Bio</label>
              <textarea
                className="admin-textarea"
                rows={3}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Hero Section Narrative</label>
              <textarea
                className="admin-textarea"
                rows={4}
                value={profile.heroDescription}
                onChange={(e) => setProfile({ ...profile, heroDescription: e.target.value })}
              />
            </div>
          </form>
        </div>

        {/* Live Preview Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">
              <Sparkles size={18} color="var(--color-neon-cyan, #00D9FF)" /> Live Card Preview
            </h2>
          </div>

          <div style={{
            background: 'rgba(2, 8, 23, 0.8)',
            border: '1px solid rgba(0, 217, 255, 0.2)',
            borderRadius: '12px',
            padding: '1.25rem',
            textAlign: 'center'
          }}>
            <div style={{
              width: '100%',
              maxHeight: '140px',
              overflow: 'hidden',
              borderRadius: '10px',
              marginBottom: '1rem',
              border: '1px solid rgba(0, 217, 255, 0.3)',
              boxShadow: '0 0 15px rgba(0, 217, 255, 0.2)'
            }}>
              <img
                src={ASSET_PATHS.heroPortrait}
                alt="Mubdev Official Hero"
                style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
              />
            </div>

            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>{profile.name}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-neon-cyan, #00D9FF)', fontWeight: 600, marginTop: '0.2rem' }}>
              {profile.brand}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(245, 248, 255, 0.75)', marginTop: '0.5rem', lineHeight: 1.4 }}>
              {profile.role}
            </div>

            <div style={{
              marginTop: '1.25rem',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.8rem',
              color: 'rgba(245, 248, 255, 0.6)',
              textAlign: 'left'
            }}>
              <div style={{ marginBottom: '0.4rem' }}>
                🎓 <strong>{profile.education.university}</strong>
              </div>
              <div>
                📚 {profile.education.degree} ({profile.education.year})
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfilePage;

