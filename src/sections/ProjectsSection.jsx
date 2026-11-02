import React, { useState } from 'react';
import { SectionHeader } from '../components/common/SectionHeader';
import { ProjectCard } from '../components/common/ProjectCard';
import { PROJECTS, PROJECT_CATEGORIES } from '../data/projectsData';

export const ProjectsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProjects = selectedCategory === 'All'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === selectedCategory);

  return (
    <section className="section-container section-py" id="projects">
      <SectionHeader
        badge="Featured Work"
        title="Software & Practice"
        highlightText="Projects"
        subtitle="Selected academic, coursework, and personal engineering experiments showcasing hands-on programming and web development."
      />

      {/* Category Filter Pills */}
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

      {/* Projects Grid */}
      <div className="projects-grid">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
