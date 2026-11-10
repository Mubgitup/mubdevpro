import React from 'react';
import { GlassCard } from './GlassCard';
import { Button } from './Button';
import { Github, ExternalLink, Code2 } from 'lucide-react';

export const ProjectCard = ({ project }) => {
  const imageUrl = project.image_url || project.image || null;
  const [imageError, setImageError] = React.useState(false);

  return (
    <GlassCard variant="interactive" glowColor="blue" className="project-card">
      <div>
        {/* Project Preview Mockup Header */}
        <div className="project-preview-mockup">
          {imageUrl && !imageError ? (
            <>
              <img
                src={imageUrl}
                alt={project.title}
                onError={() => setImageError(true)}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: 1,
                  filter: 'brightness(0.85) contrast(1.05)',
                  transition: 'transform 0.4s ease, filter 0.3s ease'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(2, 8, 23, 0.88) 0%, rgba(2, 8, 23, 0.3) 60%, transparent 100%)',
                  zIndex: 2
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--color-neon-cyan)',
                  zIndex: 3,
                  letterSpacing: '0.05em',
                  fontWeight: 600,
                  textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                }}
              >
                {project.category}
              </span>
            </>
          ) : (
            <>
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
            </>
          )}

          <span 
            className="badge" 
            style={{ 
              position: 'absolute', 
              top: '10px', 
              right: '10px', 
              fontSize: '0.65rem',
              zIndex: 4
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

