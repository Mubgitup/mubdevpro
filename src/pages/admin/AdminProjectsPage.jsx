import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Briefcase, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Github, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Eye, 
  Search, 
  RefreshCw, 
  X, 
  Upload, 
  Image as ImageIcon, 
  Tag, 
  Globe, 
  Calendar, 
  LayoutGrid, 
  List, 
  Check, 
  Loader2,
  Layers,
  ArrowUpDown,
  Filter,
  CheckCircle,
  Clock
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { PROJECT_CATEGORIES } from '../../data/projectsData';
import { api } from '../../services/api';

const DEFAULT_CATEGORIES = ['Frontend', 'Full-Stack', 'Systems & C++', 'Backend', 'Mobile', 'AI & Data Science', 'DevOps'];

const POPULAR_TECHNOLOGIES = [
  'React', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Node.js', 
  'PHP', 'MySQL', 'Python', 'Django', 'FastAPI', 'C++', 'Tailwind CSS',
  'PostgreSQL', 'MongoDB', 'Docker', 'Git', 'GitHub', 'Next.js', 'Framer Motion'
];

const INITIAL_FORM_STATE = {
  id: null,
  title: '',
  category: 'Frontend',
  short_description: '',
  full_description: '',
  technologies: ['React', 'JavaScript'],
  image_url: '',
  image_file: null,
  image_preview: '',
  github_url: '',
  live_url: '',
  status: 'published',
  badge: 'Portfolio',
  display_order: 0,
  featured: false
};

