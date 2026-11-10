import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Button } from '../components/common/Button';
import { BRAND_PROFILE, ASSET_PATHS } from '../data/brandConfig';
import { GraduationCap, Code2, Compass, ArrowRight, Mail, Sparkles, Terminal } from 'lucide-react';

export const HeroSection = () => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // 3D Tilt Spring Physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 180, mass: 0.6 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ['14deg', '-14deg']);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ['-16deg', '16deg']);
  const glareX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

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
      {/* --- Ambient 3D Hero Background Atmosphere --- */}
      <div className="hero-ambient-backdrop" aria-hidden="true">
        <div
          className="hero-backdrop-image"
          style={{ backgroundImage: `url(${ASSET_PATHS.heroPortrait || ASSET_PATHS.placeholderPortrait})` }}
        />
        <div className="hero-backdrop-glow" />
      </div>

      {/* --- Main 2-Column Hero Grid --- */}
      <motion.div
        className="hero-main-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Column: Profile, Headings & Actions */}
        <div className="hero-left-content">
          <motion.div variants={itemVariants} className="badge" style={{ marginBottom: '0.75rem' }}>
            <span className="badge-dot" />
            <span>Software Engineering Student</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="hero-heading">
            {BRAND_PROFILE.name}
          </motion.h1>

          <motion.div variants={itemVariants} className="hero-role-title">
            Aspiring <span className="gradient-text">Full-Stack Developer</span>
          </motion.div>

          <motion.p variants={itemVariants} className="hero-intro">
            {BRAND_PROFILE.heroDescription}
          </motion.p>

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

        {/* Right Column: 3D Holographic Stage with Increased Height */}
        <motion.div className="hero-portrait-container" variants={portraitVariants}>
          <div
            ref={cardRef}
            className="hero-3d-stage-wrapper"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              className="hero-portrait-stage"
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d'
              }}
              animate={isHovered ? { scale: 1.02 } : { scale: 1 }}
              transition={{ duration: 0.25 }}
            >
              {/* Back Orbital Cyber Rings (-30px Z) */}
              <div className="hero-orbit-ring" style={{ transform: 'translateZ(-30px)' }} aria-hidden="true" />
              <div className="hero-orbit-ring-secondary" style={{ transform: 'translateZ(-45px)' }} aria-hidden="true" />

              {/* Seamless Blended Tall 3D Portrait (0px Z) */}
              <div className="hero-portrait-blended" style={{ transform: 'translateZ(0px)' }}>
                <img
                  src={ASSET_PATHS.heroPortrait || ASSET_PATHS.placeholderPortrait}
                  alt="Mubarek Hussein - Mubdev Software Developer"
                  className="hero-portrait-img"
                  width="1024"
                  height="819"
                  loading="eager"
                />

                {/* Dynamic Specular 3D Holographic Glare Sheen */}
                <motion.div
                  className="hero-portrait-glare"
                  style={{
                    background: `radial-gradient(circle 350px at ${glareX} ${glareY}, rgba(0, 217, 255, 0.25) 0%, rgba(113, 59, 255, 0.12) 40%, transparent 80%)`,
                    opacity: isHovered ? 1 : 0.35
                  }}
                  aria-hidden="true"
                />

                {/* Cyber Corner Brackets */}
                <div className="hero-cyber-brackets" aria-hidden="true">
                  <span className="bracket bracket-tl" />
                  <span className="bracket bracket-tr" />
                  <span className="bracket bracket-bl" />
                  <span className="bracket bracket-br" />
                </div>
              </div>

              {/* Floating Tech Chips (+55px to +75px Z in front) */}
              <div
                className="floating-chip floating-chip-1"
                style={{ transform: 'translateZ(65px)' }}
              >
                <Code2 size={16} color="var(--color-neon-cyan, #00D9FF)" />
                <span>React & Frontend</span>
              </div>

              <div
                className="floating-chip floating-chip-2"
                style={{ transform: 'translateZ(55px)' }}
              >
                <Terminal size={16} color="var(--color-electric-blue, #087BFF)" />
                <span>Python & Django</span>
              </div>

              <div
                className="floating-chip floating-chip-3"
                style={{ transform: 'translateZ(75px)' }}
              >
                <Sparkles size={16} color="var(--color-violet, #713BFF)" />
                <span>Full-Stack Engineering</span>
              </div>
            </motion.div>
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
        <div className="hero-info-card">
          <div className="hero-info-icon-box">
            <GraduationCap size={22} />
          </div>
          <div>
            <div className="hero-info-title">Haramaya University</div>
            <div className="hero-info-sub">3rd Year Software Engineering</div>
          </div>
        </div>

        <div className="hero-info-card">
          <div className="hero-info-icon-box">
            <Code2 size={22} />
          </div>
          <div>
            <div className="hero-info-title">Web Development & Programming</div>
            <div className="hero-info-sub">Frontend, Backend & Systems</div>
          </div>
        </div>

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
