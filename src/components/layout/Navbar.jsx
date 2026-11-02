import React, { useState, useEffect } from 'react';
import { MubdevLogo } from '../../assets/logo/MubdevLogo';
import { Button } from '../common/Button';
import { NAV_LINKS } from '../../data/brandConfig';
import { Menu, X, Sparkles } from 'lucide-react';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('Overview');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className="glass-nav"
      style={{
        backgroundColor: isScrolled ? 'rgba(2, 8, 23, 0.88)' : 'rgba(2, 8, 23, 0.65)',
        boxShadow: isScrolled ? '0 4px 30px rgba(0, 0, 0, 0.7)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(0, 217, 255, 0.2)' : '1px solid rgba(0, 217, 255, 0.1)'
      }}
    >
      <div className="section-container nav-container">
        {/* Brand Logo */}
        <a href="#overview" style={{ textDecoration: 'none' }}>
          <MubdevLogo size="md" />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <ul className="nav-links">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={`nav-link ${activeLink === link.label ? 'active' : ''}`}
                  onClick={() => setActiveLink(link.label)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Header Action CTA */}
        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Button
            variant="primary"
            size="sm"
            href="#contact"
            icon={<Sparkles size={14} />}
            iconPosition="right"
            className="nav-cta-btn"
          >
            Connect
          </Button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer glass-panel"
          style={{
            position: 'absolute',
            top: '100%',
            left: '1rem',
            right: '1rem',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            zIndex: 100,
            marginTop: '0.5rem'
          }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`nav-link ${activeLink === link.label ? 'active' : ''}`}
              onClick={() => {
                setActiveLink(link.label);
                setMobileMenuOpen(false);
              }}
              style={{ fontSize: '1.1rem', padding: '0.5rem 0' }}
            >
              {link.label}
            </a>
          ))}
          <Button
            variant="primary"
            size="md"
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            style={{ marginTop: '0.5rem' }}
          >
            Connect
          </Button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }
          .mobile-toggle-btn {
            display: flex !important;
          }
          .nav-cta-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
