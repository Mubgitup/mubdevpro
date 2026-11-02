import React from 'react';

/**
 * Reusable Section Header Component
 * 
 * @param {Object} props
 * @param {string} props.badge - Small uppercase badge label
 * @param {string} props.title - Primary section title
 * @param {string} [props.highlightText] - Highlighted gradient text in title
 * @param {string} [props.subtitle] - Supporting description paragraph
 * @param {'center' | 'left'} [props.align='center']
 */
export const SectionHeader = ({
  badge,
  title,
  highlightText,
  subtitle,
  align = 'center'
}) => {
  return (
    <div
      className="section-header"
      style={{
        textAlign: align,
        marginLeft: align === 'left' ? 0 : 'auto',
        marginRight: align === 'left' ? 0 : 'auto'
      }}
    >
      {badge && (
        <div className="badge" style={{ marginBottom: '1rem' }}>
          <span className="badge-dot" />
          <span>{badge}</span>
        </div>
      )}

      <h2>
        {title}{' '}
        {highlightText && <span className="gradient-text">{highlightText}</span>}
      </h2>

      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
};

export default SectionHeader;
