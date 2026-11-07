import React, { useState, useEffect } from 'react';
import { SectionHeader } from '../components/common/SectionHeader';
import { SkillCard } from '../components/common/SkillCard';
import { MotionReveal } from '../components/common/MotionReveal';
import { getSkillsData } from '../data/skillsData';

/**
 * SkillsSection Component
 * 
 * Renders the portfolio technical skills section with official technology logos
 * and responsive glassmorphic cards. Automatically synchronizes with admin changes.
 */
export const SkillsSection = () => {
  const [categories, setCategories] = useState(getSkillsData);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setCategories(e.detail);
      } else {
        setCategories(getSkillsData());
      }
    };

    window.addEventListener('mubdev_skills_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('mubdev_skills_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return (
    <section className="section-container section-py" id="skills">
      <MotionReveal direction="up" delay={0.1}>
        <SectionHeader
          badge="Technical Arsenal"
          title="Skills & Technologies"
          highlightText="in Development"
          subtitle="A verified overview of my programming languages, frameworks, databases, and developer tools."
        />
      </MotionReveal>

      <div className="skills-grid">
        {categories.map((category, index) => (
          <MotionReveal key={category.id} direction="up" delay={0.1 * (index + 1)}>
            <SkillCard category={category} />
          </MotionReveal>
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;
