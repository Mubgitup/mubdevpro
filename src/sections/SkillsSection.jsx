import React from 'react';
import { SectionHeader } from '../components/common/SectionHeader';
import { SkillCard } from '../components/common/SkillCard';
import { MotionReveal } from '../components/common/MotionReveal';
import { SKILL_CATEGORIES } from '../data/skillsData';

export const SkillsSection = () => {
  return (
    <section className="section-container section-py" id="skills">
      <MotionReveal direction="up" delay={0.1}>
        <SectionHeader
          badge="Technical Arsenal"
          title="Skills & Technologies"
          highlightText="in Development"
          subtitle="A verified overview of my programming languages, frameworks, and tools across frontend, systems, backend, and databases."
        />
      </MotionReveal>

      <div className="skills-grid">
        {SKILL_CATEGORIES.map((category, index) => (
          <MotionReveal key={category.id} direction="up" delay={0.15 * (index + 1)}>
            <SkillCard category={category} />
          </MotionReveal>
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;
