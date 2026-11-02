import React, { useState, useEffect } from 'react';
import { MubdevLogo } from '../../assets/logo/MubdevLogo';
import { Button } from '../common/Button';
import { NAV_LINKS, SOCIAL_LINKS } from '../../data/brandConfig';
import { Menu, X, Github, Linkedin, Sparkles } from 'lucide-react';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Handle scroll detection and active section detection via IntersectionObserver
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Active Section Observer
    const sectionIds = ['hero', 'about', 'skills', 'projects', 'journey', 'contact'];
    const observers = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          },
          { threshold: 0.3 }
        );
        observer.observe(el);
        observers.push(observer);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  // Keyboard accessibility: Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      className="glass-nav"
      style={{
        backgroundColor: isScrolled ? 'rgba(2, 8, 23, 0.92)' : 'rgba(2, 8, 23, 0.72)',
        boxShadow: isScrolled
          ? '0 4px 30px rgba(0, 0, 0, 0.8), 0 1px 0 rgba(0, 217, 255, 0.2)'
          : '0 1px 0 rgba(0, 217, 255, 0.12)'
      }}
    >
      <div className="section-container nav-container">
        {/* Brand Logo */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            scrollTo('hero');
          }}
          aria-label="Mubdev Home"
          style={{ textDecoration: 'none' }}
        >
          <MubdevLogo size="md" />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <ul className="nav-links">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(link.id);
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Action Controls & Socials */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Social Links (Desktop) */}
          <div className="nav-socials">
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon === 'Github' ? Github : Linkedin;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-btn"
                  title={`${social.name} (Placeholder link)`}
                  aria-label={`${social.name} profile`}
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>

          {/* Connect Action Button */}
          <Button
            variant="primary"
            size="sm"
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('contact');
            }}
            icon={<Sparkles size={14} />}
            iconPosition="right"
            className="nav-cta-btn"
          >
            Connect
          </Button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="mobile-toggle-btn icon-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            style={{ display: 'none' }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Accessible Mobile Menu Drawer */}
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
            marginTop: '0.5rem',
            boxShadow: 'var(--shadow-elevation-3), var(--glow-cyan-sm)'
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(link.id);
              }}
              style={{ fontSize: '1.1rem', padding: '0.5rem 0' }}
            >
              {link.label}
            </a>
          ))}

          {/* Social Links (Mobile Drawer) */}
          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(0, 217, 255, 0.15)' }}>
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon === 'Github' ? Github : Linkedin;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-btn"
                  title={`${social.name} profile`}
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>

          <Button
            variant="primary"
            size="md"
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('contact');
            }}
            style={{ marginTop: '0.5rem' }}
          >
            Connect
          </Button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
