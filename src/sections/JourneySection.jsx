import React, { useState, useEffect } from 'react';
import { SectionHeader } from '../components/common/SectionHeader';
import { TimelineItem } from '../components/common/TimelineItem';
import { GlassCard } from '../components/common/GlassCard';
import { MotionReveal } from '../components/common/MotionReveal';
import { 
  GraduationCap, 
  Award, 
  Trophy, 
  ExternalLink, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  Eye,
  X
} from 'lucide-react';
import { JOURNEY_MILESTONES } from '../data/journeyData';
import { CERTIFICATES_DATA } from '../data/certificatesData';
import { ACHIEVEMENTS_DATA } from '../data/achievementsData';
import { api } from '../services/api';

export const JourneySection = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [educationList, setEducationList] = useState(JOURNEY_MILESTONES);
  const [certificatesList, setCertificatesList] = useState(CERTIFICATES_DATA);
  const [achievementsList, setAchievementsList] = useState(ACHIEVEMENTS_DATA);
  
  // Lightbox / Image Preview Modal for Certificates
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    let isMounted = true;

    // 1. Fetch Education
    if (api?.education?.list) {
      api.education.list()
        .then((res) => {
          const items = Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res?.education)
              ? res.education
              : Array.isArray(res?.data?.education)
                ? res.data.education
                : null;
          if (isMounted && items && items.length > 0) {
            setEducationList(items);
          }
        })
        .catch(() => {});
    }

    // 2. Fetch Certificates
    if (api?.certificates?.list) {
      api.certificates.list()
        .then((res) => {
          const items = Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res?.certificates)
              ? res.certificates
              : Array.isArray(res?.data?.certificates)
                ? res.data.certificates
                : null;
          if (isMounted && items && items.length > 0) {
            setCertificatesList(items);
          }
        })
        .catch(() => {});
    }

    // 3. Fetch Achievements
    if (api?.achievements?.list) {
      api.achievements.list()
        .then((res) => {
          const items = Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res?.achievements)
              ? res.achievements
              : Array.isArray(res?.data?.achievements)
                ? res.data.achievements
                : null;
          if (isMounted && items && items.length > 0) {
            setAchievementsList(items);
          }
        })
        .catch(() => {});
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const totalCount = educationList.length + certificatesList.length + achievementsList.length;

  return (
    <section className="section-container section-py" id="journey">
      {/* Anchor alias so #education navigates seamlessly */}
      <span id="education" style={{ position: 'relative', top: '-100px', visibility: 'hidden' }} />
      <span id="certificates" style={{ position: 'relative', top: '-100px', visibility: 'hidden' }} />

      <MotionReveal direction="up" delay={0.1}>
        <SectionHeader
          badge="My Journey"
          title="My"
          highlightText="Journey"
          subtitle="My education, continuous learning, and achievements as I grow as a software developer."
        />
      </MotionReveal>

      {/* Subsection Navigation Tabs */}
      <MotionReveal direction="up" delay={0.15}>
        <div className="journey-tabs-wrapper">
          <div className="journey-tabs-container" role="tablist" aria-label="Journey Subsections">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'all'}
              className={`journey-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              <Sparkles size={15} className="journey-tab-icon" />
              <span className="journey-tab-label">All Journey</span>
              <span className="journey-tab-badge">{totalCount}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'education'}
              className={`journey-tab-btn ${activeTab === 'education' ? 'active' : ''}`}
              onClick={() => setActiveTab('education')}
            >
              <GraduationCap size={15} className="journey-tab-icon" />
              <span className="journey-tab-label">Education</span>
              <span className="journey-tab-badge">{educationList.length}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'certifications'}
              className={`journey-tab-btn ${activeTab === 'certifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('certifications')}
            >
              <Award size={15} className="journey-tab-icon" />
              <span className="journey-tab-label">Certifications</span>
              <span className="journey-tab-badge">{certificatesList.length}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'achievements'}
              className={`journey-tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
              onClick={() => setActiveTab('achievements')}
            >
              <Trophy size={15} className="journey-tab-icon" />
              <span className="journey-tab-label">Achievements</span>
              <span className="journey-tab-badge">{achievementsList.length}</span>
            </button>
          </div>
        </div>
      </MotionReveal>

      {/* SUBSECTION A: EDUCATION */}
      {(activeTab === 'all' || activeTab === 'education') && (
        <div style={{ marginBottom: activeTab === 'all' ? '4rem' : '0' }}>
          {activeTab === 'all' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '2rem', justifyContent: 'center' }}>
              <GraduationCap size={22} color="var(--color-neon-cyan)" />
              <h3 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-white)', margin: 0, fontWeight: 700 }}>
                Formal Education &amp; Academic Standing
              </h3>
            </div>
          )}

          <div className="timeline-wrapper">
            <div className="timeline-track" aria-hidden="true" />
            {educationList.map((milestone, index) => (
              <MotionReveal key={milestone.id || `edu-${index}`} direction="left" delay={0.1 * (index + 1)}>
                <TimelineItem milestone={milestone} />
              </MotionReveal>
            ))}
          </div>
        </div>
      )}

      {/* SUBSECTION B: CERTIFICATIONS */}
      {(activeTab === 'all' || activeTab === 'certifications') && (
        <div style={{ marginBottom: activeTab === 'all' ? '4rem' : '0' }}>
          {activeTab === 'all' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '2rem', justifyContent: 'center' }}>
              <Award size={22} color="var(--color-neon-cyan)" />
              <h3 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-white)', margin: 0, fontWeight: 700 }}>
                Certifications &amp; Verified Credentials
              </h3>
            </div>
          )}

          <div className="certificates-grid">
            {certificatesList.map((cert, index) => {
              const skills = Array.isArray(cert.skills) ? cert.skills : [];
              const link = cert.verification_url || cert.url;
              const certId = cert.credential_id || cert.credentialId;
              const date = cert.issue_date || cert.issueDate;
              const isDemo = cert.title?.includes('SAMPLE') || cert.title?.includes('DEMO') || cert.issuer?.includes('Demo');

              return (
                <MotionReveal key={cert.id || `cert-${index}`} direction="up" delay={0.1 * (index + 1)}>
                  <GlassCard variant="default" glowColor={isDemo ? 'violet' : 'cyan'} className="certificate-card">
                    <div>
                      {/* Optional Certificate Image Thumbnail (Compact 115px) */}
                      {cert.image_url && (
                        <div 
                          style={{
                            position: 'relative',
                            width: '100%',
                            height: '115px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            marginBottom: '0.75rem',
                            border: '1px solid rgba(0, 217, 255, 0.25)',
                            background: 'rgba(2, 8, 23, 0.7)',
                            cursor: 'pointer'
                          }}
                          onClick={() => setPreviewImage({ url: cert.image_url, title: cert.title })}
                          title="Click to view full certificate preview"
                        >
                          <img
                            src={cert.image_url}
                            alt={cert.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.3s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
                          />
                          <div style={{
                            position: 'absolute',
                            bottom: '6px',
                            right: '6px',
                            background: 'rgba(2, 8, 23, 0.88)',
                            padding: '0.2rem 0.45rem',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.68rem',
                            color: 'var(--color-neon-cyan)'
                          }}>
                            <Eye size={11} />
                            <span>Preview</span>
                          </div>
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span className={`badge ${isDemo ? 'badge-violet' : 'badge-cyan'}`} style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                          {cert.issuer}
                        </span>
                        {date && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
                            <Calendar size={12} />
                            <span>{date}</span>
                          </div>
                        )}
                      </div>

                      <h4 style={{ fontSize: '0.94rem', color: 'var(--color-white)', marginBottom: '0.25rem', lineHeight: 1.35, fontWeight: 600 }}>
                        {cert.title}
                      </h4>

                      {certId && (
                        <p style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--color-neon-cyan)', marginBottom: '0.5rem' }}>
                          ID: {certId}
                        </p>
                      )}

                      <p style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.45,
                        marginBottom: '0.75rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {cert.description}
                      </p>
                    </div>

                    <div>
                      {skills.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.75rem' }}>
                          {skills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.2rem',
                                fontSize: '0.68rem',
                                color: 'var(--text-secondary)',
                                background: 'rgba(2, 8, 23, 0.55)',
                                padding: '0.15rem 0.45rem',
                                borderRadius: 'var(--radius-xs)',
                                border: '1px solid rgba(0, 217, 255, 0.15)'
                              }}
                            >
                              <CheckCircle2 size={10} color="var(--color-neon-cyan)" />
                              {skill}
                            </span>
                          ))}
                          {skills.length > 3 && (
                            <span style={{ fontSize: '0.65rem', color: 'rgba(245, 248, 255, 0.5)', padding: '0.15rem 0.35rem', alignSelf: 'center' }}>
                              +{skills.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                        {cert.image_url && (
                          <button
                            type="button"
                            onClick={() => setPreviewImage({ url: cert.image_url, title: cert.title })}
                            className="certificate-link-btn"
                            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: '0.75rem' }}
                          >
                            <Eye size={13} />
                            <span>View Mockup</span>
                          </button>
                        )}

                        {link && (
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="certificate-link-btn"
                            style={{ fontSize: '0.75rem' }}
                          >
                            <ExternalLink size={13} />
                            <span>Verify Credential</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </MotionReveal>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBSECTION C: ACHIEVEMENTS */}
      {(activeTab === 'all' || activeTab === 'achievements') && (
        <div>
          {activeTab === 'all' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '2rem', justifyContent: 'center' }}>
              <Trophy size={22} color="var(--color-neon-cyan)" />
              <h3 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-white)', margin: 0, fontWeight: 700 }}>
                Milestones &amp; Technical Achievements
              </h3>
            </div>
          )}

          <div className="achievements-grid">
            {achievementsList.map((achieve, index) => {
              const highlights = Array.isArray(achieve.highlights) ? achieve.highlights : [];
              const link = achieve.link_url || achieve.url;

              return (
                <MotionReveal key={achieve.id || `achieve-${index}`} direction="up" delay={0.1 * (index + 1)}>
                  <GlassCard variant="default" glowColor="violet" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span className="badge badge-violet" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                          {achieve.category || 'Technical Milestone'}
                        </span>
                        {achieve.date && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
                            <Calendar size={12} />
                            <span>{achieve.date}</span>
                          </div>
                        )}
                      </div>

                      <h4 style={{ fontSize: '0.94rem', color: 'var(--color-white)', marginBottom: '0.25rem', lineHeight: 1.35, fontWeight: 600 }}>
                        {achieve.title}
                      </h4>

                      {achieve.organization && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-neon-cyan)', marginBottom: '0.5rem', fontWeight: 600 }}>
                          {achieve.organization}
                        </p>
                      )}

                      <p style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.45,
                        marginBottom: '0.75rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {achieve.description}
                      </p>
                    </div>

                    <div>
                      {highlights.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: link ? '0.75rem' : '0' }}>
                          {highlights.slice(0, 3).map((item) => (
                            <span
                              key={item}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.2rem',
                                fontSize: '0.68rem',
                                color: 'var(--text-secondary)',
                                background: 'rgba(2, 8, 23, 0.55)',
                                padding: '0.15rem 0.45rem',
                                borderRadius: 'var(--radius-xs)',
                                border: '1px solid rgba(113, 59, 255, 0.25)'
                              }}
                            >
                              <CheckCircle2 size={10} color="var(--color-violet)" />
                              {item}
                            </span>
                          ))}
                          {highlights.length > 3 && (
                            <span style={{ fontSize: '0.65rem', color: 'rgba(245, 248, 255, 0.5)', padding: '0.15rem 0.35rem', alignSelf: 'center' }}>
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
                          style={{ color: 'var(--color-violet)', fontSize: '0.75rem' }}
                        >
                          <ExternalLink size={13} />
                          <span>View Detail</span>
                        </a>
                      )}
                    </div>
                  </GlassCard>
                </MotionReveal>
              );
            })}
          </div>
        </div>
      )}

      {/* Lightbox Preview Modal for Certificate Images */}
      {previewImage && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(2, 8, 23, 0.92)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.5rem'
          }}
          onClick={() => setPreviewImage(null)}
        >
          <div 
            style={{
              position: 'relative',
              maxWidth: '960px',
              width: '100%',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 0 40px rgba(0, 217, 255, 0.35)',
              border: '1px solid rgba(0, 217, 255, 0.4)',
              background: 'var(--color-midnight)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 1.25rem',
              background: 'rgba(7, 27, 61, 0.85)',
              borderBottom: '1px solid rgba(0, 217, 255, 0.2)'
            }}>
              <span style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>
                {previewImage.title}
              </span>
              <button 
                onClick={() => setPreviewImage(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(245, 248, 255, 0.7)',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: '0.5rem', maxHeight: '80vh', overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
              <img 
                src={previewImage.url} 
                alt={previewImage.title} 
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} 
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default JourneySection;
