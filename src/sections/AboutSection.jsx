import React, { useState, useEffect } from 'react';
import { SectionHeader } from '../components/common/SectionHeader';
import { GlassCard } from '../components/common/GlassCard';
import { MotionReveal } from '../components/common/MotionReveal';
import { BRAND_PROFILE, ASSET_PATHS } from '../data/brandConfig';
import { User, BookOpen, Target, Sparkles, Code2, Server } from 'lucide-react';
import { api } from '../services/api';

export const AboutSection = () => {
  const [aboutImage, setAboutImage] = useState(() => {
    return localStorage.getItem('mubdev_about_photo') || ASSET_PATHS.heroPortrait;
  });

  useEffect(() => {
    if (api?.siteImages?.list) {
      api.siteImages.list()
        .then((res) => {
          const imgUrl = res?.data?.about_photo?.image_url;
          if (imgUrl) {
            setAboutImage(imgUrl);
            localStorage.setItem('mubdev_about_photo', imgUrl);
          }
        })
        .catch(() => {});
    }

    const handleStorage = (e) => {
      if (e.key === 'mubdev_about_photo' && e.newValue) {
        setAboutImage(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <section className="section-container section-py" id="about">
      <MotionReveal direction="up" delay={0.1}>
        <SectionHeader
          badge="About Me"
          title="Engineering Passionate &"
          highlightText="Modern Web Solutions"
          subtitle="Bridging academic software engineering principles with practical full-stack web development."
        />
      </MotionReveal>

      <div className="about-grid">
        {/* Left Column: Core Narrative & Background */}
        <MotionReveal direction="up" delay={0.2}>
          <GlassCard variant="default" glowColor="cyan" className="about-card-left" style={{ height: '100%' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
                {aboutImage && (
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid var(--color-neon-cyan)',
                    boxShadow: '0 0 10px rgba(0, 217, 255, 0.4)',
                    flexShrink: 0
                  }}>
                    <img src={aboutImage} alt={BRAND_PROFILE.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div>
                  <h3 style={{ fontSize: 'var(--text-2xl)', margin: 0 }}>Who I Am</h3>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neon-cyan)', fontFamily: 'var(--font-mono)' }}>
                    {BRAND_PROFILE.brand} Profile
                  </div>
                </div>
              </div>

              <p style={{ lineHeight: 1.7, marginBottom: '1.25rem', fontSize: 'var(--text-base)' }}>
                I am <strong style={{ color: 'var(--color-white)' }}>{BRAND_PROFILE.name}</strong>, a third-year 
                Software Engineering student at <strong style={{ color: 'var(--color-neon-cyan)' }}>{BRAND_PROFILE.education.university}</strong>. 
                My journey into technology is driven by a deep fascination with how code translates into impactful, 
                scalable human experiences.
              </p>

              <p style={{ lineHeight: 1.7, marginBottom: '1.25rem', fontSize: 'var(--text-base)' }}>
                My academic coursework provides me with a grounded foundation in object-oriented programming, data structures, 
                systems programming in C++, and software design principles. Alongside my studies, I have dedicated myself to 
                mastering the modern web stack—progressing from core HTML, CSS, and JavaScript to modular React applications and 
                backend architectures.
              </p>

              <p style={{ lineHeight: 1.7, fontSize: 'var(--text-base)' }}>
                My technical focus is directed towards becoming an <strong style={{ color: 'var(--color-white)' }}>Aspiring Full-Stack Developer</strong>, 
                capable of architecting reliable backend systems with Python and Django, while crafting fluid, responsive interfaces 
                with React and modern CSS.
              </p>
            </div>

            {/* Quick Pillars Grid */}
            <div className="about-pillars">
              <div className="about-pillar-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <Code2 size={16} color="var(--color-neon-cyan)" />
                  <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-white)' }}>Frontend Craft</span>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0 }}>
                  Designing responsive layouts with React, CSS Variables, and clean component systems.
                </p>
              </div>

              <div className="about-pillar-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <Server size={16} color="var(--color-electric-blue)" />
                  <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-white)' }}>Backend Systems</span>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0 }}>
                  Developing server logic, database interactions, and REST APIs with Python, Django, and PHP.
                </p>
              </div>
            </div>
          </GlassCard>
        </MotionReveal>

        {/* Right Column: Education, Learning Focus & Goals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Education Block */}
          <MotionReveal direction="up" delay={0.3}>
            <GlassCard variant="interactive" glowColor="blue">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <BookOpen size={20} color="var(--color-electric-blue)" />
                <h4 style={{ fontSize: 'var(--text-lg)' }}>Software Engineering Education</h4>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                <strong>Haramaya University</strong> • 3rd Year
              </p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Rigorous degree curriculum covering Software Modeling, Systems Programming, Database Management Systems, 
                and Algorithmic Complexity.
              </p>
            </GlassCard>
          </MotionReveal>

          {/* Current Focus Block */}
          <MotionReveal direction="up" delay={0.4}>
            <GlassCard variant="interactive" glowColor="cyan">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Sparkles size={20} color="var(--color-neon-cyan)" />
                <h4 style={{ fontSize: 'var(--text-lg)' }}>Current Learning Focus</h4>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Expanding Full-Stack Proficiency
              </p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Currently deepening backend API patterns with Django & Django REST Framework, exploring relational 
                MySQL database schemas, and learning PHP server-side fundamentals.
              </p>
            </GlassCard>
          </MotionReveal>

          {/* Professional Goals Block */}
          <MotionReveal direction="up" delay={0.5}>
            <GlassCard variant="interactive" glowColor="violet">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Target size={20} color="var(--color-violet)" />
                <h4 style={{ fontSize: 'var(--text-lg)' }}>Long-Term Goals</h4>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Engineering Scalable Impact
              </p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                To engineer maintainable, accessible software systems that solve tangible problems, continually contributing 
                to collaborative open-source and high-quality software engineering teams.
              </p>
            </GlassCard>
          </MotionReveal>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
