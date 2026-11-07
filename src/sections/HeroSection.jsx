import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/common/Button';
import { BRAND_PROFILE, ASSET_PATHS } from '../data/brandConfig';
import { GraduationCap, Code2, Compass, ArrowRight, Mail, Sparkles, Terminal } from 'lucide-react';

export const HeroSection = () => {
  // Staggered entrance animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const portraitVariants = {
    hidden: { opacity: 0, scale: 0.94 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }
    }
  };

  return (
    <section className="section-container hero-wrapper" id="hero">
      {/* --- Main 2-Column Hero Grid --- */}
      <motion.div
        className="hero-main-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Column: Profile, Headings & Actions */}
        <div className="hero-left-content">
          {/* Student Status Badge */}
          <motion.div variants={itemVariants} className="badge" style={{ marginBottom: '0.75rem' }}>
            <span className="badge-dot" />
            <span>Software Engineering Student</span>
          </motion.div>

          {/* Name Heading */}
          <motion.h1 variants={itemVariants} className="hero-heading">
            {BRAND_PROFILE.name}
          </motion.h1>

          {/* Role Title */}
          <motion.div variants={itemVariants} className="hero-role-title">
            Aspiring <span className="gradient-text">Full-Stack Developer</span>
          </motion.div>

          {/* Introduction Paragraph */}
          <motion.p variants={itemVariants} className="hero-intro">
            {BRAND_PROFILE.heroDescription}
          </motion.p>

          {/* CTA Actions */}
          <motion.div variants={itemVariants} className="hero-actions">
            <Button
              variant="primary"
              size="lg"
              href="#projects"
              icon={<ArrowRight size={18} />}
              iconPosition="right"
            >
              View My Projects
            </Button>

            <Button
              variant="secondary"
              size="lg"
              href="#contact"
              icon={<Mail size={18} />}
            >
              Contact Me
            </Button>
          </motion.div>
        </div>

        {/* Right Column: Seamless Integrated Portrait Stage */}
        <motion.div className="hero-portrait-container" variants={portraitVariants}>
          <div className="hero-portrait-stage">
            {/* Orbital Cyber Rings Decoration */}
            <div className="hero-orbit-ring" aria-hidden="true" />
            <div className="hero-orbit-ring-secondary" aria-hidden="true" />

            {/* Floating Element 1: React & Frontend */}
            <div className="floating-chip floating-chip-1">
              <Code2 size={16} color="var(--color-neon-cyan)" />
              <span>React & Frontend</span>
            </div>

            {/* Floating Element 2: Python & Django */}
            <div className="floating-chip floating-chip-2">
              <Terminal size={16} color="var(--color-electric-blue)" />
              <span>Python & Django</span>
            </div>

            {/* Floating Element 3: Full-Stack Architecture */}
            <div className="floating-chip floating-chip-3">
              <Sparkles size={16} color="var(--color-violet)" />
              <span>Full-Stack Engineering</span>
            </div>

            {/* Seamless, Borderless Blended Portrait Asset */}
            <div className="hero-portrait-blended">
              <img
                src={ASSET_PATHS.heroPortrait || ASSET_PATHS.placeholderPortrait}
                alt="Mubarek Hussein - Mubdev Software Developer"
                className="hero-portrait-img"
                width="1024"
                height="819"
                loading="eager"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* --- Bottom Information Blocks with Scroll-Triggered Reveal --- */}
      <motion.div
        className="hero-bottom-grid"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Block 1 */}
        <div className="hero-info-card">
          <div className="hero-info-icon-box">
            <GraduationCap size={22} />
          </div>
          <div>
            <div className="hero-info-title">Haramaya University</div>
            <div className="hero-info-sub">3rd Year Software Engineering</div>
          </div>
        </div>

        {/* Block 2 */}
        <div className="hero-info-card">
          <div className="hero-info-icon-box">
            <Code2 size={22} />
          </div>
          <div>
            <div className="hero-info-title">Web Development & Programming</div>
            <div className="hero-info-sub">Frontend, Backend & Systems</div>
          </div>
        </div>

        {/* Block 3 */}
        <div className="hero-info-card">
          <div className="hero-info-icon-box">
            <Compass size={22} />
          </div>
          <div>
            <div className="hero-info-title">Always Learning & Exploring</div>
            <div className="hero-info-sub">Continuous Skill Expansion</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
