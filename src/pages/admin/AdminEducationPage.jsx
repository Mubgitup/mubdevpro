import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Eye, 
  Search, 
  RefreshCw, 
  X, 
  Upload, 
  Calendar, 
  MapPin, 
  BookOpen, 
  Award, 
  Clock, 
  ArrowUpDown, 
  LayoutGrid, 
  List, 
  Check, 
  Loader2,
  Tag,
  Briefcase
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { JOURNEY_MILESTONES } from '../../data/journeyData';
import { api } from '../../services/api';

const EDUCATION_TYPES = [
  'Formal Degree Education',
  'Skill Development',
  'Applied Experience',
  'Professional Coursework',
  'Academic Milestone',
  'Certification'
];

const STATUS_PRESETS = [
  'Current Academic Standing',
  'In Progress / Current',
  'Continuous',
  'Completed Milestone'
];

const INITIAL_FORM_STATE = {
  id: null,
  institution: '',
  degree: '',
  field_of_study: '',
  description: '',
  start_date: '',
  end_date: '',
  is_current: false,
  status: 'In Progress / Current',
  type: 'Formal Degree Education',
  location: '',
  image_url: '',
  image_file: null,
  image_preview: '',
  highlights: [],
  display_order: 0
};

export const AdminEducationPage = () => {
  // Data State
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: '' }

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'current' | 'completed'
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('order'); // 'order' | 'newest' | 'oldest' | 'institution'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Form Modal State (Add / Edit)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create' | 'edit'
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [customHighlightInput, setCustomHighlightInput] = useState('');

  // View Details Modal State
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingRecord, setViewingRecord] = useState(null);

  // Delete Confirmation Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef(null);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  // Fetch records from PHP backend API
  const fetchEducation = async (showIndicator = false) => {
    if (showIndicator) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await api.education.list({
        search: searchQuery.trim() || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        sort: sortBy
      });

      let list = [];
      if (Array.isArray(response?.data)) {
        list = response.data;
      } else if (Array.isArray(response?.education)) {
        list = response.education;
      } else if (Array.isArray(response?.data?.education)) {
        list = response.data.education;
      }

      setEducationList(list);
    } catch (err) {
      console.error('Failed to load education records:', err);
      showFeedback('error', err.message || 'Unable to reach backend API. Showing cached timeline.');
      // If empty on network failure, provide journey data fallback
      if (educationList.length === 0) {
        setEducationList(JOURNEY_MILESTONES);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load and filter change trigger
  useEffect(() => {
    fetchEducation();
  }, [statusFilter, typeFilter, sortBy]);

  // Debounced search trigger
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchEducation();
    }, 350);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = educationList.length;
    const currentCount = educationList.filter(e => e.is_current).length;
    const completedCount = educationList.filter(e => !e.is_current).length;
    const formalDegrees = educationList.filter(e => e.type === 'Formal Degree Education').length;
    return { total, currentCount, completedCount, formalDegrees };
  }, [educationList]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setFormMode('create');
    setFormData({
      ...INITIAL_FORM_STATE,
      display_order: educationList.length + 1
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open Edit Modal (Pre-populate with existing values)
  const handleOpenEditModal = (record) => {
    setFormMode('edit');
    setFormData({
      id: record.id,
      institution: record.institution || record.organization || '',
      degree: record.degree || record.title || '',
      field_of_study: record.field_of_study || '',
      description: record.description || '',
      start_date: record.start_date || '',
      end_date: record.end_date || (record.is_current ? 'Present' : ''),
      is_current: Boolean(record.is_current),
      status: record.status || (record.is_current ? 'In Progress / Current' : 'Completed Milestone'),
      type: record.type || 'Formal Degree Education',
      location: record.location || '',
      image_url: record.image_url || '',
      image_file: null,
      image_preview: record.image_url || '',
      highlights: Array.isArray(record.highlights) ? [...record.highlights] : [],
      display_order: record.display_order ?? 0
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open View Modal
  const handleOpenViewModal = (record) => {
    setViewingRecord(record);
    setIsViewModalOpen(true);
  };

  // Open Delete Confirmation Modal
  const handleOpenDeleteModal = (record) => {
    setDeletingRecord(record);
    setIsDeleteModalOpen(true);
  };

  // Handle Highlights Tag Add
  const handleAddHighlight = (e) => {
    if (e) e.preventDefault();
    const trimmed = customHighlightInput.trim();
    if (!trimmed) return;

    if (!formData.highlights.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, trimmed]
      }));
    }
    setCustomHighlightInput('');
  };

  // Handle Highlights Tag Remove
  const handleRemoveHighlight = (itemToRemove) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter(h => h !== itemToRemove)
    }));
  };

  // Handle Image Upload
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showFeedback('error', 'Please select a valid image file (PNG, JPG, WEBP, SVG, GIF).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showFeedback('error', 'Image size exceeds 5MB limit.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      image_file: file,
      image_preview: previewUrl
    }));
  };

  // Remove Image
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

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.institution.trim()) {
      errors.institution = 'Institution or organization name is required.';
    }
    if (!formData.degree.trim()) {
      errors.degree = 'Degree or qualification title is required.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Form Submission (Create or Update)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showFeedback('error', 'Please complete the required fields indicated in red.');
      return;
    }

    setSubmitting(true);

    try {
      // Use FormData to cleanly support optional image uploads
      const payload = new FormData();
      payload.append('institution', formData.institution.trim());
      payload.append('degree', formData.degree.trim());
      payload.append('field_of_study', formData.field_of_study.trim());
      payload.append('description', formData.description.trim());
      payload.append('start_date', formData.start_date.trim());
      payload.append('end_date', formData.is_current ? 'Present' : formData.end_date.trim());
      payload.append('is_current', formData.is_current ? '1' : '0');
      payload.append('status', formData.status.trim());
      payload.append('type', formData.type.trim());
      payload.append('location', formData.location.trim());
      payload.append('highlights', JSON.stringify(formData.highlights));
      payload.append('display_order', String(formData.display_order ?? 0));

      if (formData.image_file) {
        payload.append('image', formData.image_file);
      } else if (formData.image_url) {
        payload.append('image_url', formData.image_url);
      }

      if (formMode === 'create') {
        await api.education.create(payload);
        showFeedback('success', `Education milestone "${formData.degree}" created successfully!`);
      } else {
        await api.education.update(formData.id, payload);
        showFeedback('success', `Education milestone "${formData.degree}" updated successfully!`);
      }

      setIsFormModalOpen(false);
      fetchEducation();
    } catch (err) {
      console.error('Education save error:', err);
      showFeedback('error', err.message || 'Failed to save education record.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingRecord) return;
    setIsDeleting(true);

    try {
      await api.education.delete(deletingRecord.id);
      showFeedback('success', `Education record "${deletingRecord.degree || deletingRecord.title}" was removed.`);
      setIsDeleteModalOpen(false);
      setDeletingRecord(null);
      fetchEducation();
    } catch (err) {
      console.error('Delete error:', err);
      showFeedback('error', err.message || 'Failed to delete record.');
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
            <GraduationCap size={28} color="var(--color-neon-cyan, #00D9FF)" /> Education & Journey Management
          </h1>
          <p className="admin-page-subtitle">
            Manage your formal degrees, university coursework, continuous learning milestones, and technical qualifications.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={() => fetchEducation(true)}
            className="admin-btn admin-btn-secondary"
            title="Refresh education list"
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
            <span style={{ marginLeft: '0.4rem', fontWeight: 600 }}>Add Education</span>
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
              Total Milestones
            </span>
            <BookOpen size={18} color="var(--color-neon-cyan, #00D9FF)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginTop: '0.4rem' }}>
            {stats.total}
          </div>
        </div>

        <div className="admin-card" style={{ padding: '1.1rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'rgba(245, 248, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Currently Studying
            </span>
            <Clock size={18} color="#34D399" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34D399', marginTop: '0.4rem' }}>
            {stats.currentCount}
          </div>
        </div>

        <div className="admin-card" style={{ padding: '1.1rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'rgba(245, 248, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Completed
            </span>
            <Award size={18} color="#00D9FF" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#00D9FF', marginTop: '0.4rem' }}>
            {stats.completedCount}
          </div>
        </div>

        <div className="admin-card" style={{ padding: '1.1rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'rgba(245, 248, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Formal Degrees
            </span>
            <GraduationCap size={18} color="var(--color-electric-blue, #087BFF)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#087BFF', marginTop: '0.4rem' }}>
            {stats.formalDegrees}
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
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '380px' }}>
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
              placeholder="Search institution, degree, field of study..."
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

          {/* Status Filter Tabs */}
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
              onClick={() => setStatusFilter('current')}
              style={{
                background: statusFilter === 'current' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
                color: statusFilter === 'current' ? '#34D399' : 'rgba(245, 248, 255, 0.6)',
                border: 'none',
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Currently Studying ({stats.currentCount})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              style={{
                background: statusFilter === 'completed' ? 'rgba(0, 217, 255, 0.25)' : 'transparent',
                color: statusFilter === 'completed' ? '#00D9FF' : 'rgba(245, 248, 255, 0.6)',
                border: 'none',
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Completed ({stats.completedCount})
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
              <option value="institution">Institution (A-Z)</option>
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
              title="Grid Cards View"
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
          <p style={{ color: 'rgba(245, 248, 255, 0.7)' }}>Loading education records from database...</p>
        </div>
      ) : educationList.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <GraduationCap size={48} color="rgba(245, 248, 255, 0.25)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>No Education Records Found</h3>
          <p style={{ color: 'rgba(245, 248, 255, 0.6)', maxWidth: '460px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
            {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'No education milestones matched your active search or filter criteria. Try resetting filters.'
              : 'Your education timeline currently has no records. Add your first academic milestone now!'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            {(searchQuery || statusFilter !== 'all' || typeFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setTypeFilter('all');
                }}
                className="admin-btn admin-btn-secondary"
              >
                Reset Filters
              </button>
            )}
            <button onClick={handleOpenCreateModal} className="admin-btn admin-btn-primary">
              <Plus size={16} /> Add Education Record
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID CARDS VIEW */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {educationList.map((record) => {
            const institutionName = record.institution || record.organization;
            const degreeTitle = record.degree || record.title;
            const isCurrent = Boolean(record.is_current);

            return (
              <div 
                key={record.id} 
                className="admin-card"
                style={{
                  border: isCurrent 
                    ? '1px solid rgba(16, 185, 129, 0.35)' 
                    : '1px solid rgba(0, 217, 255, 0.2)'
                }}
              >
                {/* Header Row */}
                <div className="admin-card-header" style={{ alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <span style={{
                        background: 'rgba(8, 123, 255, 0.15)',
                        border: '1px solid rgba(0, 217, 255, 0.3)',
                        color: '#00D9FF',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 600
                      }}>
                        {record.type || 'Formal Degree Education'}
                      </span>

                      <span style={{
                        background: isCurrent ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                        border: `1px solid ${isCurrent ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.15)'}`,
                        color: isCurrent ? '#34D399' : 'rgba(245, 248, 255, 0.7)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}>
                        {isCurrent ? <Clock size={11} /> : <CheckCircle2 size={11} />}
                        {record.status || (isCurrent ? 'Currently Studying' : 'Completed')}
                      </span>

                      <span style={{ fontSize: '0.75rem', color: 'rgba(245, 248, 255, 0.4)', fontFamily: 'var(--font-mono)' }}>
                        Priority #{record.display_order ?? record.id}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
                      {degreeTitle}
                    </h3>

                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.85rem', fontSize: '0.85rem', color: 'rgba(245, 248, 255, 0.7)' }}>
                      <span style={{ color: 'var(--color-neon-cyan, #00D9FF)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <GraduationCap size={15} /> {institutionName}
                      </span>

                      {record.field_of_study && (
                        <span>• {record.field_of_study}</span>
                      )}

                      {(record.start_date || record.end_date) && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'rgba(245, 248, 255, 0.5)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                          <Calendar size={13} /> {record.start_date || 'Start'} — {record.end_date || (isCurrent ? 'Present' : 'End')}
                        </span>
                      )}

                      {record.location && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'rgba(245, 248, 255, 0.5)', fontSize: '0.8rem' }}>
                          <MapPin size={13} /> {record.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Top Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => handleOpenViewModal(record)}
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      title="View Details"
                    >
                      <Eye size={14} />
                      <span style={{ marginLeft: '0.3rem' }}>View</span>
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(record)}
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      title="Edit Record"
                    >
                      <Edit3 size={14} />
                      <span style={{ marginLeft: '0.3rem' }}>Edit</span>
                    </button>

                    <button
                      onClick={() => handleOpenDeleteModal(record)}
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      title="Delete Record"
                    >
                      <Trash2 size={14} />
                      <span style={{ marginLeft: '0.3rem' }}>Delete</span>
                    </button>
                  </div>
                </div>

                {/* Description Body */}
                <p style={{
                  fontSize: '0.9rem',
                  color: 'rgba(245, 248, 255, 0.8)',
                  lineHeight: 1.6,
                  marginTop: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  {record.description}
                </p>

                {/* Highlights Tags */}
                {Array.isArray(record.highlights) && record.highlights.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    {record.highlights.map(h => (
                      <span key={h} style={{
                        background: 'rgba(7, 27, 61, 0.7)',
                        border: '1px solid rgba(0, 217, 255, 0.22)',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        color: '#F5F8FF',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}>
                        <Check size={12} color="#00D9FF" /> {h}
                      </span>
                    ))}
                  </div>
                )}
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
                  <th>Degree / Qualification</th>
                  <th>Institution</th>
                  <th>Timeline</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {educationList.map((record) => {
                  const institutionName = record.institution || record.organization;
                  const degreeTitle = record.degree || record.title;
                  const isCurrent = Boolean(record.is_current);

                  return (
                    <tr key={record.id}>
                      <td style={{ minWidth: '220px' }}>
                        <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.92rem' }}>
                          {degreeTitle}
                        </div>
                        {record.field_of_study && (
                          <div style={{ fontSize: '0.78rem', color: 'rgba(245, 248, 255, 0.6)', marginTop: '0.2rem' }}>
                            {record.field_of_study}
                          </div>
                        )}
                      </td>
                      <td style={{ minWidth: '180px', color: 'var(--color-neon-cyan, #00D9FF)', fontWeight: 500 }}>
                        {institutionName}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'rgba(245, 248, 255, 0.7)', whiteSpace: 'nowrap' }}>
                        {record.start_date || 'Start'} — {record.end_date || (isCurrent ? 'Present' : 'End')}
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
                          {record.type || 'Formal Degree'}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          background: isCurrent ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                          border: `1px solid ${isCurrent ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.15)'}`,
                          color: isCurrent ? '#34D399' : 'rgba(245, 248, 255, 0.7)',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '999px',
                          fontSize: '0.72rem',
                          fontWeight: 600
                        }}>
                          {record.status || (isCurrent ? 'Currently Studying' : 'Completed')}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                          <button
                            onClick={() => handleOpenViewModal(record)}
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            title="View Details"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(record)}
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            title="Edit"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(record)}
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
          ADD / EDIT EDUCATION MODAL DIALOG
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
                <GraduationCap size={20} color="var(--color-neon-cyan, #00D9FF)" />
                {formMode === 'create' ? 'Add Education & Journey Milestone' : `Edit: ${formData.degree}`}
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
              
              {/* Institution Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(245, 248, 255, 0.9)', marginBottom: '0.4rem' }}>
                  Institution / Organization Name <span style={{ color: '#F87171' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Haramaya University, Udacity, Self-Directed"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="admin-input"
                  style={{
                    borderColor: formErrors.institution ? '#F87171' : undefined
                  }}
                />
                {formErrors.institution && (
                  <p style={{ color: '#F87171', fontSize: '0.78rem', marginTop: '0.3rem' }}>{formErrors.institution}</p>
                )}
              </div>

              {/* Degree / Qualification */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(245, 248, 255, 0.9)', marginBottom: '0.4rem' }}>
                  Degree / Qualification / Program Title <span style={{ color: '#F87171' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Third-Year Software Engineering Studies, B.Sc. in Computer Science"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="admin-input"
                  style={{
                    borderColor: formErrors.degree ? '#F87171' : undefined
                  }}
                />
                {formErrors.degree && (
                  <p style={{ color: '#F87171', fontSize: '0.78rem', marginTop: '0.3rem' }}>{formErrors.degree}</p>
                )}
              </div>

              {/* Field of Study & Location */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(245, 248, 255, 0.9)', marginBottom: '0.4rem' }}>
                    Field of Study / Major
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineering, Web Development"
                    value={formData.field_of_study}
                    onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
                    className="admin-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(245, 248, 255, 0.9)', marginBottom: '0.4rem' }}>
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dire Dawa, Ethiopia / Remote"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              {/* Type & Status Preset */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(245, 248, 255, 0.9)', marginBottom: '0.4rem' }}>
                    Education Category / Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="admin-select"
                  >
                    {EDUCATION_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(245, 248, 255, 0.9)', marginBottom: '0.4rem' }}>
                    Status Tagline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Current Academic Standing, Completed"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="admin-input"
                    list="status-presets"
                  />
                  <datalist id="status-presets">
                    {STATUS_PRESETS.map(s => <option key={s} value={s} />)}
                  </datalist>
                </div>
              </div>

              {/* Start Date, End Date & Currently Studying */}
              <div style={{
                background: 'rgba(2, 8, 23, 0.45)',
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid rgba(0, 217, 255, 0.2)'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(245, 248, 255, 0.85)', marginBottom: '0.35rem' }}>
                      Start Date
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2022 or Oct 2022"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="admin-input"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(245, 248, 255, 0.85)', marginBottom: '0.35rem' }}>
                      End Date {formData.is_current ? '(Present)' : ''}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2026 or Present"
                      value={formData.is_current ? 'Present' : formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      disabled={formData.is_current}
                      className="admin-input"
                      style={{ opacity: formData.is_current ? 0.6 : 1 }}
                    />
                  </div>
                </div>

                {/* Currently Studying Checkbox */}
                <label style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  color: formData.is_current ? '#34D399' : 'rgba(245, 248, 255, 0.85)',
                  fontWeight: 600,
                  marginTop: '0.25rem'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.is_current}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setFormData(prev => ({
                        ...prev,
                        is_current: checked,
                        end_date: checked ? 'Present' : (prev.end_date === 'Present' ? '' : prev.end_date)
                      }));
                    }}
                    style={{ width: '18px', height: '18px', accentColor: '#00D9FF' }}
                  />
                  Currently enrolled / in progress
                </label>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(245, 248, 255, 0.9)', marginBottom: '0.4rem' }}>
                  Milestone Description & Coursework Highlights
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail coursework covered, key technical principles learned, or research achievements..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="admin-textarea"
                />
              </div>

              {/* Highlights & Key Topics Adder */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(245, 248, 255, 0.9)', marginBottom: '0.4rem' }}>
                  Key Course Topics & Skills Acquired
                </label>
                
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                  <input
                    type="text"
                    placeholder="Add topic (e.g. Object-Oriented Design, C++, Data Structures)..."
                    value={customHighlightInput}
                    onChange={(e) => setCustomHighlightInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddHighlight();
                      }
                    }}
                    className="admin-input"
                    style={{ fontSize: '0.85rem' }}
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="admin-btn admin-btn-secondary"
                  >
                    Add
                  </button>
                </div>

                {/* Display Current Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {formData.highlights.map(h => (
                    <span
                      key={h}
                      style={{
                        background: 'rgba(0, 217, 255, 0.15)',
                        border: '1px solid rgba(0, 217, 255, 0.4)',
                        color: '#00D9FF',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '999px',
                        fontSize: '0.78rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      {h}
                      <X
                        size={12}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleRemoveHighlight(h)}
                      />
                    </span>
                  ))}
                </div>
              </div>

              {/* Display Order */}
              <div style={{ maxWidth: '200px' }}>
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
                  style={{ minWidth: '150px', justifyContent: 'center' }}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span style={{ marginLeft: '0.4rem' }}>Saving...</span>
                    </>
                  ) : (
                    <span>{formMode === 'create' ? 'Save Education' : 'Update Education'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW EDUCATION DETAILS MODAL
      ======================================================== */}
      {isViewModalOpen && viewingRecord && (
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
            maxWidth: '620px',
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <GraduationCap size={22} color="var(--color-neon-cyan, #00D9FF)" />
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Education Record Details</span>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
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

            {/* Modal Content */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{
                    background: 'rgba(8, 123, 255, 0.15)',
                    border: '1px solid rgba(0, 217, 255, 0.3)',
                    color: '#00D9FF',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    {viewingRecord.type}
                  </span>

                  <span style={{
                    background: viewingRecord.is_current ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                    color: viewingRecord.is_current ? '#34D399' : 'rgba(245, 248, 255, 0.8)',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    {viewingRecord.status}
                  </span>
                </div>

                <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: '0 0 0.35rem 0' }}>
                  {viewingRecord.degree || viewingRecord.title}
                </h2>

                <h4 style={{ fontSize: '1.05rem', color: 'var(--color-neon-cyan, #00D9FF)', margin: 0, fontWeight: 600 }}>
                  🏛️ {viewingRecord.institution || viewingRecord.organization}
                </h4>
              </div>

              {/* Metadata Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '0.85rem',
                background: 'rgba(2, 8, 23, 0.45)',
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(245, 248, 255, 0.5)', textTransform: 'uppercase' }}>Field of Study</span>
                  <div style={{ color: '#fff', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                    {viewingRecord.field_of_study || 'N/A'}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(245, 248, 255, 0.5)', textTransform: 'uppercase' }}>Timeline</span>
                  <div style={{ color: '#fff', fontSize: '0.9rem', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>
                    {viewingRecord.start_date || 'Start'} — {viewingRecord.end_date || (viewingRecord.is_current ? 'Present' : 'End')}
                  </div>
                </div>

                {viewingRecord.location && (
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(245, 248, 255, 0.5)', textTransform: 'uppercase' }}>Location</span>
                    <div style={{ color: '#fff', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                      {viewingRecord.location}
                    </div>
                  </div>
                )}

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(245, 248, 255, 0.5)', textTransform: 'uppercase' }}>Display Order</span>
                  <div style={{ color: '#fff', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                    Priority #{viewingRecord.display_order ?? viewingRecord.id}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'rgba(245, 248, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  Overview & Coursework
                </h4>
                <p style={{ color: 'rgba(245, 248, 255, 0.9)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  {viewingRecord.description}
                </p>
              </div>

              {/* Highlights */}
              {Array.isArray(viewingRecord.highlights) && viewingRecord.highlights.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'rgba(245, 248, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                    Topics & Capabilities Acquired
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {viewingRecord.highlights.map(h => (
                      <span key={h} style={{
                        background: 'rgba(2, 8, 23, 0.7)',
                        border: '1px solid rgba(0, 217, 255, 0.3)',
                        color: '#00D9FF',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}>
                        ✓ {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons in View Modal */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '0.75rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleOpenEditModal(viewingRecord);
                  }}
                  className="admin-btn admin-btn-primary"
                >
                  <Edit3 size={16} />
                  <span style={{ marginLeft: '0.4rem' }}>Edit Education Record</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          DELETE CONFIRMATION MODAL DIALOG
      ======================================================== */}
      {isDeleteModalOpen && deletingRecord && (
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
              Delete Education Record?
            </h3>

            <p style={{ color: 'rgba(245, 248, 255, 0.7)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Are you sure you want to permanently delete <strong style={{ color: '#fff' }}>"{deletingRecord.degree || deletingRecord.title}"</strong> at <strong style={{ color: '#00D9FF' }}>{deletingRecord.institution || deletingRecord.organization}</strong>? 
              This will remove the record from your database and public journey timeline.
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

export default AdminEducationPage;
