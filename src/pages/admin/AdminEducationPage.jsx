import React, { useState } from 'react';
import { GraduationCap, Plus, Trash2, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { JOURNEY_MILESTONES } from '../../data/journeyData';

export const AdminEducationPage = () => {
  const [milestones, setMilestones] = useState([...JOURNEY_MILESTONES]);
  const [feedback, setFeedback] = useState(null);

  const handleAddMilestone = () => {
    const title = window.prompt('Enter milestone title:');
    if (!title || !title.trim()) return;

    const newMilestone = {
      id: `milestone-${Date.now()}`,
      title: title.trim(),
      organization: 'Haramaya University',
      status: 'In Progress',
      type: 'Academic Milestone',
      description: 'Continuous progression in software engineering curriculum.',
      highlights: ['Software Engineering', 'System Design']
    };

    setMilestones([newMilestone, ...milestones]);
    setFeedback(`Milestone "${title}" added.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = (id, title) => {
    if (!window.confirm(`Delete milestone "${title}"?`)) return;
    setMilestones(milestones.filter(m => m.id !== id));
    setFeedback(`Milestone removed.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            <GraduationCap size={28} color="var(--color-neon-cyan, #00D9FF)" /> Education & Journey Management
          </h1>
          <p className="admin-page-subtitle">
            Chronological academic track, university coursework milestones, and engineering evolution.
          </p>
        </div>

        <button onClick={handleAddMilestone} className="admin-btn admin-btn-primary">
          <Plus size={16} /> Add Journey Milestone
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {milestones.map((m) => (
          <div key={m.id} className="admin-card">
            <div className="admin-card-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                  <span style={{
                    background: 'rgba(0, 217, 255, 0.12)',
                    border: '1px solid rgba(0, 217, 255, 0.3)',
                    color: '#00D9FF',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    fontWeight: 600
                  }}>
                    {m.type}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 600 }}>
                    • {m.status}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
                  {m.title}
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'rgba(245, 248, 255, 0.6)', marginTop: '0.2rem' }}>
                  🏛️ {m.organization}
                </div>
              </div>

              <button
                onClick={() => handleDelete(m.id, m.title)}
                className="admin-btn admin-btn-danger admin-btn-sm"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'rgba(245, 248, 255, 0.75)', lineHeight: 1.6, marginBottom: '1rem' }}>
              {m.description}
            </p>

            {m.highlights && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                {m.highlights.map(h => (
                  <span key={h} style={{
                    background: 'rgba(7, 27, 61, 0.6)',
                    border: '1px solid rgba(0, 217, 255, 0.2)',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    color: '#F5F8FF'
                  }}>
                    {h}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminEducationPage;

