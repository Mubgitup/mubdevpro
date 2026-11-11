import React from 'react';
import { GlassCard } from './GlassCard';
import { Calendar, CheckCircle, GraduationCap, MapPin, BookOpen, Clock } from 'lucide-react';

export const TimelineItem = ({ milestone }) => {
  const highlights = Array.isArray(milestone.highlights) ? milestone.highlights : [];
  const title = milestone.degree || milestone.title || 'Coursework & Studies';
  const organization = milestone.institution || milestone.organization || 'Haramaya University';
  const fieldOfStudy = milestone.field_of_study;
  const isCurrent = Boolean(milestone.is_current);

  // Determine study period string
  let periodText = '';
  if (milestone.start_date && milestone.end_date) {
    periodText = `${milestone.start_date} – ${milestone.end_date}`;
  } else if (milestone.start_date) {
    periodText = `${milestone.start_date} – ${isCurrent ? 'Present' : 'Completed'}`;
  } else if (milestone.period) {
    periodText = milestone.period;
  }

  // Determine status label
  const statusLabel = milestone.status || (isCurrent ? 'Currently Studying' : 'Completed Milestone');

  return (
    <div className="timeline-item">
      <div className="timeline-node-pin">
        <div className="timeline-node-inner" />
      </div>

      <GlassCard variant="default" glowColor={isCurrent ? 'cyan' : 'blue'}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flex: 1, minWidth: '240px' }}>
            {/* Institution Logo / Emblem */}
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                background: 'rgba(8, 123, 255, 0.12)',
                border: '1px solid rgba(0, 217, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0
              }}
            >
              {milestone.image_url ? (
                <img
                  src={milestone.image_url}
                  alt={organization}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextSibling) {
                      e.currentTarget.nextSibling.style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div style={{ display: milestone.image_url ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GraduationCap size={22} color="var(--color-neon-cyan)" />
              </div>
            </div>

            {/* Title & Organization Details */}
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                <span className={`badge ${isCurrent ? 'badge-cyan' : 'badge-violet'}`} style={{ fontSize: '0.7rem' }}>
                  {milestone.type || (isCurrent ? 'Academic Degree' : 'Professional Milestone')}
                </span>
                {fieldOfStudy && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-secondary)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    <BookOpen size={12} color="var(--color-electric-blue)" />
                    {fieldOfStudy}
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: 'var(--text-lg)', color: 'var(--color-white)', margin: 0, fontWeight: 700, lineHeight: 1.3 }}>
                {title}
              </h3>

              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neon-cyan)', margin: '0.25rem 0 0.2rem 0', fontWeight: 600 }}>
                {organization}
              </p>

              {milestone.location && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  <MapPin size={12} />
                  <span>{milestone.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Period & Academic Status Badges */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem', flexShrink: 0 }}>
            {periodText && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-mono)',
                  background: 'rgba(2, 8, 23, 0.5)',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(0, 217, 255, 0.15)'
                }}
              >
                <Calendar size={13} color="var(--color-neon-cyan)" />
                <span>{periodText}</span>
              </div>
            )}

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: isCurrent ? 'var(--color-neon-cyan)' : 'var(--text-muted)',
                fontSize: '0.72rem',
                fontWeight: 600
              }}
            >
              <Clock size={12} />
              <span>{statusLabel}</span>
            </div>
          </div>
        </div>

        {milestone.description && (
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.65 }}>
            {milestone.description}
          </p>
        )}

        {highlights.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(0, 217, 255, 0.08)' }}>
            {highlights.map((highlight, idx) => (
              <span
                key={`${milestone.id || 'milestone'}-hl-${idx}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  background: 'rgba(2, 8, 23, 0.5)',
                  padding: '0.25rem 0.6rem',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid rgba(0, 217, 255, 0.15)'
                }}
              >
                <CheckCircle size={12} color="var(--color-neon-cyan)" />
                {highlight}
              </span>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default TimelineItem;
