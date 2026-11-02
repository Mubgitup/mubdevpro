import React from 'react';
import { SectionHeader } from '../components/common/SectionHeader';
import { SkillCard } from '../components/common/SkillCard';
import { SKILL_CATEGORIES } from '../data/skillsData';

export const SkillsSection = () => {
  return (
    <section className="section-container section-py" id="skills">
      <SectionHeader
        badge="Technical Arsenal"
        title="Skills & Technologies"
        highlightText="in Development"
        subtitle="A verified overview of my programming languages, frameworks, and tools across frontend, systems, backend, and databases."
      />

      <div className="skills-grid">
        {SKILL_CATEGORIES.map((category) => (
          <SkillCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;
