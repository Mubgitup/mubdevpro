import React, { useState } from 'react';
import { SectionHeader } from '../components/common/SectionHeader';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { MotionReveal } from '../components/common/MotionReveal';
import { SocialIcon } from '../components/common/SocialIcon';
import { SOCIAL_LINKS } from '../data/brandConfig';
import { api } from '../services/api';
import { Mail, Send, AlertCircle, CheckCircle2, Loader2, Database, ShieldCheck, Share2, ExternalLink } from 'lucide-react';

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '' // Anti-spam honeypot
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // null | 'success' | 'error' | 'network_error'
  const [statusMessage, setStatusMessage] = useState('');

  const validateClient = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email format (e.g., name@domain.com).';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject line is required.';
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = 'Subject must be at least 3 characters.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message content is required.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-level error on input change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateClient()) {
      setSubmissionStatus('error');
      setStatusMessage('Please correct the highlighted field errors before submitting.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus(null);
    setStatusMessage('');

    try {
      const data = await api.contact.submit(formData);

      if (data.success) {
        setSubmissionStatus('success');
        setStatusMessage(data.message || 'Your message has been safely stored in the database.');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          website: ''
        });
        setErrors({});
      }
    } catch (err) {
      if (err.errors && typeof err.errors === 'object') {
        setSubmissionStatus('error');
        setStatusMessage(err.message || 'Validation failed on server. Please check your inputs.');
        const serverErrors = {};
        Object.keys(err.errors).forEach((key) => {
          const errVal = err.errors[key];
          serverErrors[key] = Array.isArray(errVal) ? errVal.join(' ') : String(errVal);
        });
        setErrors(serverErrors);
      } else {
        setSubmissionStatus(err.isNetworkError ? 'network_error' : 'error');
        setStatusMessage(
          err.message || 'Unable to reach the backend API server. Please verify the PHP backend is running at http://127.0.0.1:8000.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-container section-py" id="contact">
      <MotionReveal direction="up" delay={0.1}>
        <SectionHeader
          badge="Direct Communication"
          title="Get in Touch &"
          highlightText="Connect"
          subtitle="Have a question or interested in collaborating on full-stack software development? Send a message directly to my backend database."
        />
      </MotionReveal>

      <div className="contact-grid">
        {/* Left Column: Direct Info, Social Media Cards & Backend Status */}
        <MotionReveal direction="up" delay={0.2}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
            <GlassCard variant="default" glowColor="cyan">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <Mail size={22} color="var(--color-neon-cyan)" />
                <h3 style={{ fontSize: 'var(--text-xl)' }}>Direct Communication</h3>
              </div>

              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                I am always eager to discuss software engineering, web application development, 
                academic collaboration, and technology projects.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="badge" style={{ padding: '0.4rem 0.6rem' }}>
                    <span className="badge-dot" />
                    <span>Status</span>
                  </div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-white)' }}>
                    Active Student • Open to Engineering Inquiries
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="badge badge-violet" style={{ padding: '0.4rem 0.6rem' }}>
                    <span className="badge-dot" />
                    <span>Location</span>
                  </div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-white)' }}>
                    Haramaya University, Ethiopia
                  </span>
                </div>
              </div>

              {/* Architecture Live Integration Details */}
              <div
                style={{
                  padding: '1.15rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(2, 8, 23, 0.65)',
                  border: '1px solid rgba(0, 217, 255, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-neon-cyan)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                  <Database size={16} />
                  <span>Full-Stack Integration Architecture</span>
                </div>

                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                  Submissions are sent directly to the PHP REST API (<code style={{ color: 'var(--color-neon-cyan)' }}>/api/contact/</code>), 
                  sanitized, validated against strict RFC constraints, and stored in the MySQL database table <code style={{ color: 'var(--color-neon-cyan)' }}>mubdev_contact_messages</code>.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                  <ShieldCheck size={14} color="#00D9FF" />
                  <span>Includes anti-spam honeypot and rate-limiting protection.</span>
                </div>
              </div>
            </GlassCard>

            {/* Dedicated Social Media Connection Card */}
            <GlassCard variant="default" glowColor="violet">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Share2 size={20} color="var(--color-neon-cyan)" />
                  <h3 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>Social Media & Channels</h3>
                </div>
                <span className="badge badge-violet" style={{ fontSize: '0.65rem' }}>Connect Directly</span>
              </div>

              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Connect with me across platforms to follow my engineering projects, open-source code, and developer updates:
              </p>

              <div className="contact-social-grid">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-social-card"
                    title={`Connect on ${social.name}`}
                    aria-label={`Visit Mubdev on ${social.name} (opens in new tab)`}
                  >
                    <div className="contact-social-icon-wrapper" style={{ color: social.accentColor }}>
                      <SocialIcon name={social.id} size={20} />
                    </div>
                    <div className="contact-social-content">
                      <div className="contact-social-header">
                        <span className="contact-social-name">{social.name}</span>
                        <ExternalLink size={12} className="contact-social-ext" />
                      </div>
                      <span className="contact-social-handle">{social.username}</span>
                    </div>
                  </a>
                ))}
              </div>
            </GlassCard>
          </div>
        </MotionReveal>

        {/* Right Column: Contact Form */}
        <MotionReveal direction="up" delay={0.3}>
          <GlassCard variant="default" glowColor="blue">
            <form onSubmit={handleSubmit} noValidate>
              {/* Spam Honeypot - Hidden from humans, traps automated scrapers */}
              <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>

              {/* Status Messages */}
              {(submissionStatus === 'error' || submissionStatus === 'network_error') && (
                <div className="form-status-banner form-status-info" style={{ borderColor: '#ff4d6d' }}>
                  <AlertCircle size={18} color="#ff4d6d" style={{ flexShrink: 0 }} />
                  <span>{statusMessage}</span>
                </div>
              )}

              {submissionStatus === 'success' && (
                <div className="form-status-banner form-status-success">
                  <CheckCircle2 size={18} color="var(--color-neon-cyan)" style={{ flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: 'var(--color-white)' }}>Submission Confirmed!</strong>
                    <div style={{ fontSize: '0.75rem', marginTop: '3px', color: 'var(--color-neon-cyan)' }}>
                      {statusMessage}
                    </div>
                  </div>
                </div>
              )}

              {/* Name Field */}
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  <span>Full Name</span>
                  <span className="required-star" aria-hidden="true">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g. Alex Johnson"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`form-input ${errors.name ? 'has-error' : ''}`}
                  aria-required="true"
                  aria-invalid={!!errors.name}
                />
                {errors.name && <span className="form-error-msg">{errors.name}</span>}
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <span>Email Address</span>
                  <span className="required-star" aria-hidden="true">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="e.g. alex@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`form-input ${errors.email ? 'has-error' : ''}`}
                  aria-required="true"
                  aria-invalid={!!errors.email}
                />
                {errors.email && <span className="form-error-msg">{errors.email}</span>}
              </div>

              {/* Subject Field */}
              <div className="form-group">
                <label htmlFor="subject" className="form-label">
                  <span>Subject</span>
                  <span className="required-star" aria-hidden="true">*</span>
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="e.g. Collaboration on Full-Stack Project"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`form-input ${errors.subject ? 'has-error' : ''}`}
                  aria-required="true"
                  aria-invalid={!!errors.subject}
                />
                {errors.subject && <span className="form-error-msg">{errors.subject}</span>}
              </div>

              {/* Message Field */}
              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  <span>Your Message</span>
                  <span className="required-star" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`form-textarea ${errors.message ? 'has-error' : ''}`}
                  aria-required="true"
                  aria-invalid={!!errors.message}
                />
                {errors.message && <span className="form-error-msg">{errors.message}</span>}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                icon={isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                iconPosition="right"
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                {isSubmitting ? 'Transmitting to Database...' : 'Send Message'}
              </Button>
            </form>
          </GlassCard>
        </MotionReveal>
      </div>
    </section>
  );
};

export default ContactSection;
