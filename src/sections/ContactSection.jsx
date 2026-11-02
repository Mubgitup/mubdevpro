import React, { useState } from 'react';
import { SectionHeader } from '../components/common/SectionHeader';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { MotionReveal } from '../components/common/MotionReveal';
import { Mail, Send, AlertCircle, CheckCircle2, Loader2, Info } from 'lucide-react';

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // null | 'validated' | 'error'

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email format (e.g., name@domain.com).';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject line is required.';
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

    // Clear individual field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      setSubmissionStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus(null);

    // Simulate validation and payload readiness for future Django REST API endpoint
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionStatus('validated');
    }, 600);
  };

  return (
    <section className="section-container section-py" id="contact">
      <MotionReveal direction="up" delay={0.1}>
        <SectionHeader
          badge="Direct Communication"
          title="Get in Touch &"
          highlightText="Connect"
          subtitle="Have a question or interested in collaborating on full-stack software development? Send a message below."
        />
      </MotionReveal>

      <div className="contact-grid">
        {/* Left Column: Direct Info & Backend Status Notice */}
        <MotionReveal direction="up" delay={0.2}>
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

            {/* Honest Technical Note regarding Django Integration */}
            <div
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(2, 8, 23, 0.6)',
                border: '1px solid rgba(0, 217, 255, 0.2)',
                display: 'flex',
                gap: '0.65rem'
              }}
            >
              <Info size={18} color="var(--color-neon-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--color-neon-cyan)' }}>Backend Integration Status:</strong> This contact form includes comprehensive client-side validation. Complete server dispatch will be connected in the future Django backend phase without simulating false message transmissions.
              </p>
            </div>
          </GlassCard>
        </MotionReveal>

        {/* Right Column: Contact Form */}
        <MotionReveal direction="up" delay={0.3}>
          <GlassCard variant="default" glowColor="blue">
            <form onSubmit={handleSubmit} noValidate>
              {/* Status Messages */}
              {submissionStatus === 'error' && (
                <div className="form-status-banner form-status-info" style={{ borderColor: '#ff4d6d' }}>
                  <AlertCircle size={18} color="#ff4d6d" />
                  <span>Please resolve the highlighted field errors before submitting.</span>
                </div>
              )}

              {submissionStatus === 'validated' && (
                <div className="form-status-banner form-status-success">
                  <CheckCircle2 size={18} color="var(--color-neon-cyan)" />
                  <div>
                    <strong>Form validation successful.</strong>
                    <div style={{ fontSize: '0.75rem', marginTop: '2px', color: 'var(--text-secondary)' }}>
                      Payload prepared for Django API endpoint: Name: <em>{formData.name}</em> ({formData.email}).
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
                {isSubmitting ? 'Validating Payload...' : 'Submit Message'}
              </Button>
            </form>
          </GlassCard>
        </MotionReveal>
      </div>
    </section>
  );
};

export default ContactSection;
