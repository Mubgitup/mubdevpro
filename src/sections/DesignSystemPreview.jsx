import React from 'react';
import { Button } from '../components/common/Button';
import { GlassCard } from '../components/common/GlassCard';
import { BRAND_PROFILE, BRAND_COLORS, ASSET_PATHS } from '../data/brandConfig';
import { Terminal, Code, Cpu, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const DesignSystemPreview = () => {
  const palette = [
    { name: 'Midnight', hex: BRAND_COLORS.midnight, role: 'Deepest background', border: 'rgba(255,255,255,0.1)' },
    { name: 'Deep Navy', hex: BRAND_COLORS.deepNavy, role: 'Surface & panel background', border: 'rgba(255,255,255,0.1)' },
    { name: 'Electric Blue', hex: BRAND_COLORS.electricBlue, role: 'Primary interaction & glow', border: 'none' },
    { name: 'Neon Cyan', hex: BRAND_COLORS.neonCyan, role: 'Accent highlights & borders', border: 'none' },
    { name: 'Violet', hex: BRAND_COLORS.violet, role: 'Secondary cyber accent', border: 'none' },
    { name: 'White', hex: BRAND_COLORS.white, role: 'High-contrast text primary', border: 'none' }
  ];

  return (
    <div className="section-container section-py" id="overview">
      {/* --- Phase 1 Verification Header --- */}
      <div className="section-header">
        <div className="badge" style={{ marginBottom: '1.25rem' }}>
          <span className="badge-dot" />
          <span>PHASE 1 VERIFICATION • DESIGN SYSTEM & FOUNDATION</span>
        </div>
        
        <h1 style={{ marginBottom: '1rem' }}>
          Architecting <span className="gradient-text">Futuristic Digital</span> Experiences
        </h1>
        
        <p className="section-subtitle">
          Official design system and layout foundation for <span className="neon-highlight">Mubdev</span> — 
          personal brand of {BRAND_PROFILE.name}.
        </p>
      </div>

      {/* --- Profile & Verification Grid --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        
        {/* Profile Card */}
        <GlassCard variant="interactive" glowColor="cyan">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Terminal size={22} color="var(--color-neon-cyan)" />
            <h3 style={{ fontSize: 'var(--text-xl)' }}>Brand Profile</h3>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            <strong style={{ color: 'var(--color-white)' }}>Developer:</strong> {BRAND_PROFILE.name}
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            <strong style={{ color: 'var(--color-white)' }}>Role:</strong> {BRAND_PROFILE.professionalDirection}
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            <strong style={{ color: 'var(--color-white)' }}>Education:</strong> {BRAND_PROFILE.education.year}, {BRAND_PROFILE.education.degree} at {BRAND_PROFILE.education.university}
          </p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {BRAND_PROFILE.technologies.map(tech => (
              <span 
                key={tech.name} 
                className="badge" 
                style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem' }}
              >
                {tech.name} {tech.note ? `(${tech.note})` : ''}
              </span>
            ))}
          </div>
        </GlassCard>

        {/* Temporary Portrait Asset Display */}
        <GlassCard variant="interactive" glowColor="blue">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Cpu size={22} color="var(--color-electric-blue)" />
            <h3 style={{ fontSize: 'var(--text-xl)' }}>Hero Portrait Asset</h3>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Configured replaceable hero portrait asset slot. Meets requirement to avoid inventing a permanent portrait.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(2, 8, 23, 0.6)', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px dashed rgba(0, 217, 255, 0.3)' }}>
            <img 
              src={ASSET_PATHS.placeholderPortrait} 
              alt="Mubdev Replaceable Hero Portrait Placeholder" 
              style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
            />
          </div>
        </GlassCard>
      </div>

      {/* --- Official Color Palette Showcase --- */}
      <div style={{ marginBottom: '3.5rem' }}>
        <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={20} color="var(--color-neon-cyan)" />
          <span>Official Mubdev Color Tokens</span>
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem' }}>
          {palette.map((color) => (
            <div 
              key={color.name}
              className="glass-card" 
              style={{ 
                padding: '1rem', 
                border: '1px solid rgba(0, 217, 255, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              <div 
                style={{ 
                  height: '60px', 
                  borderRadius: 'var(--radius-sm)', 
                  backgroundColor: color.hex,
                  border: color.border !== 'none' ? `1px solid ${color.border}` : 'none',
                  boxShadow: color.hex === BRAND_COLORS.neonCyan ? 'var(--glow-cyan-sm)' : color.hex === BRAND_COLORS.electricBlue ? 'var(--glow-blue-sm)' : 'none'
                }} 
              />
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-white)' }}>
                {color.name}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-neon-cyan)' }}>
                {color.hex}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {color.role}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- UI Components & Interactive Elements --- */}
      <div style={{ marginBottom: '3.5rem' }}>
        <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Code size={20} color="var(--color-electric-blue)" />
          <span>Reusable Component Foundation</span>
        </h3>

        <GlassCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                // BUTTON VARIANTS & GLOW EFFECTS
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                <Button variant="primary" size="md" icon={<Sparkles size={16} />}>
                  Primary Glowing
                </Button>
                <Button variant="secondary" size="md" icon={<ArrowRight size={16} />} iconPosition="right">
                  Secondary Glass
                </Button>
                <Button variant="ghost" size="md">
                  Ghost Interactive
                </Button>
                <Button variant="primary" size="sm">
                  Small Button
                </Button>
                <Button variant="primary" size="lg">
                  Large CTA
                </Button>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(0, 217, 255, 0.1)', paddingTop: '1.5rem' }}>
              <div style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                // PHASE 1 ACCEPTANCE CHECKLIST
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
                {[
                  'React + Vite Modern Foundation',
                  'Official Color Palette & CSS Tokens',
                  'Custom Reusable Mubdev Logo & Favicon',
                  'Temporary Portrait Asset Spec',
                  'Futuristic Glassmorphic Layout',
                  'Mobile, Tablet & Desktop Responsive Rules'
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--text-sm)' }}>
                    <CheckCircle2 size={16} color="var(--color-neon-cyan)" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

    </div>
  );
};

export default DesignSystemPreview;
