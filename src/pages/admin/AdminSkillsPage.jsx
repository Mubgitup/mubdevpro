import React, { useState } from 'react';
import { Code, Plus, Trash2, CheckCircle2, Shield, Edit3 } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { SKILL_CATEGORIES } from '../../data/skillsData';

export const AdminSkillsPage = () => {
  const [categories, setCategories] = useState([...SKILL_CATEGORIES]);
  const [activeTab, setActiveTab] = useState(SKILL_CATEGORIES[0]?.id || 'frontend');
  const [feedback, setFeedback] = useState(null);

  const currentCategory = categories.find(c => c.id === activeTab) || categories[0];

  const handleAddSkill = () => {
    const name = window.prompt('Enter new skill name (e.g. TypeScript, Docker, PostgreSQL):');
    if (!name || !name.trim()) return;

    const newSkill = {
      name: name.trim(),
      status: 'Active Development',
      description: 'Recently added skill in continuous practice.',
      color: '#00D9FF'
    };

    setCategories(prev => prev.map(cat => {
      if (cat.id === currentCategory.id) {
        return { ...cat, skills: [...cat.skills, newSkill] };
      }
      return cat;
    }));

    setFeedback(`Skill "${name}" added successfully.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDeleteSkill = (skillName) => {
    if (!window.confirm(`Remove "${skillName}" from ${currentCategory.title}?`)) return;

    setCategories(prev => prev.map(cat => {
      if (cat.id === currentCategory.id) {
        return { ...cat, skills: cat.skills.filter(s => s.name !== skillName) };
      }
      return cat;
    }));

    setFeedback(`Skill "${skillName}" removed.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            <Code size={28} color="var(--color-neon-cyan, #00D9FF)" /> Technical Skills Management
          </h1>
          <p className="admin-page-subtitle">
            Manage your verified technologies, core proficiencies, and learning categories.
          </p>
        </div>

        <button onClick={handleAddSkill} className="admin-btn admin-btn-primary">
          <Plus size={16} /> Add New Skill
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

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`admin-btn ${activeTab === cat.id ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
          >
            {cat.title} ({cat.skills.length})
          </button>
        ))}
      </div>

      {/* Category Card */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">{currentCategory.title}</h2>
            <p style={{ fontSize: '0.85rem', color: 'rgba(245, 248, 255, 0.6)', marginTop: '0.2rem' }}>
              {currentCategory.description}
            </p>
          </div>
          <button onClick={handleAddSkill} className="admin-btn admin-btn-secondary admin-btn-sm">
            <Plus size={14} /> Add Skill to {currentCategory.title}
          </button>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Skill Name</th>
                <th>Proficiency Status</th>
                <th>Accent Color</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentCategory.skills.map((skill) => (
                <tr key={skill.name}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: skill.color || '#00D9FF',
                        boxShadow: `0 0 8px ${skill.color || '#00D9FF'}`
                      }} />
                      <strong style={{ color: '#fff' }}>{skill.name}</strong>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      background: skill.status === 'Core Proficiency' 
                        ? 'rgba(0, 217, 255, 0.15)' 
                        : 'rgba(113, 59, 255, 0.15)',
                      color: skill.status === 'Core Proficiency' ? '#00D9FF' : '#A78BFA',
                      border: `1px solid ${skill.status === 'Core Proficiency' ? 'rgba(0, 217, 255, 0.3)' : 'rgba(113, 59, 255, 0.3)'}`,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      {skill.status}
                    </span>
                  </td>
                  <td>
                    <code style={{ fontSize: '0.8rem', color: 'rgba(245, 248, 255, 0.7)' }}>
                      {skill.color}
                    </code>
                  </td>
                  <td style={{ maxWidth: '350px', fontSize: '0.82rem', color: 'rgba(245, 248, 255, 0.7)' }}>
                    {skill.description}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteSkill(skill.name)}
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      title="Remove skill"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSkillsPage;

