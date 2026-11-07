import React, { useState } from 'react';
import { Briefcase, Plus, Trash2, ExternalLink, Github, CheckCircle2, Star } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { PROJECTS, PROJECT_CATEGORIES } from '../../data/projectsData';

export const AdminProjectsPage = () => {
  const [projectsList, setProjectsList] = useState([...PROJECTS]);
  const [feedback, setFeedback] = useState(null);

  const handleAddProject = () => {
    const title = window.prompt('Enter new project title:');
    if (!title || !title.trim()) return;

    const newProject = {
      id: `project-${Date.now()}`,
      title: title.trim(),
      category: 'Frontend',
      description: 'New full-stack or frontend portfolio project.',
      technologies: ['React', 'JavaScript', 'CSS3'],
      featured: true,
      githubUrl: 'https://github.com/placeholder',
      liveUrl: null,
      badge: 'Active Work'
    };

    setProjectsList([newProject, ...projectsList]);
    setFeedback(`Project "${title}" added to catalog.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = (id, title) => {
    if (!window.confirm(`Delete project "${title}"?`)) return;
    setProjectsList(projectsList.filter(p => p.id !== id));
    setFeedback(`Project "${title}" removed.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleToggleFeatured = (id) => {
    setProjectsList(prev => prev.map(p => p.id === id ? { ...p, featured: !p.featured } : p));
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            <Briefcase size={28} color="var(--color-neon-cyan, #00D9FF)" /> Project Management
          </h1>
          <p className="admin-page-subtitle">
            Catalog, feature, and showcase your academic, course, and practice projects.
          </p>
        </div>

        <button onClick={handleAddProject} className="admin-btn admin-btn-primary">
          <Plus size={16} /> Add New Project
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
        {projectsList.map((project) => (
          <div key={project.id} className="admin-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="admin-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  background: 'rgba(8, 123, 255, 0.15)',
                  border: '1px solid rgba(0, 217, 255, 0.3)',
                  color: '#00D9FF',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '999px',
                  fontSize: '0.72rem',
                  fontWeight: 600
                }}>
                  {project.category}
                </span>
                {project.badge && (
                  <span style={{ fontSize: '0.72rem', color: 'rgba(245, 248, 255, 0.5)' }}>
                    • {project.badge}
                  </span>
                )}
              </div>

              <button
                onClick={() => handleToggleFeatured(project.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: project.featured ? '#F59E0B' : 'rgba(255, 255, 255, 0.2)'
                }}
                title={project.featured ? 'Featured Project' : 'Mark as Featured'}
              >
                <Star size={18} fill={project.featured ? '#F59E0B' : 'none'} />
              </button>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
              {project.title}
            </h3>

            <p style={{ fontSize: '0.85rem', color: 'rgba(245, 248, 255, 0.7)', lineHeight: 1.5, marginBottom: '1rem', flex: 1 }}>
              {project.description}
            </p>

            {/* Tech Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
              {project.technologies.map(tech => (
                <span key={tech} style={{
                  background: 'rgba(2, 8, 23, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  color: 'rgba(245, 248, 255, 0.8)'
                }}>
                  {tech}
                </span>
              ))}
            </div>

            {/* Card Footer Actions */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.85rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" style={{ color: 'rgba(245, 248, 255, 0.6)' }} title="GitHub Repo">
                    <Github size={16} />
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} style={{ color: '#00D9FF' }} title="Live Preview">
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>

              <button
                onClick={() => handleDelete(project.id, project.title)}
                className="admin-btn admin-btn-danger admin-btn-sm"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminProjectsPage;

