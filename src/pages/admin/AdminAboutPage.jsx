import React, { useState } from 'react';
import { Info, Save, CheckCircle2, Shield, Target, BookOpen, Layers } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';

export const AdminAboutPage = () => {
  const [saved, setSaved] = useState(false);
  const [aboutData, setAboutData] = useState({
    academicStanding: '3rd Year Software Engineering Student',
    institution: 'Haramaya University',
    bioP1: 'I am a passionate third-year Software Engineering student at Haramaya University, dedicated to mastering the art and discipline of building scalable, reliable, and modern software applications.',
    bioP2: 'My journey combines rigorous university fundamentals in data structures, algorithms, and systems programming with continuous self-directed exploration of full-stack web technologies like React, Python, Django, and PHP.',
    focusArea: 'Bridging elegant frontend user experiences with robust backend architecture and relational database design.',
  });

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
            <Info size={28} color="var(--color-neon-cyan, #00D9FF)" /> About Section Management
          </h1>
          <p className="admin-page-subtitle">
            Configure your academic narrative, core engineering philosophy, and personal story.
          </p>
        </div>

        <button onClick={handleSave} className="admin-btn admin-btn-primary">
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
          <span>About section content saved successfully.</span>
        </div>
      )}

      <div className="admin-card">
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-form-group">
              <label className="admin-label">Academic Standing</label>
              <input
                type="text"
                className="admin-input"
                value={aboutData.academicStanding}
                onChange={(e) => setAboutData({ ...aboutData, academicStanding: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">University / Institution</label>
              <input
                type="text"
                className="admin-input"
                value={aboutData.institution}
                onChange={(e) => setAboutData({ ...aboutData, institution: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Primary Biography Paragraph</label>
            <textarea
              className="admin-textarea"
              rows={4}
              value={aboutData.bioP1}
              onChange={(e) => setAboutData({ ...aboutData, bioP1: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Secondary Engineering Narrative</label>
            <textarea
              className="admin-textarea"
              rows={4}
              value={aboutData.bioP2}
              onChange={(e) => setAboutData({ ...aboutData, bioP2: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Strategic Focus & Philosophy</label>
            <input
              type="text"
              className="admin-input"
              value={aboutData.focusArea}
              onChange={(e) => setAboutData({ ...aboutData, focusArea: e.target.value })}
            />
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminAboutPage;

