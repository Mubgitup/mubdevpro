import React from 'react';
import { GlassCard } from './GlassCard';
import { TechIcon } from './TechIcon';
import { Layers, Terminal, Server, Database, GitBranch } from 'lucide-react';

const CATEGORY_ICONS = {
  frontend: Layers,
  programming: Terminal,
  backend: Server,
  database: Database,
  tools: GitBranch
};

/**
 * SkillCard Component
 * 
 * Displays a category of technical skills. Each individual technology is rendered
 * inside a modern glassmorphism card featuring its authentic official vector logo,
 * verified proficiency status pill, and concise descriptive details.
 */
export const SkillCard = ({ category }) => {
  const IconComponent = CATEGORY_ICONS[category.id] || Terminal;
  const skillsCount = category.skills?.length || 0;

  return (
    <GlassCard variant="interactive" glowColor="cyan" className="skill-category-box">
      <div className="skill-category-header">
        <div className="skill-category-icon-wrapper" aria-hidden="true">
          <IconComponent size={20} color="var(--color-neon-cyan, #00D9FF)" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 className="skill-category-title">{category.title}</h3>
          <span className="skill-count-badge">
            {skillsCount} {skillsCount === 1 ? 'Technology' : 'Technologies'}
          </span>
        </div>
      </div>

      <p className="skill-category-description">
        {category.description}
      </p>

      <div className="skills-items-container">
        {category.skills.map((skill) => {
          const accentColor = skill.color || '#00D9FF';

          return (
            <div
              key={skill.name}
              className="skill-item-card"
              style={{ '--skill-accent': accentColor }}
            >
              {/* Prominent Official Technology Logo */}
              <div
                className="skill-logo-badge"
                style={{
                  borderColor: `${accentColor}33`,
                  backgroundColor: 'rgba(2, 8, 23, 0.6)'
                }}
              >
                <TechIcon
                  name={skill.icon || skill.name}
                  size={26}
                  color={skill.color}
                />
              </div>

              {/* Technology Information */}
              <div className="skill-content-block">
                <div className="skill-item-header">
                  <span className="skill-name">{skill.name}</span>
                  <span
                    className="skill-status-tag"
                    style={{
                      borderColor: `${accentColor}40`,
                      color: accentColor,
                      backgroundColor: `${accentColor}12`
                    }}
                  >
                    {skill.status}
                  </span>
                </div>
                <p className="skill-desc">{skill.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};

export default SkillCard;
