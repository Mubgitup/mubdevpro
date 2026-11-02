import React from 'react';
import { GlassCard } from './GlassCard';
import { Calendar, CheckCircle } from 'lucide-react';

export const TimelineItem = ({ milestone }) => {
  return (
    <div className="timeline-item">
      <div className="timeline-node-pin">
        <div className="timeline-node-inner" />
      </div>

      <GlassCard variant="default" glowColor="cyan">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div>
            <span className="badge badge-violet" style={{ marginBottom: '0.4rem' }}>
              {milestone.type}
            </span>
            <h3 style={{ fontSize: 'var(--text-lg)', color: 'var(--color-white)' }}>
              {milestone.title}
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neon-cyan)', margin: '0.2rem 0 0.5rem 0', fontWeight: 600 }}>
              {milestone.organization}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)' }}>
            <Calendar size={14} />
            <span>{milestone.status}</span>
          </div>
        </div>

        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
          {milestone.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {milestone.highlights.map((highlight) => (
            <span
              key={highlight}
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
      </GlassCard>
    </div>
  );
};

export default TimelineItem;

