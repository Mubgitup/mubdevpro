import React from 'react';
import { GlassCard } from './GlassCard';
import { Layers, Terminal, Server, Database } from 'lucide-react';

const CATEGORY_ICONS = {
  frontend: Layers,
  programming: Terminal,
  backend: Server,
  database: Database
};

export const SkillCard = ({ category }) => {
  const IconComponent = CATEGORY_ICONS[category.id] || Terminal;

  return (
    <GlassCard variant="interactive" glowColor="cyan" className="skill-category-box">
      <div className="skill-category-header">
        <IconComponent size={20} color="var(--color-neon-cyan)" />
        <h3 style={{ fontSize: 'var(--text-lg)' }}>{category.title}</h3>
      </div>

      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
        {category.description}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {category.skills.map((skill) => (
          <div key={skill.name} className="skill-item">
            <div className="skill-item-header">
              <span className="skill-name">{skill.name}</span>
              <span className="skill-status-tag">{skill.status}</span>
            </div>
            <p className="skill-desc">{skill.description}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default SkillCard;
