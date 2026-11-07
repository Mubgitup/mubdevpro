import React, { useState } from 'react';
import { Award, Plus, Trash2, ExternalLink, CheckCircle2, ShieldCheck } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';

const INITIAL_CERTIFICATES = [
  {
    id: 'cert-1',
    title: 'Udacity Web Development Nanodegree Program',
    issuer: 'Udacity',
    issueDate: 'Verified Coursework',
    credentialId: 'UDACITY-WD-2024',
    url: 'https://www.udacity.com',
    skills: ['Semantic HTML5', 'Modern CSS Layouts', 'Vanilla JavaScript & DOM', 'Web APIs']
  },
  {
    id: 'cert-2',
    title: 'Haramaya University Software Engineering Coursework',
    issuer: 'Haramaya University',
    issueDate: 'In Progress (3rd Year)',
    credentialId: 'HU-SE-3RDYEAR',
    url: 'https://www.haramaya.edu.et',
    skills: ['C++ & Object-Oriented Programming', 'Relational Databases', 'Data Structures & Algorithms']
  }
];

export const AdminCertificatesPage = () => {
  const [certs, setCerts] = useState(INITIAL_CERTIFICATES);
  const [feedback, setFeedback] = useState(null);

  const handleAddCert = () => {
    const title = window.prompt('Enter certificate / award title:');
    if (!title || !title.trim()) return;

    const newCert = {
      id: `cert-${Date.now()}`,
      title: title.trim(),
      issuer: 'Certification Authority',
      issueDate: '2025',
      credentialId: `CERT-${Math.floor(Math.random() * 10000)}`,
      url: '#',
      skills: ['Software Engineering']
    };

    setCerts([newCert, ...certs]);
    setFeedback(`Certificate "${title}" added.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this certificate record?')) return;
    setCerts(certs.filter(c => c.id !== id));
    setFeedback('Certificate removed.');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            <Award size={28} color="var(--color-neon-cyan, #00D9FF)" /> Certificates & Achievements
          </h1>
          <p className="admin-page-subtitle">
            Manage professional certificates, coursework completions, and academic credentials.
          </p>
        </div>

        <button onClick={handleAddCert} className="admin-btn admin-btn-primary">
          <Plus size={16} /> Add Certificate
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {certs.map((c) => (
          <div key={c.id} className="admin-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="admin-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} color="var(--color-neon-cyan, #00D9FF)" />
                <span style={{ fontSize: '0.82rem', color: '#10B981', fontWeight: 600 }}>
                  Verified Credential
                </span>
              </div>

              <button
                onClick={() => handleDelete(c.id)}
                className="admin-btn admin-btn-danger admin-btn-sm"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>
              {c.title}
            </h3>

            <div style={{ fontSize: '0.85rem', color: 'rgba(245, 248, 255, 0.65)', marginBottom: '0.85rem' }}>
              Issued by: <strong>{c.issuer}</strong> ({c.issueDate})
            </div>

            <div style={{
              background: 'rgba(2, 8, 23, 0.5)',
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.75rem',
              color: 'rgba(245, 248, 255, 0.6)',
              marginBottom: '1rem'
            }}>
              ID: {c.credentialId}
            </div>

            {/* Skills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: 'auto' }}>
              {c.skills.map(s => (
                <span key={s} style={{
                  background: 'rgba(8, 123, 255, 0.1)',
                  border: '1px solid rgba(0, 217, 255, 0.2)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  color: '#F5F8FF'
                }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminCertificatesPage;

