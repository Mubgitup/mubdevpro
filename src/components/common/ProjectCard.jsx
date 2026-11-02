import React from 'react';
import { GlassCard } from './GlassCard';
import { Button } from './Button';
import { Github, ExternalLink, Code2 } from 'lucide-react';

export const ProjectCard = ({ project }) => {
  return (
    <GlassCard variant="interactive" glowColor="blue" className="project-card">
      <div>
        {/* Project Preview Mockup Header */}
        <div className="project-preview-mockup">
          <Code2 size={36} color="var(--color-neon-cyan)" style={{ zIndex: 1 }} />
          <span 
            style={{ 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.75rem', 
              color: 'var(--text-secondary)',
              zIndex: 1,
              letterSpacing: '0.05em'
            }}
          >
            {project.category}
          </span>
          <span 
            className="badge" 
            style={{ 
              position: 'absolute', 
              top: '10px', 
              right: '10px', 
              fontSize: '0.65rem',
              zIndex: 2
            }}
          >
            {project.badge}
          </span>
        </div>

        {/* Title & Description */}
        <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: '0.5rem', color: 'var(--color-white)' }}>
          {project.title}
        </h3>
        
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {project.description}
        </p>

        {/* Tech Stack Tags */}
        <div className="project-tag-list">
          {project.technologies.map((tech) => (
            <span key={tech} className="project-tech-tag">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Card Action Links */}
      <div className="project-card-actions">
        {project.githubUrl && (
          <Button
            variant="secondary"
            size="sm"
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            icon={<Github size={14} />}
          >
            Source Code
          </Button>
        )}

        {project.liveUrl ? (
          <Button
            variant="primary"
            size="sm"
            href={project.liveUrl}
            icon={<ExternalLink size={14} />}
            iconPosition="right"
          >
            View Demo
          </Button>
        ) : (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            [Lab Practice Build]
          </span>
        )}
      </div>
    </GlassCard>
  );
};

export default ProjectCard;

