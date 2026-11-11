import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Award, 
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
  ExternalLink, 
  ShieldCheck, 
  Calendar, 
  FileText, 
  ArrowUpDown, 
  LayoutGrid, 
  List, 
  Check, 
  Loader2,
  Tag,
  Building,
  Image as ImageIcon
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { api } from '../../services/api';

const POPULAR_SKILLS = [
  'HTML5', 'CSS3', 'JavaScript', 'React', 'Python', 'Django', 
  'C++', 'MySQL', 'PHP', 'Data Structures', 'OOP', 'Web APIs'
];

const INITIAL_FORM_STATE = {
  id: null,
  title: '',
  issuer: '',
  issue_date: '',
  credential_id: '',
  verification_url: '',
  image_url: '',
  file: null,
  file_preview: '',
  skills: [],
  description: '',
  display_order: 0,
  featured: true
};

export const AdminCertificatesPage = () => {
  // Data State
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: '' }

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [issuerFilter, setIssuerFilter] = useState('all');
  const [sortBy, setSortBy] = useState('order'); // 'order' | 'newest' | 'oldest' | 'title'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modals State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create' | 'edit'
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [customSkillInput, setCustomSkillInput] = useState('');

  // View Details Modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingCert, setViewingCert] = useState(null);

  // Delete Confirmation Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingCert, setDeletingCert] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef(null);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  // Fetch certificates from PHP backend API
  const fetchCertificates = async (showIndicator = false) => {
    if (showIndicator) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await api.certificates.list({
        search: searchQuery.trim() || undefined,
        issuer: issuerFilter !== 'all' ? issuerFilter : undefined,
        sort: sortBy
      });

      let list = [];
      if (Array.isArray(response?.data)) {
        list = response.data;
      } else if (Array.isArray(response?.certificates)) {
        list = response.certificates;
      } else if (Array.isArray(response?.data?.certificates)) {
        list = response.data.certificates;
      }

      setCerts(list);
    } catch (err) {
      console.error('Failed to load certificates:', err);
      showFeedback('error', err.message || 'Unable to reach backend API. Showing cached credentials.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load and filter change trigger
  useEffect(() => {
    fetchCertificates();
  }, [issuerFilter, sortBy]);

  // Debounced search trigger
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchCertificates();
    }, 350);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = certs.length;
    const verified = certs.filter(c => c.verification_url || c.credential_id).length;
    const issuers = new Set(certs.map(c => c.issuer)).size;
    return { total, verified, issuers };
  }, [certs]);

  // Distinct issuers for filtering
  const distinctIssuers = useMemo(() => {
    return Array.from(new Set(certs.map(c => c.issuer).filter(Boolean)));
  }, [certs]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setFormMode('create');
    setFormData({
      ...INITIAL_FORM_STATE,
      display_order: certs.length + 1
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (cert) => {
    setFormMode('edit');
    setFormData({
      id: cert.id,
      title: cert.title || '',
      issuer: cert.issuer || '',
      issue_date: cert.issue_date || cert.issueDate || '',
      credential_id: cert.credential_id || cert.credentialId || '',
      verification_url: cert.verification_url || cert.url || '',
      image_url: cert.image_url || cert.imageUrl || '',
      file: null,
      file_preview: cert.image_url || cert.imageUrl || '',
      skills: Array.isArray(cert.skills) ? [...cert.skills] : [],
      description: cert.description || '',
      display_order: cert.display_order ?? 0,
      featured: Boolean(cert.featured)
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open View Modal
  const handleOpenViewModal = (cert) => {
    setViewingCert(cert);
    setIsViewModalOpen(true);
  };

  // Open Delete Confirmation Modal
  const handleOpenDeleteModal = (cert) => {
    setDeletingCert(cert);
    setIsDeleteModalOpen(true);
  };

  // Handle Skill Tag Add
  const handleAddSkill = (e) => {
    if (e) e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;

    if (!formData.skills.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, trimmed]
      }));
    }
    setCustomSkillInput('');
  };

  // Handle Skill Tag Remove
  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  // Toggle Preset Skill
  const handleToggleSkill = (skill) => {
    setFormData(prev => {
      const exists = prev.skills.includes(skill);
      const updated = exists 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills: updated };
    });
  };

  // Handle File Upload (Image or PDF)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';

    if (!isImage && !isPdf) {
      showFeedback('error', 'Please select a valid image (PNG, JPG, SVG, WEBP) or PDF document.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showFeedback('error', 'File size exceeds 10MB limit.');
      return;
    }

    const previewUrl = isImage ? URL.createObjectURL(file) : '';
    setFormData(prev => ({
      ...prev,
      file: file,
      file_preview: previewUrl,
      image_url: file.name
    }));
  };

  // Remove File
  const handleRemoveFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFormData(prev => ({
      ...prev,
      file: null,
      file_preview: '',
      image_url: ''
    }));
  };

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Certificate or credential title is required.';
    }
    if (!formData.issuer.trim()) {
      errors.issuer = 'Issuing organization is required.';
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
      const payload = new FormData();
      payload.append('title', formData.title.trim());
      payload.append('issuer', formData.issuer.trim());
      payload.append('issue_date', formData.issue_date.trim());
      payload.append('credential_id', formData.credential_id.trim());
      payload.append('verification_url', formData.verification_url.trim());
      payload.append('skills', JSON.stringify(formData.skills));
      payload.append('description', formData.description.trim());
      payload.append('display_order', String(formData.display_order ?? 0));
      payload.append('featured', formData.featured ? '1' : '0');

      if (formData.file) {
        payload.append('file', formData.file);
      } else if (formData.image_url) {
        payload.append('image_url', formData.image_url.trim());
      }

      if (formMode === 'create') {
        await api.certificates.create(payload);
        showFeedback('success', `Certificate "${formData.title}" added successfully!`);
      } else {
        await api.certificates.update(formData.id, payload);
        showFeedback('success', `Certificate "${formData.title}" updated successfully!`);
      }

      setIsFormModalOpen(false);
      fetchCertificates();
    } catch (err) {
      console.error('Certificate save error:', err);
      showFeedback('error', err.message || 'Failed to save certificate.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingCert) return;
    setIsDeleting(true);

    try {
      await api.certificates.delete(deletingCert.id);
      showFeedback('success', `Certificate "${deletingCert.title}" was deleted.`);
      setIsDeleteModalOpen(false);
      setDeletingCert(null);
      fetchCertificates();
    } catch (err) {
      console.error('Delete error:', err);
      showFeedback('error', err.message || 'Failed to delete certificate.');
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
            <Award size={28} color="var(--color-neon-cyan, #00D9FF)" /> Certificates & Achievements
          </h1>
          <p className="admin-page-subtitle">
            Catalog, showcase, and verify your professional certifications, course completions, and technical credentials.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={() => fetchCertificates(true)}
            className="admin-btn admin-btn-secondary"
            title="Refresh certificates list"
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
            <span style={{ marginLeft: '0.4rem', fontWeight: 600 }}>Add Certificate</span>
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
              Total Certificates
            </span>
            <Award size={18} color="var(--color-neon-cyan, #00D9FF)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginTop: '0.4rem' }}>
            {stats.total}
          </div>
        </div>

        <div className="admin-card" style={{ padding: '1.1rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'rgba(245, 248, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Verified Credentials
            </span>
            <ShieldCheck size={18} color="#34D399" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34D399', marginTop: '0.4rem' }}>
            {stats.verified}
          </div>
        </div>

        <div className="admin-card" style={{ padding: '1.1rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'rgba(245, 248, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Organizations / Issuers
            </span>
            <Building size={18} color="var(--color-electric-blue, #087BFF)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#087BFF', marginTop: '0.4rem' }}>
            {stats.issuers}
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
              placeholder="Search by title, issuer, or skills..."
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

          {/* Filter by Issuer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '0 1 200px' }}>
            <Building size={16} color="var(--color-neon-cyan, #00D9FF)" />
            <select
              value={issuerFilter}
              onChange={(e) => setIssuerFilter(e.target.value)}
              className="admin-select"
              style={{ fontSize: '0.88rem', padding: '0.65rem 0.85rem' }}
            >
              <option value="all">All Issuers</option>
              {distinctIssuers.map(i => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
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
          <p style={{ color: 'rgba(245, 248, 255, 0.7)' }}>Loading certificates from database...</p>
        </div>
      ) : certs.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Award size={48} color="rgba(245, 248, 255, 0.25)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>No Certificates Found</h3>
          <p style={{ color: 'rgba(245, 248, 255, 0.6)', maxWidth: '460px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
            {searchQuery || issuerFilter !== 'all'
              ? 'No certificates matched your active search or filter criteria. Try resetting filters.'
              : 'You have not added any certificates yet. Add your first verified certificate or coursework achievement!'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            {(searchQuery || issuerFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIssuerFilter('all');
                }}
                className="admin-btn admin-btn-secondary"
              >
                Reset Filters
              </button>
            )}
            <button onClick={handleOpenCreateModal} className="admin-btn admin-btn-primary">
              <Plus size={16} /> Add Certificate
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
          {certs.map((cert) => {
            const isPdf = cert.image_url && cert.image_url.endsWith('.pdf');
            const hasFile = Boolean(cert.image_url);

            return (
              <div 
                key={cert.id} 
                className="admin-card" 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  padding: 0,
                  border: '1px solid rgba(0, 217, 255, 0.22)'
                }}
              >
                {/* Certificate Preview Header */}
                <div style={{
                  height: '150px',
                  position: 'relative',
                  backgroundColor: 'rgba(2, 8, 23, 0.9)',
                  overflow: 'hidden',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  {hasFile && !isPdf ? (
                    <img
                      src={cert.image_url}
                      alt={cert.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, rgba(8, 123, 255, 0.15) 0%, rgba(113, 59, 255, 0.12) 100%)',
                      gap: '0.4rem'
                    }}>
                      {isPdf ? (
                        <>
                          <FileText size={36} color="var(--color-neon-cyan, #00D9FF)" />
                          <span style={{ fontSize: '0.75rem', color: 'rgba(245, 248, 255, 0.6)', fontFamily: 'var(--font-mono)' }}>
                            PDF Certificate Document
                          </span>
                        </>
                      ) : (
                        <>
                          <Award size={40} color="var(--color-neon-cyan, #00D9FF)" />
                          <span style={{ fontSize: '0.75rem', color: 'rgba(245, 248, 255, 0.5)', fontFamily: 'var(--font-mono)' }}>
                            Verified Academic Achievement
                          </span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Issuer Capsule over Preview */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: 'rgba(2, 8, 23, 0.85)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(0, 217, 255, 0.4)',
                    color: '#00D9FF',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    zIndex: 2
                  }}>
                    {cert.issuer}
                  </div>

                  {cert.credential_id && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      color: '#34D399',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '999px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      zIndex: 2
                    }}>
                      <ShieldCheck size={12} /> Verified
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                      {cert.title}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(245, 248, 255, 0.4)', fontFamily: 'var(--font-mono)' }}>
                      #{cert.display_order ?? cert.id}
                    </span>
                  </div>

                  {/* Metadata Row */}
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.8rem', color: 'rgba(245, 248, 255, 0.6)', marginBottom: '0.75rem' }}>
                    {cert.issue_date && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={13} /> {cert.issue_date}
                      </span>
                    )}

                    {cert.credential_id && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'rgba(245, 248, 255, 0.5)' }}>
                        ID: {cert.credential_id}
                      </span>
                    )}
                  </div>

                  {cert.description && (
                    <p style={{
                      fontSize: '0.85rem',
                      color: 'rgba(245, 248, 255, 0.75)',
                      lineHeight: 1.5,
                      marginBottom: '1rem',
                      flex: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {cert.description}
                    </p>
                  )}

                  {/* Skills Chips */}
                  {Array.isArray(cert.skills) && cert.skills.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                      {cert.skills.map(s => (
                        <span key={s} style={{
                          background: 'rgba(2, 8, 23, 0.7)',
                          border: '1px solid rgba(0, 217, 255, 0.2)',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          color: 'rgba(245, 248, 255, 0.85)'
                        }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons Toolbar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.85rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    marginTop: 'auto'
                  }}>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => handleOpenViewModal(cert)}
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        title="View Details"
                      >
                        <Eye size={14} />
                        <span style={{ marginLeft: '0.3rem' }}>View</span>
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(cert)}
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        title="Edit Certificate"
                      >
                        <Edit3 size={14} />
                        <span style={{ marginLeft: '0.3rem' }}>Edit</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleOpenDeleteModal(cert)}
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      title="Delete Certificate"
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
                  <th>Certificate Title</th>
                  <th>Issuer</th>
                  <th>Issue Date</th>
                  <th>Credential ID</th>
                  <th>Verification</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {certs.map((cert) => (
                  <tr key={cert.id}>
                    <td style={{ minWidth: '220px' }}>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.92rem' }}>
                        {cert.title}
                      </div>
                      {cert.skills && Array.isArray(cert.skills) && cert.skills.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.25rem' }}>
                          {cert.skills.slice(0, 3).map(s => (
                            <span key={s} style={{ fontSize: '0.68rem', background: 'rgba(2, 8, 23, 0.6)', padding: '0.1rem 0.4rem', borderRadius: '4px', color: 'rgba(245, 248, 255, 0.7)' }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td style={{ minWidth: '150px', color: 'var(--color-neon-cyan, #00D9FF)', fontWeight: 500 }}>
                      {cert.issuer}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'rgba(245, 248, 255, 0.7)' }}>
                      {cert.issue_date || 'N/A'}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'rgba(245, 248, 255, 0.6)' }}>
                      {cert.credential_id || '—'}
                    </td>
                    <td>
                      {cert.verification_url ? (
                        <a 
                          href={cert.verification_url} 
                          target="_blank" 
                          rel="noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#34D399', fontSize: '0.8rem', textDecoration: 'none' }}
                        >
                          <ShieldCheck size={14} /> Verify <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span style={{ color: 'rgba(245, 248, 255, 0.3)', fontSize: '0.8rem' }}>None</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                        <button
                          onClick={() => handleOpenViewModal(cert)}
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(cert)}
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(cert)}
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          title="Delete"
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
      )}

      {/* ========================================================
          ADD / EDIT CERTIFICATE MODAL
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
            maxWidth: '650px',
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
                <Award size={20} color="var(--color-neon-cyan, #00D9FF)" />
                {formMode === 'create' ? 'Add Certificate / Credential' : `Edit: ${formData.title}`}
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

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm} style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Title */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(245, 248, 255, 0.9)', marginBottom: '0.4rem' }}>
                  Certificate / Credential Title <span style={{ color: '#F87171' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Udacity Web Development Program Certificate"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="admin-input"
                  style={{ borderColor: formErrors.title ? '#F87171' : undefined }}
                />
                {formErrors.title && (
                  <p style={{ color: '#F87171', fontSize: '0.78rem', marginTop: '0.3rem' }}>{formErrors.title}</p>
                )}
              </div>

              {/* Issuer & Issue Date */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(245, 248, 255, 0.9)', marginBottom: '0.4rem' }}>
                    Issuing Organization <span style={{ color: '#F87171' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Udacity, Haramaya University, Coursera"
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    className="admin-input"
                    style={{ borderColor: formErrors.issuer ? '#F87171' : undefined }}
                  />
                  {formErrors.issuer && (
                    <p style={{ color: '#F87171', fontSize: '0.78rem', marginTop: '0.3rem' }}>{formErrors.issuer}</p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(245, 248, 255, 0.9)', marginBottom: '0.4rem' }}>
                    Issue Date / Period
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2024 or Nov 2024"
                    value={formData.issue_date}
                    onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              {/* Credential ID & Verification URL */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(245, 248, 255, 0.9)', marginBottom: '0.4rem' }}>
                    Credential ID / License #
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UDACITY-WD-2024"
                    value={formData.credential_id}
                    onChange={(e) => setFormData({ ...formData, credential_id: e.target.value })}
                    className="admin-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(245, 248, 255, 0.9)', marginBottom: '0.4rem' }}>
                    Verification URL / Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.udacity.com or verification portal"
                    value={formData.verification_url}
                    onChange={(e) => setFormData({ ...formData, verification_url: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              {/* File Upload (Image or PDF) */}
              <div style={{
                background: 'rgba(2, 8, 23, 0.45)',
                border: '1px dashed rgba(0, 217, 255, 0.3)',
                borderRadius: '12px',
                padding: '1.25rem'
              }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(245, 248, 255, 0.9)', marginBottom: '0.75rem' }}>
                  Certificate Document or Image (JPG, PNG, WEBP, SVG, or PDF up to 10MB)
                </label>

                {formData.file_preview ? (
                  <div style={{ position: 'relative', height: '160px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem', border: '1px solid rgba(0, 217, 255, 0.4)' }}>
                    <img
                      src={formData.file_preview}
                      alt="Certificate Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#020817' }}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveFile}
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
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ) : formData.image_url && formData.image_url.endsWith('.pdf') ? (
                  <div style={{
                    padding: '0.85rem 1rem',
                    background: 'rgba(8, 123, 255, 0.15)',
                    border: '1px solid rgba(0, 217, 255, 0.3)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00D9FF', fontSize: '0.85rem' }}>
                      <FileText size={18} />
                      <span>Current PDF: {formData.image_url}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="admin-btn admin-btn-danger admin-btn-sm"
                    >
                      Remove
                    </button>
                  </div>
                ) : null}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,application/pdf"
                    style={{ display: 'none' }}
                    id="cert-file-upload"
                  />
                  <label
                    htmlFor="cert-file-upload"
                    className="admin-btn admin-btn-secondary"
                    style={{ cursor: 'pointer', margin: 0 }}
                  >
                    <Upload size={16} />
                    <span style={{ marginLeft: '0.4rem' }}>Upload Certificate File</span>
                  </label>

                  <span style={{ fontSize: '0.78rem', color: 'rgba(245, 248, 255, 0.4)' }}>
                    (Supports Image or PDF Document)
                  </span>
                </div>

                <div style={{ marginTop: '0.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(245, 248, 255, 0.5)', marginBottom: '0.25rem' }}>
                    Or enter external Image / Document URL:
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/certificate.png"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      image_url: e.target.value,
                      file_preview: e.target.value || formData.file_preview
                    })}
                    className="admin-input"
                    style={{ fontSize: '0.82rem', padding: '0.5rem 0.85rem' }}
                  />
                </div>
              </div>

              {/* Skills Multi-picker */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(245, 248, 255, 0.9)', marginBottom: '0.4rem' }}>
                  Skills / Topics Demonstrated
                </label>

                {/* Popular Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.65rem' }}>
                  {POPULAR_SKILLS.map(s => {
                    const isSelected = formData.skills.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleToggleSkill(s)}
                        style={{
                          background: isSelected ? 'rgba(8, 123, 255, 0.35)' : 'rgba(2, 8, 23, 0.6)',
                          border: `1px solid ${isSelected ? 'rgba(0, 217, 255, 0.6)' : 'rgba(255, 255, 255, 0.12)'}`,
                          color: isSelected ? '#00D9FF' : 'rgba(245, 248, 255, 0.7)',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: isSelected ? 600 : 400,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        {isSelected && <Check size={12} />}
                        {s}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Skill Adder */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                  <input
                    type="text"
                    placeholder="Add custom skill or capability (press Enter)..."
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    className="admin-input"
                    style={{ fontSize: '0.85rem' }}
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="admin-btn admin-btn-secondary"
                  >
                    Add
                  </button>
                </div>

                {/* Selected Skills Chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {formData.skills.map(s => (
                    <span
                      key={s}
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
                      {s}
                      <X
                        size={12}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleRemoveSkill(s)}
                      />
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(245, 248, 255, 0.9)', marginBottom: '0.4rem' }}>
                  Description & Achievement Summary
                </label>
                <textarea
                  rows={3}
                  placeholder="Summary of course curriculum, learning outcomes, or practical skills verified..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="admin-textarea"
                />
              </div>

              {/* Display Order & Featured */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ maxWidth: '180px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(245, 248, 255, 0.9)', marginBottom: '0.35rem' }}>
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="admin-input"
                    min={0}
                  />
                </div>

                <label style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  color: '#fff',
                  fontWeight: 600,
                  marginTop: '1.25rem'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: '#00D9FF' }}
                  />
                  Feature on Public Website
                </label>
              </div>

              {/* Form Buttons */}
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
                    <span>{formMode === 'create' ? 'Save Certificate' : 'Update Certificate'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW CERTIFICATE DETAILS MODAL
      ======================================================== */}
      {isViewModalOpen && viewingCert && (
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
            {/* Header / Document View */}
            <div style={{
              position: 'relative',
              height: '180px',
              backgroundColor: '#020817',
              borderBottom: '1px solid rgba(0, 217, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {viewingCert.image_url ? (
                viewingCert.image_url.endsWith('.pdf') ? (
                  <div style={{ textAlign: 'center' }}>
                    <FileText size={48} color="var(--color-neon-cyan, #00D9FF)" style={{ margin: '0 auto 0.5rem' }} />
                    <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>PDF Certificate Document</span>
                  </div>
                ) : (
                  <img
                    src={viewingCert.image_url}
                    alt={viewingCert.title}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                )
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <Award size={48} color="var(--color-neon-cyan, #00D9FF)" style={{ margin: '0 auto 0.5rem' }} />
                  <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>Verified Coursework Credential</span>
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
            </div>

            {/* Content */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <span style={{
                  background: 'rgba(8, 123, 255, 0.15)',
                  border: '1px solid rgba(0, 217, 255, 0.3)',
                  color: '#00D9FF',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'inline-block',
                  marginBottom: '0.4rem'
                }}>
                  {viewingCert.issuer}
                </span>

                <h2 style={{ fontSize: '1.35rem', color: '#fff', margin: '0 0 0.4rem 0' }}>
                  {viewingCert.title}
                </h2>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.85rem', color: 'rgba(245, 248, 255, 0.6)' }}>
                  {viewingCert.issue_date && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={14} /> Issued: {viewingCert.issue_date}
                    </span>
                  )}
                  {viewingCert.credential_id && (
                    <span style={{ fontFamily: 'var(--font-mono)' }}>
                      Credential ID: {viewingCert.credential_id}
                    </span>
                  )}
                </div>
              </div>

              {viewingCert.description && (
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'rgba(245, 248, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                    Description
                  </h4>
                  <p style={{ color: 'rgba(245, 248, 255, 0.9)', lineHeight: 1.6, fontSize: '0.92rem' }}>
                    {viewingCert.description}
                  </p>
                </div>
              )}

              {Array.isArray(viewingCert.skills) && viewingCert.skills.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'rgba(245, 248, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                    Skills Demonstrated
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {viewingCert.skills.map(s => (
                      <span key={s} style={{
                        background: 'rgba(2, 8, 23, 0.7)',
                        border: '1px solid rgba(0, 217, 255, 0.3)',
                        color: '#00D9FF',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '1.25rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {viewingCert.verification_url && (
                    <a
                      href={viewingCert.verification_url}
                      target="_blank"
                      rel="noreferrer"
                      className="admin-btn admin-btn-primary"
                    >
                      <ShieldCheck size={16} />
                      <span style={{ marginLeft: '0.4rem' }}>Verify Credential</span>
                    </a>
                  )}

                  {viewingCert.image_url && (
                    <a
                      href={viewingCert.image_url}
                      target="_blank"
                      rel="noreferrer"
                      className="admin-btn admin-btn-secondary"
                    >
                      <FileText size={16} />
                      <span style={{ marginLeft: '0.4rem' }}>Open Document</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleOpenEditModal(viewingCert);
                  }}
                  className="admin-btn admin-btn-secondary"
                >
                  <Edit3 size={16} />
                  <span style={{ marginLeft: '0.4rem' }}>Edit Certificate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          DELETE CONFIRMATION MODAL
      ======================================================== */}
      {isDeleteModalOpen && deletingCert && (
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
              Delete Certificate?
            </h3>

            <p style={{ color: 'rgba(245, 248, 255, 0.7)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Are you sure you want to permanently delete <strong style={{ color: '#fff' }}>"{deletingCert.title}"</strong> issued by <strong style={{ color: '#00D9FF' }}>{deletingCert.issuer}</strong>? 
              This will remove the certificate record and its associated document from disk.
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

export default AdminCertificatesPage;
