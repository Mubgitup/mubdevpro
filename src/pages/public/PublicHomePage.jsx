import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { HeroSection } from '../../sections/HeroSection';
import { AboutSection } from '../../sections/AboutSection';
import { SkillsSection } from '../../sections/SkillsSection';
import { ProjectsSection } from '../../sections/ProjectsSection';
import { JourneySection } from '../../sections/JourneySection';
import { ContactSection } from '../../sections/ContactSection';

/**
 * Public Mubdev Homepage Component
 * Preserves 100% of the approved personal portfolio layout, 3D scenes,
 * glowing header, sections, and brand styling.
 */
export const PublicHomePage = () => {
  return (
    <Layout>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <JourneySection />
      <ContactSection />
    </Layout>
  );
};

export default PublicHomePage;

