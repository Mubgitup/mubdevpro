import React, { useState, useEffect } from 'react';
import { 
  Code, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Edit3, 
  X, 
  RotateCcw, 
  Layers, 
  Terminal, 
  Server, 
  Database, 
  GitBranch,
  Sparkles
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { TechIcon, AVAILABLE_TECH_ICONS } from '../../components/common/TechIcon';
import { 
  getSkillsData, 
  saveSkillsData, 
  resetSkillsData, 
  DEFAULT_SKILL_CATEGORIES 
} from '../../data/skillsData';

const CATEGORY_ICONS = {
  frontend: Layers,
  programming: Terminal,
  backend: Server,
  database: Database,
  tools: GitBranch
};

const STATUS_OPTIONS = [
  'Core Proficiency',
  'Active Development',
  'Learning & Developing',
  'Currently Learning'
];

const PRESET_COLORS = [
  '#00D9FF', // Cyan
  '#087BFF', // Electric Blue
  '#713BFF', // Violet
  '#3776AB', // Python Blue
  '#E34F26', // HTML Orange
  '#1572B6', // CSS Blue
  '#F7DF1E', // JS Yellow
  '#00599C', // C++ Blue
  '#777BB4', // PHP Purple
  '#F05032', // Git Orange
  '#007ACC', // VS Code Blue
  '#F5F8FF'  // Crisp White
];

export const AdminSkillsPage = () => {
  const [categories, setCategories] = useState(getSkillsData);
  const [activeTab, setActiveTab] = useState(categories[0]?.id || 'frontend');
  const [feedback, setFeedback] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [editingSkillOriginalName, setEditingSkillOriginalName] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    categoryId: 'frontend',
    name: '',
    icon: 'react',
    status: 'Core Proficiency',
    color: '#00D9FF',
    description: ''
  });

  // Ensure active category is valid
  const currentCategory = categories.find((c) => c.id === activeTab) || categories[0] || DEFAULT_SKILL_CATEGORIES[0];

  // Helper to persist and notify
  const updateCategoriesState = (newCategories, message) => {
    setCategories(newCategories);
    saveSkillsData(newCategories);
    setFeedback(message);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleOpenAddModal = (targetCategoryId = null) => {
    const catId = targetCategoryId || activeTab;
    setModalMode('add');
    setEditingSkillOriginalName(null);
    setFormData({
      categoryId: catId,
      name: '',
      icon: 'react',
      status: 'Active Development',
      color: '#00D9FF',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (skill, categoryId) => {
    setModalMode('edit');
    setEditingSkillOriginalName(skill.name);
    setFormData({
      categoryId: categoryId,
      name: skill.name,
      icon: skill.icon || skill.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
      status: skill.status || 'Core Proficiency',
      color: skill.color || '#00D9FF',
      description: skill.description || ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleIconPresetChange = (iconId) => {
    const selected = AVAILABLE_TECH_ICONS.find((item) => item.id === iconId);
    setFormData((prev) => ({
      ...prev,
      icon: iconId,
      color: selected?.defaultColor || prev.color
    }));
  };

  const handleSaveSkill = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a valid skill name.');
      return;
    }

    const skillObj = {
      name: formData.name.trim(),
      icon: formData.icon || 'other',
      status: formData.status,
      color: formData.color,
      description: formData.description.trim() || `${formData.name.trim()} technology in development.`
    };

    let updated = [...categories];

    if (modalMode === 'add') {
      // Add to selected category
      updated = updated.map((cat) => {
        if (cat.id === formData.categoryId) {
          // Remove if duplicate name exists in same category
          const filtered = cat.skills.filter((s) => s.name.toLowerCase() !== skillObj.name.toLowerCase());
          return { ...cat, skills: [...filtered, skillObj] };
        }
        return cat;
      });
      updateCategoriesState(updated, `Technology "${skillObj.name}" added successfully.`);
    } else {
      // Edit mode: may move categories if categoryId changed
      updated = updated.map((cat) => {
        // Remove from old location if category changed or if original name matches
        const filtered = cat.skills.filter((s) => s.name.toLowerCase() !== editingSkillOriginalName.toLowerCase());
        
        if (cat.id === formData.categoryId) {
          return { ...cat, skills: [...filtered, skillObj] };
        }
        return { ...cat, skills: filtered };
      });
      updateCategoriesState(updated, `Technology "${skillObj.name}" updated successfully.`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteSkill = (skillName, categoryId) => {
    if (!window.confirm(`Are you sure you want to remove "${skillName}" from the portfolio?`)) {
      return;
    }

    const updated = categories.map((cat) => {
      if (cat.id === categoryId) {
        return { ...cat, skills: cat.skills.filter((s) => s.name !== skillName) };
      }
      return cat;
    });

    updateCategoriesState(updated, `Technology "${skillName}" removed.`);
  };

  const handleResetToDefaults = () => {
    if (!window.confirm('Reset all skills and categories back to verified portfolio defaults?')) {
      return;
    }

    const res = resetSkillsData();
    setCategories(res);
    setFeedback('Skills database reset to verified default technologies.');
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            <Code size={28} color="var(--color-neon-cyan, #00D9FF)" /> Technical Skills & Logos
          </h1>
          <p className="admin-page-subtitle">
            Manage your verified technologies, official vector logos, and proficiency categories.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            onClick={handleResetToDefaults} 
            className="admin-btn admin-btn-secondary"
            title="Reset to default verified skills"
          >
            <RotateCcw size={15} /> Reset Defaults
          </button>
          <button 
            onClick={() => handleOpenAddModal(currentCategory?.id)} 
            className="admin-btn admin-btn-primary"
          >
            <Plus size={16} /> Add Technology
          </button>
        </div>
      </div>

      {feedback && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: '#34D399',
          padding: '0.85rem 1.25rem',
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
      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {categories.map((cat) => {
          const IconComp = CATEGORY_ICONS[cat.id] || Terminal;
          const isActive = activeTab === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`admin-btn ${isActive ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <IconComp size={15} />
              <span>{cat.title}</span>
              <span style={{
                background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 217, 255, 0.1)',
                color: isActive ? '#fff' : 'var(--color-neon-cyan)',
                borderRadius: '999px',
                padding: '0.1rem 0.45rem',
                fontSize: '0.75rem',
                marginLeft: '0.2rem'
              }}>
                {cat.skills.length}
              </span>
            </button>
          );
        })}
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
          <button 
            onClick={() => handleOpenAddModal(currentCategory.id)} 
            className="admin-btn admin-btn-secondary admin-btn-sm"
          >
            <Plus size={14} /> Add to {currentCategory.title}
          </button>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '220px' }}>Technology & Official Logo</th>
                <th>Logo Key</th>
                <th>Proficiency Status</th>
                <th>Accent Color</th>
                <th>Description</th>
                <th style={{ width: '110px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentCategory.skills.map((skill) => (
                <tr key={skill.name}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {/* Logo Preview Badge */}
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(2, 8, 23, 0.75)',
                        border: `1px solid ${skill.color ? `${skill.color}55` : 'rgba(0, 217, 255, 0.25)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 0 10px ${skill.color ? `${skill.color}22` : 'transparent'}`
                      }}>
                        <TechIcon name={skill.icon || skill.name} size={22} color={skill.color} />
                      </div>
                      <div>
                        <strong style={{ color: '#fff', fontSize: '0.92rem' }}>{skill.name}</strong>
                      </div>
                    </div>
                  </td>
                  <td>
                    <code style={{
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      background: 'rgba(0, 217, 255, 0.08)',
                      padding: '0.2rem 0.45rem',
                      borderRadius: '4px',
                      color: 'var(--color-neon-cyan, #00D9FF)'
                    }}>
                      {skill.icon || 'other'}
                    </code>
                  </td>
                  <td>
                    <span style={{
                      background: skill.status === 'Core Proficiency' 
                        ? 'rgba(0, 217, 255, 0.12)' 
                        : 'rgba(113, 59, 255, 0.12)',
                      color: skill.status === 'Core Proficiency' ? '#00D9FF' : '#A78BFA',
                      border: `1px solid ${skill.status === 'Core Proficiency' ? 'rgba(0, 217, 255, 0.25)' : 'rgba(113, 59, 255, 0.25)'}`,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      whiteSpace: 'nowrap'
                    }}>
                      {skill.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: skill.color || '#00D9FF',
                        boxShadow: `0 0 8px ${skill.color || '#00D9FF'}`
                      }} />
                      <code style={{ fontSize: '0.8rem', color: 'rgba(245, 248, 255, 0.7)' }}>
                        {skill.color}
                      </code>
                    </div>
                  </td>
                  <td style={{ maxWidth: '300px', fontSize: '0.82rem', color: 'rgba(245, 248, 255, 0.7)', lineHeight: 1.4 }}>
                    {skill.description}
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                      <button
                        onClick={() => handleOpenEditModal(skill, currentCategory.id)}
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        title="Edit technology details & logo"
                        style={{ padding: '0.35rem 0.55rem' }}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(skill.name, currentCategory.id)}
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        title="Remove technology"
                        style={{ padding: '0.35rem 0.55rem' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Technology Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(2, 8, 23, 0.85)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(7, 27, 61, 0.95)',
            border: '1px solid rgba(0, 217, 255, 0.3)',
            borderRadius: '16px',
            maxWidth: '560px',
            width: '100%',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 217, 255, 0.15)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid rgba(0, 217, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(2, 8, 23, 0.4)'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="var(--color-neon-cyan, #00D9FF)" />
                {modalMode === 'add' ? 'Add Official Technology' : `Edit ${editingSkillOriginalName}`}
              </h3>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(245, 248, 255, 0.6)',
                  cursor: 'pointer',
                  padding: '0.2rem'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveSkill} style={{ padding: '1.5rem' }}>
              {/* Category & Status Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label className="admin-label">Category</label>
                  <select
                    className="admin-select"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label className="admin-label">Proficiency Status</label>
                  <select
                    className="admin-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Skill Name */}
              <div className="admin-form-group">
                <label className="admin-label">Technology Name</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. React, Python, Git, MySQL..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              {/* Official Logo Picker & Live Preview */}
              <div className="admin-form-group">
                <label className="admin-label">Official Technology Logo</label>
                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                  <select
                    className="admin-select"
                    style={{ flex: 1 }}
                    value={formData.icon}
                    onChange={(e) => handleIconPresetChange(e.target.value)}
                  >
                    {AVAILABLE_TECH_ICONS.map((iconItem) => (
                      <option key={iconItem.id} value={iconItem.id}>
                        {iconItem.label} ({iconItem.id})
                      </option>
                    ))}
                  </select>

                  {/* Real-time Icon Live Preview Badge */}
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(2, 8, 23, 0.8)',
                    border: `2px solid ${formData.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 14px ${formData.color}40`,
                    flexShrink: 0
                  }} title="Official Logo Live Preview">
                    <TechIcon name={formData.icon} size={28} color={formData.color} />
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'rgba(245, 248, 255, 0.5)', marginTop: '0.35rem', display: 'block' }}>
                  Select from official vector logos (HTML5, React, Python, PHP, MySQL, C++, Git, VS Code, etc.)
                </span>
              </div>

              {/* Accent Color & Presets */}
              <div className="admin-form-group">
                <label className="admin-label">Accent Color & Glow</label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.65rem' }}>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    style={{
                      width: '42px',
                      height: '38px',
                      borderRadius: '8px',
                      border: '1px solid rgba(0, 217, 255, 0.3)',
                      background: 'none',
                      cursor: 'pointer'
                    }}
                  />
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    style={{ width: '130px', fontFamily: 'monospace' }}
                  />
                </div>

                {/* Color Swatch Presets */}
                <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                  {PRESET_COLORS.map((clr) => (
                    <button
                      key={clr}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: clr })}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: clr,
                        border: formData.color.toLowerCase() === clr.toLowerCase() ? '2px solid #fff' : '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: `0 0 6px ${clr}55`,
                        cursor: 'pointer'
                      }}
                      title={clr}
                    />
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="admin-form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="admin-label">Description / Capabilities</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  placeholder="e.g. Component architecture, hooks, state management, and modern ecosystems."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="admin-btn admin-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                >
                  {modalMode === 'add' ? 'Save Technology' : 'Apply Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSkillsPage;
