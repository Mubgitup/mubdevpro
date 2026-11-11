import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Eye,
  Search, 
  RefreshCw, 
  X, 
  Calendar, 
  ExternalLink,
  Award,
  Sparkles,
  Loader2,
  Tag,
  Building
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ACHIEVEMENTS_DATA } from '../../data/achievementsData';
import { api } from '../../services/api';

const CATEGORIES = [
  'Technical Milestone',
  'Applied Milestone',
  'Academic Recognition',
  'Competition Award',
  'Project Achievement'
];

const INITIAL_FORM = {
  id: null,
  title: '',
  category: 'Technical Milestone',
  organization: '',
  date: '',
  description: '',
  link_url: '',
  highlights: [],
  display_order: 0,
  featured: false
};

export const AdminAchievementsPage = () => {
  const [achievements, setAchievements] = useState(ACHIEVEMENTS_DATA || []);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [newTagInput, setNewTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadAchievements = async (showIndicator = false) => {
    if (showIndicator) setRefreshing(true);
    else setLoading(true);

    try {
      if (api?.achievements?.list && typeof api.achievements.list === 'function') {
        const res = await api.achievements.list({
          search: searchQuery.trim() || undefined,
          category: selectedCategory !== 'All' ? selectedCategory : undefined
        });

        const items = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.achievements)
            ? res.achievements
            : Array.isArray(res?.data?.achievements)
              ? res.data.achievements
              : null;

        if (items && items.length > 0) {
          setAchievements(items);
        }
      }
    } catch (err) {
      console.warn('API fetch warning, using local/cached achievements:', err);
      // Keep existing/cached achievements, don't crash
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAchievements();
  }, [selectedCategory]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadAchievements();
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredAchievements = useMemo(() => {
    if (!Array.isArray(achievements)) return [];
    return achievements.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        item.title?.toLowerCase().includes(q) ||
        item.organization?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q);
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [achievements, searchQuery, selectedCategory]);

  // Quick statistics
  const stats = useMemo(() => {
    const list = Array.isArray(achievements) ? achievements : [];
    const total = list.length;
    const technical = list.filter((a) => a.category?.includes('Technical') || a.category?.includes('Applied')).length;
    const academic = list.filter((a) => a.category?.includes('Academic') || a.category?.includes('Award')).length;
    return { total, technical, academic };
  }, [achievements]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      ...INITIAL_FORM,
      display_order: (achievements?.length || 0) + 1
    });
    setNewTagInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      id: item.id,
      title: item.title || '',
      category: item.category || 'Technical Milestone',
      organization: item.organization || '',
      date: item.date || '',
      description: item.description || '',
      link_url: item.link_url || item.url || '',
      highlights: Array.isArray(item.highlights) ? [...item.highlights] : [],
      display_order: item.display_order || 0,
      featured: !!item.featured
    });
    setNewTagInput('');
    setIsModalOpen(true);
  };

  const openViewModal = (item) => {
    setViewingItem(item);
    setIsViewModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleAddTag = () => {
    if (newTagInput.trim() && !formData.highlights.includes(newTagInput.trim())) {
      setFormData({
        ...formData,
        highlights: [...formData.highlights, newTagInput.trim()]
      });
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      highlights: formData.highlights.filter((t) => t !== tagToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Achievement title is required');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        if (api?.achievements?.update) {
          const res = await api.achievements.update(editingId, formData);
          const updated = res.data || res.achievement || { ...formData, id: editingId };
          setAchievements(achievements.map((a) => (a.id === editingId ? updated : a)));
        } else {
          setAchievements(achievements.map((a) => (a.id === editingId ? { ...formData, id: editingId } : a)));
        }
        setFeedback({ type: 'success', message: `Achievement "${formData.title}" updated successfully.` });
      } else {
        if (api?.achievements?.create) {
          const res = await api.achievements.create(formData);
          const created = res.data || res.achievement || { ...formData, id: Date.now() };
          setAchievements([created, ...achievements]);
        } else {
          setAchievements([{ ...formData, id: Date.now() }, ...achievements]);
        }
        setFeedback({ type: 'success', message: `Achievement "${formData.title}" created successfully.` });
      }
      closeModal();
    } catch (err) {
      // Local fallback so user is never blocked
      if (editingId) {
        setAchievements(achievements.map((a) => (a.id === editingId ? { ...formData, id: editingId } : a)));
        setFeedback({ type: 'success', message: 'Achievement updated locally.' });
      } else {
        setAchievements([{ ...formData, id: Date.now() }, ...achievements]);
        setFeedback({ type: 'success', message: 'Achievement added locally.' });
      }
      closeModal();
    } finally {
      setSubmitting(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title || 'this achievement'}"?`)) return;
    try {
      if (api?.achievements?.delete) {
        await api.achievements.delete(id);
      }
      setAchievements(achievements.filter((a) => a.id !== id));
      setFeedback({ type: 'success', message: 'Achievement deleted.' });
    } catch {
      setAchievements(achievements.filter((a) => a.id !== id));
      setFeedback({ type: 'success', message: 'Achievement removed.' });
    }
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            <Trophy size={28} color="var(--color-neon-cyan, #00D9FF)" /> Achievements &amp; Milestones
          </h1>
          <p className="admin-page-subtitle">
            Manage awards, technical milestones, academic recognitions, and applied project achievements.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            onClick={() => loadAchievements(true)} 
            className="admin-btn admin-btn-secondary" 
            title="Refresh achievements"
            disabled={loading || refreshing}
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button onClick={openAddModal} className="admin-btn admin-btn-primary">
            <Plus size={16} />
            <span>Add Achievement</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div style={{
          background: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${feedback.type === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
          color: feedback.type === 'success' ? '#34D399' : '#F87171',
          padding: '0.85rem 1rem',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem'
        }}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Summary Metrics (Compact) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '0.75rem',
        marginBottom: '1.25rem'
      }}>
        <div className="admin-card" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(245, 248, 255, 0.55)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Achievements
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-neon-cyan, #00D9FF)', marginTop: '0.15rem' }}>
              {stats.total}
            </div>
          </div>
          <Trophy size={20} color="var(--color-neon-cyan, #00D9FF)" />
        </div>

        <div className="admin-card" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(245, 248, 255, 0.55)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Technical Milestones
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-electric-blue, #087BFF)', marginTop: '0.15rem' }}>
              {stats.technical}
            </div>
          </div>
          <Award size={20} color="var(--color-electric-blue, #087BFF)" />
        </div>

        <div className="admin-card" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(245, 248, 255, 0.55)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Academic Recognitions
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-violet, #713BFF)', marginTop: '0.15rem' }}>
              {stats.academic}
            </div>
          </div>
          <Sparkles size={20} color="var(--color-violet, #713BFF)" />
        </div>
      </div>

      {/* Filter and Search Bar (Compact) */}
      <div className="admin-card" style={{ padding: '0.85rem 1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: '1 1 240px', minWidth: '200px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(245, 248, 255, 0.4)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '32px', fontSize: '0.85rem', padding: '0.5rem 0.75rem 0.5rem 32px' }}
              placeholder="Search achievements by title, organization, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {['All', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                className={`project-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem' }}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area: Loading / Empty / Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <Loader2 size={36} className="animate-spin" color="var(--color-neon-cyan, #00D9FF)" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'rgba(245, 248, 255, 0.7)' }}>Loading achievements from database...</p>
        </div>
      ) : filteredAchievements.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Trophy size={48} color="rgba(245, 248, 255, 0.25)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>No Achievements Found</h3>
          <p style={{ color: 'rgba(245, 248, 255, 0.6)', maxWidth: '460px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
            {searchQuery || selectedCategory !== 'All'
              ? 'No achievements matched your active search or category filter. Try resetting your search filter.'
              : 'You have not added any achievements yet. Add your first milestone, award, or technical recognition!'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            {(searchQuery || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="admin-btn admin-btn-secondary"
              >
                Reset Filters
              </button>
            )}
            <button onClick={openAddModal} className="admin-btn admin-btn-primary">
              <Plus size={16} /> Add Achievement
            </button>
          </div>
        </div>
      ) : (
        /* COMPACT ACHIEVEMENTS GRID (2-3 cards per row on desktop) */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem'
        }}>
          {filteredAchievements.map((item) => {
            const highlights = Array.isArray(item.highlights) ? item.highlights : [];
            const link = item.link_url || item.url;
            const isFeatured = item.featured === true || item.featured === 1 || item.featured === '1';

            return (
              <div 
                key={item.id} 
                className="admin-card" 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '0.9rem 1rem',
                  borderRadius: '11px',
                  border: isFeatured ? '1px solid rgba(0, 217, 255, 0.35)' : '1px solid rgba(113, 59, 255, 0.22)',
                  background: 'rgba(7, 27, 61, 0.45)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = isFeatured ? 'rgba(0, 217, 255, 0.55)' : 'rgba(113, 59, 255, 0.45)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = isFeatured ? 'rgba(0, 217, 255, 0.35)' : 'rgba(113, 59, 255, 0.22)';
                }}
              >
                <div>
                  {/* Card Header: Category Badge + Compact Action Buttons */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.65rem'
                  }}>
                    <span style={{
                      display: 'inline-block',
                      background: 'rgba(113, 59, 255, 0.16)',
                      border: '1px solid rgba(113, 59, 255, 0.35)',
                      color: '#C4B5FD',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '999px',
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      maxWidth: '170px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {item.category || 'Milestone'}
                    </span>

                    <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                      <button
                        onClick={() => openViewModal(item)}
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        style={{ padding: '0.25rem 0.45rem', fontSize: '0.72rem' }}
                        title="View Details"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        onClick={() => openEditModal(item)}
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        style={{ padding: '0.25rem 0.45rem', fontSize: '0.72rem' }}
                        title="Edit Achievement"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        style={{ padding: '0.25rem 0.45rem', fontSize: '0.72rem' }}
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontSize: '0.94rem',
                    fontWeight: 600,
                    color: '#fff',
                    marginBottom: '0.25rem',
                    lineHeight: 1.35,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }} title={item.title}>
                    {item.title}
                  </h3>

                  {/* Organization & Date */}
                  {item.organization && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      color: 'var(--color-neon-cyan, #00D9FF)',
                      fontSize: '0.75rem',
                      marginBottom: '0.5rem',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      <Building size={12} style={{ flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.organization}</span>
                      {item.date && (
                        <span style={{ color: 'rgba(245, 248, 255, 0.45)', flexShrink: 0 }}>
                          • {item.date}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Description (Clamped to 2 lines for compact layout) */}
                  <p style={{
                    fontSize: '0.78rem',
                    color: 'rgba(245, 248, 255, 0.65)',
                    lineHeight: 1.45,
                    marginBottom: '0.65rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {item.description}
                  </p>
                </div>

                {/* Footer: Highlights & Links */}
                <div>
                  {highlights.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: link ? '0.5rem' : '0' }}>
                      {highlights.slice(0, 3).map((h) => (
                        <span
                          key={h}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                            fontSize: '0.68rem',
                            color: 'rgba(245, 248, 255, 0.8)',
                            background: 'rgba(2, 8, 23, 0.55)',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px',
                            border: '1px solid rgba(113, 59, 255, 0.22)'
                          }}
                        >
                          <Tag size={9} color="var(--color-violet, #713BFF)" />
                          {h}
                        </span>
                      ))}
                      {highlights.length > 3 && (
                        <span style={{
                          fontSize: '0.65rem',
                          color: 'rgba(245, 248, 255, 0.5)',
                          padding: '0.15rem 0.35rem',
                          alignSelf: 'center'
                        }}>
                          +{highlights.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {link && (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="certificate-link-btn"
                      style={{
                        color: 'var(--color-violet, #A78BFA)',
                        fontSize: '0.74rem',
                        marginTop: '0.35rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        textDecoration: 'none'
                      }}
                    >
                      <ExternalLink size={12} />
                      <span>View Reference</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Details Modal */}
      {isViewModalOpen && viewingItem && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(2, 8, 23, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div className="admin-card" style={{ maxWidth: '580px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="admin-card-header" style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Trophy size={20} color="var(--color-neon-cyan)" />
                <h2 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>Achievement Details</h2>
              </div>
              <button onClick={() => setIsViewModalOpen(false)} className="admin-btn admin-btn-secondary admin-btn-sm">
                <X size={16} />
              </button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <span className="badge badge-violet" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
                {viewingItem.category}
              </span>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.35rem' }}>
                {viewingItem.title}
              </h3>
              {viewingItem.organization && (
                <p style={{ color: 'var(--color-neon-cyan)', fontSize: '0.9rem', fontWeight: 600 }}>
                  {viewingItem.organization} {viewingItem.date ? `• ${viewingItem.date}` : ''}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.78rem', color: 'rgba(245, 248, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                Description
              </div>
              <p style={{ color: 'rgba(245, 248, 255, 0.8)', lineHeight: 1.6, fontSize: '0.9rem' }}>
                {viewingItem.description || 'No description provided.'}
              </p>
            </div>

            {Array.isArray(viewingItem.highlights) && viewingItem.highlights.length > 0 && (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.78rem', color: 'rgba(245, 248, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.45rem' }}>
                  Key Competencies &amp; Highlights
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {viewingItem.highlights.map((h) => (
                    <span
                      key={h}
                      style={{
                        background: 'rgba(113, 59, 255, 0.15)',
                        border: '1px solid rgba(113, 59, 255, 0.35)',
                        color: '#F5F8FF',
                        padding: '0.25rem 0.55rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem'
                      }}
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(viewingItem.link_url || viewingItem.url) && (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.78rem', color: 'rgba(245, 248, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                  Verification / Reference URL
                </div>
                <a
                  href={viewingItem.link_url || viewingItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="certificate-link-btn"
                  style={{ color: 'var(--color-neon-cyan)', fontSize: '0.85rem' }}
                >
                  <ExternalLink size={14} />
                  <span>{viewingItem.link_url || viewingItem.url}</span>
                </a>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid rgba(0, 217, 255, 0.15)', paddingTop: '1rem' }}>
              <button 
                onClick={() => {
                  setIsViewModalOpen(false);
                  openEditModal(viewingItem);
                }} 
                className="admin-btn admin-btn-primary"
              >
                <Edit3 size={15} /> Edit Achievement
              </button>
              <button onClick={() => setIsViewModalOpen(false)} className="admin-btn admin-btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(2, 8, 23, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div className="admin-card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="admin-card-header" style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Trophy size={20} color="var(--color-neon-cyan)" />
                <h2 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>
                  {editingId ? 'Edit Achievement' : 'Add New Achievement'}
                </h2>
              </div>
              <button onClick={closeModal} className="admin-btn admin-btn-secondary admin-btn-sm">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Full-Stack Architecture & Backend Systems Milestone"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Date / Period</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="e.g. 2024 or 2023 - Present"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Organization / Context</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="e.g. Haramaya University or Self-Directed Exploration"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the milestone or achievement..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Verification / Detail URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.link_url}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              {/* Highlights / Tags */}
              <div className="form-group">
                <label className="form-label">Key Highlights / Skills</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                    placeholder="Add a key competency or highlight..."
                  />
                  <button type="button" onClick={handleAddTag} className="admin-btn admin-btn-secondary">
                    Add
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {formData.highlights.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        background: 'rgba(113, 59, 255, 0.15)',
                        border: '1px solid rgba(113, 59, 255, 0.35)',
                        color: '#F5F8FF',
                        padding: '0.25rem 0.55rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      {tag}
                      <X size={12} style={{ cursor: 'pointer' }} onClick={() => handleRemoveTag(tag)} />
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={closeModal} className="admin-btn admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {editingId ? 'Update Achievement' : 'Save Achievement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminAchievementsPage;
