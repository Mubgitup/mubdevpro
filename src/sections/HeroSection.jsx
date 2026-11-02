import React from 'react';
import { Button } from '../components/common/Button';
import { BRAND_PROFILE, ASSET_PATHS } from '../data/brandConfig';
import { GraduationCap, Code2, Compass, ArrowRight, Mail, Sparkles, Terminal } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="section-container hero-wrapper" id="hero">
      {/* --- Main 2-Column Hero Grid --- */}
      <div className="hero-main-grid">
        
        {/* Left Column: Profile, Headings & Actions */}
        <div className="hero-left-content">
          {/* Student Status Badge */}
          <div className="badge" style={{ marginBottom: '0.75rem' }}>
            <span className="badge-dot" />
            <span>Software Engineering Student</span>
          </div>

          {/* Name Heading */}
          <h1 className="hero-heading">
            {BRAND_PROFILE.name}
          </h1>

          {/* Role Title */}
          <div className="hero-role-title">
            Aspiring <span className="gradient-text">Full-Stack Developer</span>
          </div>

          {/* Introduction Paragraph */}
          <p className="hero-intro">
            {BRAND_PROFILE.heroDescription}
          </p>

          {/* CTA Actions */}
          <div className="hero-actions">
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
          </div>
        </div>

        {/* Right Column: Hero Portrait & Floating Tech Elements */}
        <div className="hero-portrait-container">
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

          {/* Integrated Replaceable Portrait Frame */}
          <div className="hero-portrait-frame">
            <img
              src={ASSET_PATHS.placeholderPortrait}
              alt="Mubarek Hussein - Mubdev Replaceable Portrait Slot"
              className="hero-portrait-img"
              width="480"
              height="580"
              loading="eager"
            />
          </div>
        </div>

      </div>

      {/* --- Bottom Information Blocks --- */}
      <div className="hero-bottom-grid">
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
      </div>
    </section>
  );
};

export default HeroSection;
