import React from 'react';
import { MubdevLogo } from '../../assets/logo/MubdevLogo';
import { BRAND_PROFILE } from '../../data/brandConfig';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="section-container footer-content">
        <MubdevLogo size="sm" />

        <div className="badge">
          <span className="badge-dot"></span>
          <span>{BRAND_PROFILE.education.year} • {BRAND_PROFILE.education.university}</span>
        </div>

        <p style={{ maxWidth: '520px', margin: '0 auto', fontSize: 'var(--text-sm)' }}>
          Personal brand of {BRAND_PROFILE.name}. Dedicated to building scalable, 
          cutting-edge full-stack web applications and software systems.
        </p>

        <p className="footer-copy">
          &copy; {currentYear} Mubdev ({BRAND_PROFILE.name}). All rights reserved. Built with React & Vite.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