export const AdminProjectsPage = () => {
  // Data State
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: '' }

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'published' | 'draft'
  const [sortBy, setSortBy] = useState('order'); // 'order' | 'newest' | 'oldest' | 'title'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modals State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create' | 'edit'
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [customTechInput, setCustomTechInput] = useState('');

  // View Details Modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingProject, setViewingProject] = useState(null);

  // Delete Confirmation Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // File input ref
  const fileInputRef = useRef(null);

  // Show temporary toast feedback
  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  // Fetch projects from PHP backend
  const fetchProjects = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await api.projects.listAdmin({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchQuery.trim() || undefined,
        sort: sortBy
      });

      let list = [];
      if (Array.isArray(response?.data)) {
        list = response.data;
      } else if (Array.isArray(response?.data?.projects)) {
        list = response.data.projects;
      } else if (Array.isArray(response?.projects)) {
        list = response.projects;
      }

      setProjects(list);
    } catch (err) {
      console.error('Failed to load projects:', err);
      showFeedback('error', err.message || 'Unable to connect to the backend server.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load and filter change trigger
  useEffect(() => {
    fetchProjects();
  }, [selectedCategory, statusFilter, sortBy]);

  // Debounced search trigger
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProjects();
    }, 350);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = projects.length;
    const published = projects.filter(p => p.status === 'published').length;
    const drafts = projects.filter(p => p.status === 'draft').length;
    const categoriesCount = new Set(projects.map(p => p.category)).size;
    return { total, published, drafts, categoriesCount };
  }, [projects]);

  // Handle Form Open (Create)
  const handleOpenCreateModal = () => {
    setFormMode('create');
    setFormData({
      ...INITIAL_FORM_STATE,
      display_order: projects.length + 1
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Handle Form Open (Edit)
  const handleOpenEditModal = (project) => {
    setFormMode('edit');
    setFormData({
      id: project.id,
      title: project.title || '',
      category: project.category || 'Frontend',
      short_description: project.short_description || project.description || '',
      full_description: project.full_description || '',
      technologies: Array.isArray(project.technologies) ? [...project.technologies] : [],
      image_url: project.image_url || '',
      image_file: null,
      image_preview: project.image_url || '',
      github_url: project.github_url || project.githubUrl || '',
      live_url: project.live_url || project.liveUrl || '',
      status: project.status || 'published',
      badge: project.badge || 'Portfolio',
      display_order: project.display_order ?? 0,
      featured: Boolean(project.featured)
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Handle View Project Details
  const handleOpenViewModal = (project) => {
    setViewingProject(project);
    setIsViewModalOpen(true);
  };

  // Handle Delete Confirmation Open
  const handleOpenDeleteModal = (project) => {
    setDeletingProject(project);
    setIsDeleteModalOpen(true);
  };

  // Handle Quick Toggle Status
  const handleToggleStatus = async (project) => {
    const nextStatus = project.status === 'published' ? 'draft' : 'published';
    try {
      await api.projects.toggleStatus(project.id, nextStatus);
      setProjects(prev => prev.map(p => p.id === project.id ? { ...p, status: nextStatus } : p));
      showFeedback('success', `Project "${project.title}" is now ${nextStatus}.`);
    } catch (err) {
      showFeedback('error', `Failed to update status: ${err.message}`);
    }
  };

  // Handle Image File Selection with Preview
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showFeedback('error', 'Please select a valid image file (PNG, JPG, WEBP, SVG, GIF).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showFeedback('error', 'Image size exceeds 5MB limit. Please choose a smaller file.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      image_file: file,
      image_preview: previewUrl
    }));
  };

  // Remove Selected Image
  const handleRemoveImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFormData(prev => ({
      ...prev,
      image_file: null,
      image_preview: '',
      image_url: ''
    }));
  };

  // Toggle Technology in Array
  const handleToggleTechnology = (tech) => {
    setFormData(prev => {
      const exists = prev.technologies.includes(tech);
      const updated = exists 
        ? prev.technologies.filter(t => t !== tech)
        : [...prev.technologies, tech];
      return { ...prev, technologies: updated };
    });
  };

  // Add Custom Technology Tag
  const handleAddCustomTech = (e) => {
    if (e) e.preventDefault();
    const trimmed = customTechInput.trim();
    if (!trimmed) return;

    if (!formData.technologies.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, trimmed]
      }));
    }
    setCustomTechInput('');
  };

  // Validate Form
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Project title is required.';
    }
    if (!formData.short_description.trim()) {
      errors.short_description = 'Short description is required.';
    }
    if (!formData.category.trim()) {
      errors.category = 'Project category is required.';
    }
    if (formData.technologies.length === 0) {
      errors.technologies = 'Please select or add at least one technology.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Project Form (Create or Update)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showFeedback('error', 'Please fill in all required fields indicated in red.');
      return;
    }

    setSubmitting(true);

    try {
      // Build FormData payload
      const payload = new FormData();
      payload.append('title', formData.title.trim());
      payload.append('category', formData.category.trim());
      payload.append('short_description', formData.short_description.trim());
      payload.append('full_description', formData.full_description.trim());
      payload.append('technologies', JSON.stringify(formData.technologies));
      payload.append('github_url', formData.github_url.trim());
      payload.append('live_url', formData.live_url.trim());
      payload.append('status', formData.status);
      payload.append('badge', formData.badge.trim());
      payload.append('display_order', String(formData.display_order ?? 0));
      payload.append('featured', formData.featured ? '1' : '0');

      if (formData.image_file) {
        payload.append('image', formData.image_file);
      } else if (formData.image_url) {
        payload.append('image_url', formData.image_url);
      }

      if (formMode === 'create') {
        await api.projects.create(payload);
        showFeedback('success', `Project "${formData.title}" created successfully!`);
        setIsFormModalOpen(false);
        fetchProjects();
      } else {
        await api.projects.update(formData.id, payload);
        showFeedback('success', `Project "${formData.title}" updated successfully!`);
        setIsFormModalOpen(false);
        fetchProjects();
      }
    } catch (err) {
      console.error('Project save error:', err);
      showFeedback('error', err.message || 'Failed to save project. Please check backend connection.');
    } finally {
      setSubmitting(false);
    }
  };

  // Perform Project Deletion
  const handleConfirmDelete = async () => {
    if (!deletingProject) return;
    setIsDeleting(true);

    try {
      await api.projects.delete(deletingProject.id);
      showFeedback('success', `Project "${deletingProject.title}" was permanently deleted.`);
      setIsDeleteModalOpen(false);
      setDeletingProject(null);
      fetchProjects();
    } catch (err) {
      console.error('Delete error:', err);
      showFeedback('error', err.message || 'Failed to delete project.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            <Briefcase size={28} color="var(--color-neon-cyan, #00D9FF)" /> Project Management
          </h1>
          <p className="admin-page-subtitle">
            Create, edit, showcase, and manage your full-stack, frontend, and systems portfolio projects.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={() => fetchProjects(true)}
            className="admin-btn admin-btn-secondary"
            title="Refresh projects list"
            disabled={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            <span style={{ marginLeft: '0.35rem' }}>Refresh</span>
          </button>

          <button 
            onClick={handleOpenCreateModal} 
            className="admin-btn admin-btn-primary"
          >
            <Plus size={18} />
            <span style={{ marginLeft: '0.4rem', fontWeight: 600 }}>Add New Project</span>
          </button>
        </div>
      </div>

      {/* Toast Feedback Notification */}
      {feedback && (
        <div style={{
          background: feedback.type === 'success' 
            ? 'rgba(16, 185, 129, 0.15)' 
            : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${feedback.type === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
          color: feedback.type === 'success' ? '#34D399' : '#F87171',
          padding: '0.85rem 1.25rem',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)',
          animation: 'fadeIn 0.2s ease-in-out'
        }}>
          {feedback.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{feedback.message}</span>
        </div>
      )}

      {/* Metrics & Statistics Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div className="admin-card" style={{ padding: '1.1rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'rgba(245, 248, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Projects
            </span>
            <Layers size={18} color="var(--color-neon-cyan, #00D9FF)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginTop: '0.4rem' }}>
            {stats.total}
          </div>
        </div>

        <div className="admin-card" style={{ padding: '1.1rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'rgba(245, 248, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Published Live
            </span>
            <CheckCircle size={18} color="#34D399" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34D399', marginTop: '0.4rem' }}>
            {stats.published}
          </div>
        </div>

        <div className="admin-card" style={{ padding: '1.1rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'rgba(245, 248, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Drafts / Hidden
            </span>
            <Clock size={18} color="#FBBF24" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FBBF24', marginTop: '0.4rem' }}>
            {stats.drafts}
          </div>
        </div>

        <div className="admin-card" style={{ padding: '1.1rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'rgba(245, 248, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Categories Active
            </span>
            <Tag size={18} color="var(--color-electric-blue, #087BFF)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#087BFF', marginTop: '0.4rem' }}>
            {stats.categoriesCount}
          </div>
        </div>
      </div>

      {/* Search, Filter, Sort and View Switcher Toolbar */}
      <div className="admin-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '400px' }}>
            <Search 
              size={18} 
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(245, 248, 255, 0.4)'
              }} 
            />
            <input
              type="text"
              placeholder="Search by title, description, or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-input"
              style={{ paddingLeft: '2.5rem', fontSize: '0.88rem' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(245, 248, 255, 0.5)',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filter by Category */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '0 1 200px' }}>
            <Filter size={16} color="var(--color-neon-cyan, #00D9FF)" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="admin-select"
              style={{ fontSize: '0.88rem', padding: '0.65rem 0.85rem' }}
            >
              <option value="All">All Categories</option>
              {PROJECT_CATEGORIES.filter(c => c !== 'All').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="Backend">Backend</option>
              <option value="Mobile">Mobile</option>
            </select>
          </div>

          {/* Filter by Status */}
          <div style={{ display: 'flex', background: 'rgba(2, 8, 23, 0.6)', padding: '3px', borderRadius: '8px', border: '1px solid rgba(0, 217, 255, 0.2)' }}>
            <button
              onClick={() => setStatusFilter('all')}
              style={{
                background: statusFilter === 'all' ? 'rgba(8, 123, 255, 0.35)' : 'transparent',
                color: statusFilter === 'all' ? '#00D9FF' : 'rgba(245, 248, 255, 0.6)',
                border: 'none',
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              style={{
                background: statusFilter === 'published' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
                color: statusFilter === 'published' ? '#34D399' : 'rgba(245, 248, 255, 0.6)',
                border: 'none',
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Published ({stats.published})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              style={{
                background: statusFilter === 'draft' ? 'rgba(245, 158, 11, 0.25)' : 'transparent',
                color: statusFilter === 'draft' ? '#FBBF24' : 'rgba(245, 248, 255, 0.6)',
                border: 'none',
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Drafts ({stats.drafts})
            </button>
          </div>

          {/* Sort By Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowUpDown size={16} color="rgba(245, 248, 255, 0.6)" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="admin-select"
              style={{ fontSize: '0.88rem', padding: '0.65rem 0.85rem', width: 'auto' }}
            >
              <option value="order">Display Order</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>

          {/* View Switcher (Grid vs Table) */}
          <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(2, 8, 23, 0.6)', padding: '3px', borderRadius: '8px', border: '1px solid rgba(0, 217, 255, 0.2)' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                background: viewMode === 'grid' ? 'rgba(8, 123, 255, 0.35)' : 'transparent',
                color: viewMode === 'grid' ? '#00D9FF' : 'rgba(245, 248, 255, 0.5)',
                border: 'none',
                padding: '0.4rem 0.6rem',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                background: viewMode === 'table' ? 'rgba(8, 123, 255, 0.35)' : 'transparent',
                color: viewMode === 'table' ? '#00D9FF' : 'rgba(245, 248, 255, 0.5)',
                border: 'none',
                padding: '0.4rem 0.6rem',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
              title="Table View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <Loader2 size={36} className="animate-spin" color="var(--color-neon-cyan, #00D9FF)" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'rgba(245, 248, 255, 0.7)' }}>Loading project repository from database...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Briefcase size={48} color="rgba(245, 248, 255, 0.25)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>No Projects Found</h3>
          <p style={{ color: 'rgba(245, 248, 255, 0.6)', maxWidth: '460px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
            {searchQuery || selectedCategory !== 'All' || statusFilter !== 'all'
              ? 'No projects matched your active search or filter criteria. Try resetting filters.'
              : 'Your portfolio currently has no projects registered. Add your first project now!'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            {(searchQuery || selectedCategory !== 'All' || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setStatusFilter('all');
                }}
                className="admin-btn admin-btn-secondary"
              >
                Reset Filters
              </button>
            )}
            <button onClick={handleOpenCreateModal} className="admin-btn admin-btn-primary">
              <Plus size={16} /> Add New Project
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID CARDS VIEW */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {projects.map((project) => {
            const isPublished = project.status === 'published';
            const imageUrl = project.image_url || null;

            return (
              <div 
                key={project.id} 
                className="admin-card" 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  padding: 0,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  border: isPublished 
                    ? '1px solid rgba(0, 217, 255, 0.22)' 
                    : '1px solid rgba(245, 158, 11, 0.25)'
                }}
              >
                {/* Project Image Preview Header */}
                <div style={{
                  height: '160px',
                  width: '100%',
                  position: 'relative',
                  backgroundColor: 'rgba(2, 8, 23, 0.9)',
                  overflow: 'hidden',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={project.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, rgba(8, 123, 255, 0.15) 0%, rgba(113, 59, 255, 0.1) 100%)',
                      gap: '0.4rem'
                    }}>
                      <ImageIcon size={36} color="rgba(0, 217, 255, 0.5)" />
                      <span style={{ fontSize: '0.75rem', color: 'rgba(245, 248, 255, 0.4)', fontFamily: 'var(--font-mono)' }}>
                        No Image Uploaded
                      </span>
                    </div>
                  )}

                  {/* Category Pill Over Image */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    display: 'flex',
                    gap: '0.4rem',
                    zIndex: 2
                  }}>
                    <span style={{
                      background: 'rgba(2, 8, 23, 0.85)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(0, 217, 255, 0.4)',
                      color: '#00D9FF',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '999px',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}>
                      {project.category}
                    </span>

                    {project.badge && (
                      <span style={{
                        background: 'rgba(2, 8, 23, 0.85)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'rgba(245, 248, 255, 0.85)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '999px',
                        fontSize: '0.72rem'
                      }}>
                        {project.badge}
                      </span>
                    )}
                  </div>

                  {/* Status Toggle Button Over Image */}
                  <button
                    onClick={() => handleToggleStatus(project)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: isPublished ? 'rgba(16, 185, 129, 0.9)' : 'rgba(245, 158, 11, 0.9)',
                      border: 'none',
                      color: '#fff',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '999px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                      zIndex: 2
                    }}
                    title={`Click to ${isPublished ? 'unpublish (switch to draft)' : 'publish'}`}
                  >
                    {isPublished ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    {isPublished ? 'Published' : 'Draft'}
                  </button>
                </div>

                {/* Card Body */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                      {project.title}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(245, 248, 255, 0.4)', fontFamily: 'var(--font-mono)' }}>
                      #{project.display_order ?? project.id}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '0.85rem',
                    color: 'rgba(245, 248, 255, 0.7)',
                    lineHeight: 1.5,
                    marginBottom: '1rem',
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {project.short_description || project.description}
                  </p>

                  {/* Technologies Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                    {(Array.isArray(project.technologies) ? project.technologies : []).map(tech => (
                      <span key={tech} style={{
                        background: 'rgba(2, 8, 23, 0.7)',
                        border: '1px solid rgba(0, 217, 255, 0.2)',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        color: 'rgba(245, 248, 255, 0.85)'
                      }}>
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links Row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1.25rem',
                    fontSize: '0.75rem',
                    color: 'rgba(245, 248, 255, 0.5)'
                  }}>
                    {project.github_url || project.githubUrl ? (
                      <a
                        href={project.github_url || project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#00D9FF', textDecoration: 'none' }}
                      >
                        <Github size={14} /> Repository
                      </a>
                    ) : (
                      <span style={{ color: 'rgba(245, 248, 255, 0.3)' }}>No Git link</span>
                    )}

                    <span>•</span>

                    {project.live_url || project.liveUrl ? (
                      <a
                        href={project.live_url || project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#34D399', textDecoration: 'none' }}
                      >
                        <ExternalLink size={14} /> Live Demo
                      </a>
                    ) : (
                      <span style={{ color: 'rgba(245, 248, 255, 0.3)' }}>No live demo</span>
                    )}
                  </div>

                  {/* Action Buttons Toolbar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.85rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => handleOpenViewModal(project)}
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        title="View Full Project Details"
                      >
                        <Eye size={14} />
                        <span style={{ marginLeft: '0.3rem' }}>View</span>
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(project)}
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        title="Edit Project"
                      >
                        <Edit3 size={14} />
                        <span style={{ marginLeft: '0.3rem' }}>Edit</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleOpenDeleteModal(project)}
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      title="Delete Project"
                    >
                      <Trash2 size={14} />
                      <span style={{ marginLeft: '0.3rem' }}>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Thumbnail</th>
                  <th>Title & Description</th>
                  <th>Category</th>
                  <th>Technologies</th>
                  <th>Status</th>
                  <th>Links</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => {
                  const isPublished = project.status === 'published';
                  const imageUrl = project.image_url || null;

                  return (
                    <tr key={project.id}>
                      <td>
                        <div style={{
                          width: '48px',
                          height: '40px',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          background: 'rgba(2, 8, 23, 0.8)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {imageUrl ? (
                            <img src={imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <ImageIcon size={18} color="rgba(0, 217, 255, 0.4)" />
                          )}
                        </div>
                      </td>
                      <td style={{ minWidth: '220px' }}>
                        <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.92rem' }}>
                          {project.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'rgba(245, 248, 255, 0.6)', marginTop: '0.2rem' }}>
                          {project.short_description || project.description}
                        </div>
                      </td>
                      <td>
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
                      </td>
                      <td style={{ maxWidth: '240px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                          {(Array.isArray(project.technologies) ? project.technologies : []).slice(0, 3).map(tech => (
                            <span key={tech} style={{
                              background: 'rgba(2, 8, 23, 0.6)',
                              padding: '0.15rem 0.45rem',
                              borderRadius: '4px',
                              fontSize: '0.7rem',
                              color: 'rgba(245, 248, 255, 0.8)'
                            }}>
                              {tech}
                            </span>
                          ))}
                          {(project.technologies?.length || 0) > 3 && (
                            <span style={{ fontSize: '0.7rem', color: 'rgba(245, 248, 255, 0.5)' }}>
                              +{project.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleStatus(project)}
                          style={{
                            background: isPublished ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            border: `1px solid ${isPublished ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
                            color: isPublished ? '#34D399' : '#FBBF24',
                            padding: '0.25rem 0.6rem',
                            borderRadius: '999px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}
                        >
                          {isPublished ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                          {isPublished ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {project.github_url && (
                            <a href={project.github_url} target="_blank" rel="noreferrer" style={{ color: 'rgba(245, 248, 255, 0.7)' }} title="GitHub">
                              <Github size={15} />
                            </a>
                          )}
                          {project.live_url && (
                            <a href={project.live_url} target="_blank" rel="noreferrer" style={{ color: '#00D9FF' }} title="Live Preview">
                              <ExternalLink size={15} />
                            </a>
                          )}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                          <button
                            onClick={() => handleOpenViewModal(project)}
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            title="View Details"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(project)}
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            title="Edit"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(project)}
                            className="admin-btn admin-btn-danger admin-btn-sm"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          ADD / EDIT PROJECT MODAL DIALOG
      ======================================================== */}
      {isFormModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(2, 8, 23, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(7, 27, 61, 0.98)',
            border: '1px solid rgba(0, 217, 255, 0.35)',
            borderRadius: '16px',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(0, 217, 255, 0.2)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid rgba(0, 217, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(2, 8, 23, 0.5)'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Briefcase size={20} color="var(--color-neon-cyan, #00D9FF)" />
                {formMode === 'create' ? 'Add New Portfolio Project' : `Edit: ${formData.title}`}
              </h3>
              <button
                onClick={() => setIsFormModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(245, 248, 255, 0.6)',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body / Scrollable Form */}
            <form onSubmit={handleSubmitForm} style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Project Title */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(245, 248, 255, 0.9)', marginBottom: '0.4rem' }}>
                  Project Title <span style={{ color: '#F87171' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Modern Full-Stack E-Commerce Platform"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="admin-input"
                  style={{
                    borderColor: formErrors.title ? '#F87171' : undefined
                  }}
                />
                {formErrors.title && (
                  <p style={{ color: '#F87171', fontSize: '0.78rem', marginTop: '0.3rem' }}>{formErrors.title}</p>
                )}
              </div>

              {/* Category & Badge Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(245, 248, 255, 0.9)', marginBottom: '0.4rem' }}>
                    Category <span style={{ color: '#F87171' }}>*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="admin-select"
                  >
                    {DEFAULT_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(245, 248, 255, 0.9)', marginBottom: '0.4rem' }}>
                    Badge / Tagline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Featured, Academic Practice, Portfolio"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(245, 248, 255, 0.9)', marginBottom: '0.4rem' }}>
                  Short Summary / Card Description <span style={{ color: '#F87171' }}>*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief synopsis highlighting key features and problem solved..."
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="admin-textarea"
                  style={{
                    borderColor: formErrors.short_description ? '#F87171' : undefined
                  }}
                />
                {formErrors.short_description && (
                  <p style={{ color: '#F87171', fontSize: '0.78rem', marginTop: '0.3rem' }}>{formErrors.short_description}</p>
                )}
              </div>

              {/* Full Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(245, 248, 255, 0.9)', marginBottom: '0.4rem' }}>
                  Full In-Depth Description (Optional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Comprehensive technical details, architecture overview, challenges solved, and methodologies used..."
                  value={formData.full_description}
                  onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                  className="admin-textarea"
                />
              </div>

              {/* Image Upload & Live Preview Section */}
              <div style={{
                background: 'rgba(2, 8, 23, 0.45)',
                border: '1px dashed rgba(0, 217, 255, 0.3)',
                borderRadius: '12px',
                padding: '1.25rem'
              }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(245, 248, 255, 0.9)', marginBottom: '0.75rem' }}>
                  Project Thumbnail / Screenshot
                </label>

                {/* Preview Box */}
                {formData.image_preview ? (
                  <div style={{ position: 'relative', height: '170px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem', border: '1px solid rgba(0, 217, 255, 0.4)' }}>
                    <img
                      src={formData.image_preview}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'rgba(239, 68, 68, 0.85)',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '6px',
                        padding: '0.35rem 0.6rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <Trash2 size={13} /> Remove Image
                    </button>
                  </div>
                ) : null}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="project-file-upload"
                  />
                  <label
                    htmlFor="project-file-upload"
                    className="admin-btn admin-btn-secondary"
                    style={{ cursor: 'pointer', margin: 0 }}
                  >
                    <Upload size={16} />
                    <span style={{ marginLeft: '0.4rem' }}>Choose File from Computer</span>
                  </label>

                  <span style={{ fontSize: '0.78rem', color: 'rgba(245, 248, 255, 0.4)' }}>
                    (Supports PNG, JPG, WEBP, SVG up to 5MB)
                  </span>
                </div>

                <div style={{ marginTop: '0.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(245, 248, 255, 0.5)', marginBottom: '0.25rem' }}>
                    Or enter external Image URL:
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/project-screenshot.png"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      image_url: e.target.value,
                      image_preview: e.target.value || formData.image_preview
                    })}
                    className="admin-input"
                    style={{ fontSize: '0.82rem', padding: '0.5rem 0.85rem' }}
                  />
                </div>
              </div>

              {/* Technologies Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(245, 248, 255, 0.9)', marginBottom: '0.4rem' }}>
                  Technologies Used <span style={{ color: '#F87171' }}>*</span>
                </label>
                
                {/* Popular Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  {POPULAR_TECHNOLOGIES.map(tech => {
                    const isSelected = formData.technologies.includes(tech);
                    return (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => handleToggleTechnology(tech)}
                        style={{
                          background: isSelected ? 'rgba(8, 123, 255, 0.35)' : 'rgba(2, 8, 23, 0.6)',
                          border: `1px solid ${isSelected ? 'rgba(0, 217, 255, 0.6)' : 'rgba(255, 255, 255, 0.12)'}`,
                          color: isSelected ? '#00D9FF' : 'rgba(245, 248, 255, 0.7)',
                          padding: '0.3rem 0.65rem',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: isSelected ? 600 : 400,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {isSelected && <Check size={12} />}
                        {tech}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Tech Tag Adder */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Add custom tech tag (e.g. Redux, GraphQL, Redis)..."
                    value={customTechInput}
                    onChange={(e) => setCustomTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomTech();
                      }
                    }}
                    className="admin-input"
                    style={{ fontSize: '0.85rem' }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTech}
                    className="admin-btn admin-btn-secondary"
                  >
                    Add
                  </button>
                </div>

                {/* Selected Tags Display */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem' }}>
                  {formData.technologies.map(tech => (
                    <span
                      key={tech}
                      style={{
                        background: 'rgba(0, 217, 255, 0.15)',
                        border: '1px solid rgba(0, 217, 255, 0.4)',
                        color: '#00D9FF',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      {tech}
                      <X
                        size={12}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleToggleTechnology(tech)}
                      />
                    </span>
                  ))}
                </div>
                {formErrors.technologies && (
                  <p style={{ color: '#F87171', fontSize: '0.78rem', marginTop: '0.3rem' }}>{formErrors.technologies}</p>
                )}
              </div>

              {/* GitHub & Live Demo Links */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(245, 248, 255, 0.9)', marginBottom: '0.4rem' }}>
                    GitHub Repository URL
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Github size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(245, 248, 255, 0.4)' }} />
                    <input
                      type="url"
                      placeholder="https://github.com/mubdev/project"
                      value={formData.github_url}
                      onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                      className="admin-input"
                      style={{ paddingLeft: '2.4rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(245, 248, 255, 0.9)', marginBottom: '0.4rem' }}>
                    Live Demo URL
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Globe size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(245, 248, 255, 0.4)' }} />
                    <input
                      type="url"
                      placeholder="https://example.com or #hero"
                      value={formData.live_url}
                      onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                      className="admin-input"
                      style={{ paddingLeft: '2.4rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* Status & Display Order */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(245, 248, 255, 0.9)', marginBottom: '0.4rem' }}>
                    Publication Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="admin-select"
                  >
                    <option value="published">Published (Visible on Website)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(245, 248, 255, 0.9)', marginBottom: '0.4rem' }}>
                    Display Order (Priority)
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="admin-input"
                    min={0}
                  />
                </div>
              </div>

              {/* Form Action Buttons */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '0.85rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                marginTop: '0.5rem'
              }}>
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="admin-btn admin-btn-secondary"
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={submitting}
                  style={{ minWidth: '140px', justifyContent: 'center' }}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span style={{ marginLeft: '0.4rem' }}>Saving...</span>
                    </>
                  ) : (
                    <span>{formMode === 'create' ? 'Save Project' : 'Update Project'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW PROJECT DETAILS MODAL
      ======================================================== */}
      {isViewModalOpen && viewingProject && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(2, 8, 23, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(7, 27, 61, 0.98)',
            border: '1px solid rgba(0, 217, 255, 0.35)',
            borderRadius: '16px',
            maxWidth: '650px',
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
            overflow: 'hidden'
          }}>
            {/* Header with image */}
            <div style={{
              position: 'relative',
              height: '200px',
              backgroundColor: 'rgba(2, 8, 23, 0.9)',
              borderBottom: '1px solid rgba(0, 217, 255, 0.2)'
            }}>
              {viewingProject.image_url ? (
                <img
                  src={viewingProject.image_url}
                  alt={viewingProject.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(8, 123, 255, 0.2) 0%, rgba(113, 59, 255, 0.15) 100%)'
                }}>
                  <ImageIcon size={48} color="rgba(0, 217, 255, 0.5)" />
                </div>
              )}

              <button
                onClick={() => setIsViewModalOpen(false)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(2, 8, 23, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>

              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '16px',
                display: 'flex',
                gap: '0.5rem',
                zIndex: 2
              }}>
                <span style={{
                  background: 'rgba(2, 8, 23, 0.9)',
                  border: '1px solid rgba(0, 217, 255, 0.5)',
                  color: '#00D9FF',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 700
                }}>
                  {viewingProject.category}
                </span>

                <span style={{
                  background: viewingProject.status === 'published' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(245, 158, 11, 0.9)',
                  color: '#fff',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 700
                }}>
                  {viewingProject.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: '0 0 0.5rem 0' }}>
                  {viewingProject.title}
                </h2>
                {viewingProject.badge && (
                  <span style={{ fontSize: '0.8rem', color: 'rgba(245, 248, 255, 0.6)' }}>
                    Tagline: {viewingProject.badge}
                  </span>
                )}
              </div>

              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'rgba(245, 248, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  Summary
                </h4>
                <p style={{ color: 'rgba(245, 248, 255, 0.9)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  {viewingProject.short_description || viewingProject.description}
                </p>
              </div>

              {viewingProject.full_description && (
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'rgba(245, 248, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                    Full Technical Details
                  </h4>
                  <p style={{ color: 'rgba(245, 248, 255, 0.8)', lineHeight: 1.6, fontSize: '0.9rem', whiteSpace: 'pre-line' }}>
                    {viewingProject.full_description}
                  </p>
                </div>
              )}

              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'rgba(245, 248, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Technologies & Frameworks
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {(Array.isArray(viewingProject.technologies) ? viewingProject.technologies : []).map(tech => (
                    <span
                      key={tech}
                      style={{
                        background: 'rgba(2, 8, 23, 0.8)',
                        border: '1px solid rgba(0, 217, 255, 0.3)',
                        color: '#00D9FF',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons in View Modal */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '1.25rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {viewingProject.github_url && (
                    <a
                      href={viewingProject.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="admin-btn admin-btn-secondary"
                    >
                      <Github size={16} />
                      <span style={{ marginLeft: '0.4rem' }}>GitHub Code</span>
                    </a>
                  )}

                  {viewingProject.live_url && (
                    <a
                      href={viewingProject.live_url}
                      target="_blank"
                      rel="noreferrer"
                      className="admin-btn admin-btn-primary"
                    >
                      <ExternalLink size={16} />
                      <span style={{ marginLeft: '0.4rem' }}>Live Demo</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleOpenEditModal(viewingProject);
                  }}
                  className="admin-btn admin-btn-secondary"
                >
                  <Edit3 size={16} />
                  <span style={{ marginLeft: '0.4rem' }}>Edit Project</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          DELETE CONFIRMATION MODAL DIALOG
      ======================================================== */}
      {isDeleteModalOpen && deletingProject && (
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
          padding: '1rem',
          zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(7, 27, 61, 0.98)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '16px',
            maxWidth: '480px',
            width: '100%',
            padding: '1.75rem',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(239, 68, 68, 0.2)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              color: '#F87171'
            }}>
              <Trash2 size={24} />
            </div>

            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>
              Delete Project?
            </h3>

            <p style={{ color: 'rgba(245, 248, 255, 0.7)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Are you sure you want to permanently delete <strong style={{ color: '#fff' }}>"{deletingProject.title}"</strong>? 
              This will remove the project record and its associated uploaded files from the database and disk.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="admin-btn admin-btn-secondary"
                disabled={isDeleting}
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                className="admin-btn admin-btn-danger"
                disabled={isDeleting}
                style={{ minWidth: '130px', justifyContent: 'center' }}
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span style={{ marginLeft: '0.4rem' }}>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProjectsPage;
