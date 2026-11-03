import React from 'react';
import { MubdevLogo } from '../../assets/logo/MubdevLogo';
import { SocialIcon } from '../common/SocialIcon';
import { BRAND_PROFILE, NAV_LINKS, SOCIAL_LINKS } from '../../data/brandConfig';
import { ArrowUp } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="app-footer">
      <div className="section-container">
        {/* Top Footer Tier */}
        <div className="footer-top">
          <div style={{ maxWidth: '420px' }}>
            <div style={{ marginBottom: '0.85rem' }}>
              <MubdevLogo size="md" />
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Personal brand of <strong>{BRAND_PROFILE.name}</strong>. Software Engineering student at 
              Haramaya University & aspiring full-stack developer focused on building robust, scalable digital experiences.
            </p>
          </div>

          {/* Quick Nav Links */}
          <div>
            <ul className="footer-nav-list">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(link.id);
                    }}
                    className="nav-link"
                    style={{ fontSize: 'var(--text-sm)' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="footer-social-row" style={{ display: 'flex', gap: '0.65rem' }}>
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-btn"
                title={`${social.name} (${social.username})`}
                aria-label={`${social.name} profile (opens in new tab)`}
              >
                <SocialIcon name={social.id} size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Footer Tier */}
        <div className="footer-bottom">
          <div>
            &copy; {currentYear} Mubdev ({BRAND_PROFILE.name}). All rights reserved. 
            Third-Year Software Engineering, Haramaya University.
          </div>

          {/* Back to Top */}
          <button
            type="button"
            onClick={scrollToTop}
            className="back-to-top-btn"
            aria-label="Back to top of page"
          >
            <span>Back to top</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
