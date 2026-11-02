import React, { useState } from 'react';
import { SectionHeader } from '../components/common/SectionHeader';
import { ProjectCard } from '../components/common/ProjectCard';
import { MotionReveal } from '../components/common/MotionReveal';
import { PROJECTS, PROJECT_CATEGORIES } from '../data/projectsData';

export const ProjectsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProjects = selectedCategory === 'All'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === selectedCategory);

  return (
    <section className="section-container section-py" id="projects">
      <MotionReveal direction="up" delay={0.1}>
        <SectionHeader
          badge="Featured Work"
          title="Software & Practice"
          highlightText="Projects"
          subtitle="Selected academic, coursework, and personal engineering experiments showcasing hands-on programming and web development."
        />
      </MotionReveal>

      {/* Category Filter Pills */}
      <MotionReveal direction="up" delay={0.2}>
        <div className="project-filters" role="tablist" aria-label="Project category filters">
          {PROJECT_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={selectedCategory === category}
              className={`project-filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </MotionReveal>

      {/* Projects Grid */}
      <div className="projects-grid">
        {filteredProjects.map((project, index) => (
          <MotionReveal key={project.id} direction="up" delay={0.1 * (index + 1)}>
            <ProjectCard project={project} />
          </MotionReveal>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
