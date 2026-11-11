import React, { useState, useEffect, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  Crop, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink,
  User,
  Info,
  Briefcase,
  Award,
  Trophy,
  Search,
  Eye,
  Sliders,
  Sparkles,
  Camera,
  FolderOpen
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ImageCropperModal } from '../../components/admin/ImageCropperModal';
import { api } from '../../services/api';
import { ASSET_PATHS } from '../../data/brandConfig';

const TABS = [
  { id: 'all', label: 'All Images', icon: ImageIcon },
  { id: 'site', label: 'Profile & Website', icon: User },
  { id: 'projects', label: 'Projects', icon: Briefcase },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'achievements', label: 'Achievements', icon: Trophy }
];

export const AdminImagesPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Data states
  const [siteImages, setSiteImages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [achievements, setAchievements] = useState([]);

  // Cropper Modal state
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperSource, setCropperSource] = useState(null);
  const [cropperTarget, setCropperTarget] = useState(null); // { type: 'site'|'project'|'certificate'|'achievement', id: string|number, title: string, ratio: number }
  
  // Lightbox preview modal
  const [previewModal, setPreviewModal] = useState(null);

  // Hidden universal file input ref
  const fileInputRef = useRef(null);
  const pendingTargetRef = useRef(null);

  // Show Toast
  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Fetch all media
  const loadMedia = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await api.media.getOverview();
      if (res?.data) {
        const d = res.data;
        const siteArr = Object.values(d.site_images || {});
        setSiteImages(siteArr.length > 0 ? siteArr : [
          {
            image_key: 'hero_profile',
            section: 'Hero Section',
            title: 'Profile Photo (Hero Section)',
            image_url: ASSET_PATHS.heroPortrait || '/src/assets/images/mubdev-hero.jpg',
            aspect_ratio: '4:5'
          },
          {
            image_key: 'about_photo',
            section: 'About Section',
            title: 'About Section Photo',
            image_url: ASSET_PATHS.heroPortrait || '/src/assets/images/mubdev-hero.jpg',
            aspect_ratio: '1:1'
          },
          {
            image_key: 'og_preview',
            section: 'Social & Metadata',
            title: 'Social Share & OpenGraph Banner',
            image_url: ASSET_PATHS.heroPortrait || '/src/assets/images/mubdev-hero.jpg',
            aspect_ratio: '16:9'
          }
        ]);
        setProjects(d.projects || []);
        setCertificates(d.certificates || []);
        setAchievements(d.achievements || []);
      }
    } catch (err) {
      console.warn('Media overview fetch notice:', err.message);
      // Fallback: fetch site-images directly
      try {
        const sRes = await api.siteImages.list();
        if (sRes?.data) {
          setSiteImages(Object.values(sRes.data));
        }
      } catch {}
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  // Initiate file selection from computer or mobile gallery
  const handlePickFile = (target, openCropperDirectly = true) => {
    pendingTargetRef.current = { ...target, openCropperDirectly };
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Process selected file
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showFeedback('error', 'Please select a valid image file (JPG, PNG, WebP, GIF, or SVG).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showFeedback('error', 'File size exceeds 10MB limit. Please choose a smaller image.');
      return;
    }

    const target = pendingTargetRef.current;
    if (!target) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;

      if (target.openCropperDirectly) {
        // Open the cropper modal with this image
        let defaultRatio = 1;
        if (target.ratio === '4:5') defaultRatio = 4 / 5;
        else if (target.ratio === '16:9') defaultRatio = 16 / 9;
        else if (target.ratio === '4:3') defaultRatio = 4 / 3;
        else if (target.ratio === '1:1') defaultRatio = 1;

        setCropperTarget(target);
        setCropperSource(dataUrl);
        setCropperOpen(true);
      } else {
        // Direct upload without cropping
        handleDirectUpload(target, file);
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop onto card
  const handleDropOnCard = (e, target) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    pendingTargetRef.current = { ...target, openCropperDirectly: true };
    const reader = new FileReader();
    reader.onload = () => {
      let defaultRatio = 1;
      if (target.ratio === '4:5') defaultRatio = 4 / 5;
      else if (target.ratio === '16:9') defaultRatio = 16 / 9;
      else if (target.ratio === '4:3') defaultRatio = 4 / 3;

      setCropperTarget(target);
      setCropperSource(reader.result);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);
  };

  // Direct upload without crop
  const handleDirectUpload = async (target, file) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('section', target.type === 'site' ? 'profile' : target.type + 's');

    try {
      if (target.type === 'site') {
        const res = await api.siteImages.update(target.id, formData);
        showFeedback('success', `Updated ${target.title} successfully!`);
        // Update local storage so public site immediately displays it
        if (target.id === 'hero_profile') {
          localStorage.setItem('mubdev_hero_profile', res.data?.image_url || '');
        } else if (target.id === 'about_photo') {
          localStorage.setItem('mubdev_about_photo', res.data?.image_url || '');
        }
      } else {
        await api.media.updateEntityImage({
          entity_type: target.type,
          entity_id: target.id,
          image: file
        });
        showFeedback('success', `Updated ${target.title} image successfully!`);
      }
      loadMedia(true);
    } catch (err) {
      showFeedback('error', err.message || 'Failed to upload image.');
    }
  };

  // Complete Crop and Save to Backend
  const handleCropComplete = async ({ file, dataUrl, useOriginal }) => {
    if (!cropperTarget) return;

    try {
      let uploadedUrl = '';

      if (cropperTarget.type === 'site') {
        // Site image (Hero, About, OG)
        const payload = {
          base64: dataUrl,
          title: cropperTarget.title
        };
        const res = await api.siteImages.update(cropperTarget.id, payload);
        uploadedUrl = res.data?.image_url;

        // Immediately update localStorage for instant public site reflection
        if (cropperTarget.id === 'hero_profile') {
          localStorage.setItem('mubdev_hero_profile', uploadedUrl);
        } else if (cropperTarget.id === 'about_photo') {
          localStorage.setItem('mubdev_about_photo', uploadedUrl);
        }

        showFeedback('success', `Cropped and saved ${cropperTarget.title} successfully!`);
      } else {
        // Project, Certificate, Achievement, Education
        const res = await api.media.updateEntityImage({
          entity_type: cropperTarget.type,
          entity_id: cropperTarget.id,
          base64: dataUrl
        });
        uploadedUrl = res.image_url;
        showFeedback('success', `Cropped and updated image for "${cropperTarget.title}"!`);
      }

      // Reload media overview to reflect updated image URL
      loadMedia(true);
    } catch (err) {
      showFeedback('error', err.message || 'Failed to save cropped image.');
    }
  };

  // Remove or Reset Image
  const handleRemoveImage = async (target) => {
    if (!window.confirm(`Are you sure you want to remove or reset the image for "${target.title}"?`)) {
      return;
    }

    try {
      if (target.type === 'site') {
        await api.siteImages.reset(target.id);
        if (target.id === 'hero_profile') {
          localStorage.removeItem('mubdev_hero_profile');
        } else if (target.id === 'about_photo') {
          localStorage.removeItem('mubdev_about_photo');
        }
        showFeedback('success', `Reset ${target.title} to default.`);
      } else {
        await api.media.updateEntityImage({
          entity_type: target.type,
          entity_id: target.id,
          image_url: null
        });
        showFeedback('success', `Removed image from ${target.title}.`);
      }
      loadMedia(true);
    } catch (err) {
      showFeedback('error', err.message || 'Failed to remove image.');
    }
  };

  // Aggregate items into a unified card list based on active tab and search
  const unifiedItems = [];

  // 1. Site Images
  if (activeTab === 'all' || activeTab === 'site') {
    siteImages.forEach((img) => {
      unifiedItems.push({
        type: 'site',
        id: img.image_key,
        section: img.section || 'Website Profile',
        title: img.title || img.image_key,
        imageUrl: img.image_url,
        ratio: img.aspect_ratio || '1:1',
        isDefault: !img.image_url || img.image_url.includes('mubdev-hero.jpg')
      });
    });
  }

  // 2. Projects
  if (activeTab === 'all' || activeTab === 'projects') {
    projects.forEach((proj) => {
      unifiedItems.push({
        type: 'project',
        id: proj.id,
        section: `Project • ${proj.category || 'Frontend'}`,
        title: proj.title,
        imageUrl: proj.image_url,
        ratio: '16:9',
        isDefault: !proj.image_url
      });
    });
  }

  // 3. Certificates
  if (activeTab === 'all' || activeTab === 'certificates') {
    certificates.forEach((cert) => {
      unifiedItems.push({
        type: 'certificate',
        id: cert.id,
        section: `Certificate • ${cert.issuer || 'Credential'}`,
        title: cert.title,
        imageUrl: cert.image_url,
        ratio: '4:3',
        isDefault: !cert.image_url
      });
    });
  }

  // 4. Achievements
  if (activeTab === 'all' || activeTab === 'achievements') {
    achievements.forEach((ach) => {
      unifiedItems.push({
        type: 'achievement',
        id: ach.id,
        section: `Achievement • ${ach.category || 'Milestone'}`,
        title: ach.title,
        imageUrl: ach.image_url,
        ratio: '4:3',
        isDefault: !ach.image_url
      });
    });
  }

  // Filter by search query
  const filteredItems = unifiedItems.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.section.toLowerCase().includes(q) ||
      (item.imageUrl && item.imageUrl.toLowerCase().includes(q))
    );
  });

  return (
    <AdminLayout>
      {/* Hidden Universal File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            <Camera size={28} color="var(--color-neon-cyan, #00D9FF)" /> Image &amp; Media Management
          </h1>
          <p className="admin-page-subtitle">
            Upload, crop, preview, and customize portfolio imagery across your Hero, About, Projects, and Certifications.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={() => loadMedia(true)}
            className="admin-btn admin-btn-secondary"
            disabled={refreshing}
            title="Refresh media catalog"
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            <span style={{ marginLeft: '0.35rem' }}>Refresh</span>
          </button>

          <a
            href="/#hero"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn admin-btn-primary"
            title="Preview public site in a new tab"
          >
            <ExternalLink size={16} />
            <span style={{ marginLeft: '0.4rem', fontWeight: 600 }}>Preview Live Site</span>
          </a>
        </div>
      </div>

      {/* Toast Feedback */}
      {feedback && (
        <div style={{
          background: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${feedback.type === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
          color: feedback.type === 'success' ? '#34D399' : '#F87171',
          padding: '0.85rem 1rem',
          borderRadius: '10px',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)'
        }}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Compact Metrics Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '0.75rem',
        marginBottom: '1.25rem'
      }}>
        <div className="admin-card" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(245, 248, 255, 0.55)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Images
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-neon-cyan)', marginTop: '0.15rem' }}>
              {siteImages.length + projects.length + certificates.length + achievements.length}
            </div>
          </div>
          <Camera size={20} color="var(--color-neon-cyan)" />
        </div>

        <div className="admin-card" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(245, 248, 255, 0.55)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Website &amp; Profile
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38BDF8', marginTop: '0.15rem' }}>
              {siteImages.length}
            </div>
          </div>
          <User size={20} color="#38BDF8" />
        </div>

        <div className="admin-card" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(245, 248, 255, 0.55)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Project Covers
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-electric-blue, #087BFF)', marginTop: '0.15rem' }}>
              {projects.length}
            </div>
          </div>
          <Briefcase size={20} color="var(--color-electric-blue, #087BFF)" />
        </div>

        <div className="admin-card" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(245, 248, 255, 0.55)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Credentials &amp; Awards
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-violet, #713BFF)', marginTop: '0.15rem' }}>
              {certificates.length + achievements.length}
            </div>
          </div>
          <Award size={20} color="var(--color-violet, #713BFF)" />
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="admin-card" style={{ padding: '0.85rem 1.15rem', marginBottom: '1.25rem' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Tab Buttons */}
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`project-filter-btn ${isActive ? 'active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '240px', minWidth: '180px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(245, 248, 255, 0.4)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '32px', fontSize: '0.82rem', padding: '0.45rem 0.75rem 0.45rem 32px' }}
              placeholder="Search images by title or section..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <RefreshCw size={36} className="animate-spin" color="var(--color-neon-cyan)" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'rgba(245, 248, 255, 0.7)' }}>Loading media catalog...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <ImageIcon size={48} color="rgba(245, 248, 255, 0.25)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.35rem' }}>No Images Found</h3>
          <p style={{ color: 'rgba(245, 248, 255, 0.6)', fontSize: '0.85rem' }}>
            {searchQuery ? 'No images match your search keyword.' : 'No images cataloged in this category.'}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: '1.15rem'
        }}>
          {filteredItems.map((item) => {
            const hasCustomImage = Boolean(item.imageUrl && !item.isDefault);
            const displayUrl = item.imageUrl || '/src/assets/images/mubdev-hero.jpg';
            const filename = item.imageUrl ? item.imageUrl.split('/').pop() : 'default_mubdev_hero.jpg';

            return (
              <div
                key={`${item.type}-${item.id}`}
                className="admin-card"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDropOnCard(e, item)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 0,
                  overflow: 'hidden',
                  borderRadius: '12px',
                  background: 'rgba(7, 27, 61, 0.45)',
                  border: item.type === 'site' ? '1px solid rgba(0, 217, 255, 0.35)' : '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {/* Image Preview Box (with Drag & Drop zone) */}
                <div style={{
                  height: '145px',
                  position: 'relative',
                  backgroundColor: '#020817',
                  overflow: 'hidden',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer'
                }}
                onClick={() => setPreviewModal({ url: displayUrl, title: item.title })}
                title="Click to preview full size image"
                >
                  <img
                    src={displayUrl}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: item.ratio === '4:5' ? 'cover' : 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    onError={(e) => {
                      // Fallback to hero portrait if custom file missing
                      e.currentTarget.src = '/src/assets/images/mubdev-hero.jpg';
                    }}
                  />

                  {/* Section Badge Pill overlay */}
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    background: 'rgba(2, 8, 23, 0.88)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(0, 217, 255, 0.35)',
                    color: '#00D9FF',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    maxWidth: '180px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.section}
                  </div>

                  {/* Aspect Ratio Chip */}
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(2, 8, 23, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'rgba(245, 248, 255, 0.8)',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                    fontSize: '0.65rem',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {item.ratio}
                  </div>

                  {/* Quick Preview Hover Pill */}
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    background: 'rgba(2, 8, 23, 0.85)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    color: 'var(--color-neon-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}>
                    <Eye size={12} /> Preview
                  </div>
                </div>

                {/* Card Body & Details */}
                <div style={{ padding: '0.85rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      color: '#fff',
                      marginBottom: '0.35rem',
                      lineHeight: 1.35,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }} title={item.title}>
                      {item.title}
                    </h3>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.72rem',
                      color: 'rgba(245, 248, 255, 0.55)',
                      fontFamily: 'var(--font-mono)',
                      marginBottom: '0.85rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      <FolderOpen size={12} style={{ flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }} title={filename}>
                        {filename}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons: Crop & Replace, Direct Upload, Remove */}
                  <div style={{
                    display: 'flex',
                    gap: '0.35rem',
                    alignItems: 'center',
                    paddingTop: '0.65rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                  }}>
                    {/* Crop & Upload Button */}
                    <button
                      type="button"
                      onClick={() => handlePickFile(item, true)}
                      className="admin-btn admin-btn-primary admin-btn-sm"
                      style={{ flex: 1, padding: '0.35rem 0.55rem', fontSize: '0.75rem', justifyContent: 'center' }}
                      title="Select photo from computer/phone, crop, and save"
                    >
                      <Crop size={13} />
                      <span style={{ marginLeft: '0.35rem' }}>Crop &amp; Upload</span>
                    </button>

                    {/* Direct Upload (No Crop) */}
                    <button
                      type="button"
                      onClick={() => handlePickFile(item, false)}
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      style={{ padding: '0.35rem 0.5rem', fontSize: '0.72rem' }}
                      title="Upload directly without opening cropper"
                    >
                      <Upload size={13} />
                    </button>

                    {/* Remove / Reset Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(item)}
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      style={{ padding: '0.35rem 0.5rem', fontSize: '0.72rem' }}
                      title={item.type === 'site' ? 'Reset to default image' : 'Remove image'}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Image Cropper Modal */}
      {cropperOpen && (
        <ImageCropperModal
          isOpen={cropperOpen}
          onClose={() => {
            setCropperOpen(false);
            setCropperSource(null);
            setCropperTarget(null);
          }}
          imageSrc={cropperSource}
          initialAspectRatio={
            cropperTarget?.ratio === '4:5' ? 4 / 5 :
            cropperTarget?.ratio === '16:9' ? 16 / 9 :
            cropperTarget?.ratio === '4:3' ? 4 / 3 : 1
          }
          title={`Crop Image: ${cropperTarget?.title || 'Portfolio Image'}`}
          onCropComplete={handleCropComplete}
        />
      )}

      {/* Full Size Preview Lightbox Modal */}
      {previewModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(2, 8, 23, 0.9)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2500,
          padding: '1.5rem'
        }}
        onClick={() => setPreviewModal(null)}
        >
          <div style={{ maxWidth: '85vw', maxHeight: '85vh', textAlign: 'center', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <img
              src={previewModal.url}
              alt={previewModal.title}
              style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: '10px', border: '1px solid rgba(0, 217, 255, 0.4)', boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }}
            />
            <div style={{ marginTop: '0.75rem', color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>
              {previewModal.title}
            </div>
            <button
              onClick={() => setPreviewModal(null)}
              className="admin-btn admin-btn-secondary admin-btn-sm"
              style={{ position: 'absolute', top: '-12px', right: '-12px', borderRadius: '50%', padding: '0.4rem' }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminImagesPage;
