import React, { useState, useEffect } from 'react';
import { SectionHeader } from '../components/common/SectionHeader';
import { ProjectCard } from '../components/common/ProjectCard';
import { MotionReveal } from '../components/common/MotionReveal';
import { PROJECTS, PROJECT_CATEGORIES } from '../data/projectsData';
import { api } from '../services/api';

export const ProjectsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [projectsList, setProjectsList] = useState(PROJECTS);

  useEffect(() => {
    let isMounted = true;
    api.projects.listPublic()
      .then((res) => {
        const items = Array.isArray(res?.data) 
          ? res.data 
          : Array.isArray(res?.data?.projects) 
            ? res.data.projects 
            : Array.isArray(res?.projects) 
              ? res.projects 
              : null;
        if (isMounted && items && items.length > 0) {
          setProjectsList(items);
        }
      })
      .catch((_err) => {
        // Graceful fallback to static projects data if offline
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProjects = selectedCategory === 'All'
    ? projectsList
    : projectsList.filter((p) => p.category === selectedCategory);

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
