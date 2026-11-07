/**
 * Mubdev Brand Configuration & Profile Data
 * Source of truth for brand metadata, profile, navigation, and social links
 */

import heroPortraitImg from '../assets/images/mubdev-hero.jpg';

export const BRAND_PROFILE = {
  name: 'Mubarek Hussein',
  brand: 'Mubdev',
  role: 'Software Engineering Student & Aspiring Full-Stack Developer',
  education: {
    degree: 'Software Engineering',
    year: 'Third-year Student (3rd Year)',
    university: 'Haramaya University'
  },
  professionalDirection: 'Aspiring Full-Stack Developer',
  bio: 'Third-year Software Engineering student at Haramaya University with a strong drive for building scalable web applications and mastering full-stack software development.',
  heroDescription: 'Passionate about bridging frontend aesthetics with robust backend systems. Currently expanding expertise across React, Python, Django, C++, and PHP to build reliable, high-performance digital products.',
  heroHighlights: [
    { title: 'Haramaya University', subtitle: '3rd Year Software Engineering', icon: 'GraduationCap' },
    { title: 'Web Development & Programming', subtitle: 'Frontend, Backend & Systems', icon: 'Code' },
    { title: 'Always Learning & Exploring', subtitle: 'Continuous Technical Growth', icon: 'Compass' }
  ]
};

export const BRAND_COLORS = {
  midnight: '#020817',
  deepNavy: '#071B3D',
  electricBlue: '#087BFF',
  neonCyan: '#00D9FF',
  violet: '#713BFF',
  white: '#F5F8FF'
};

export const NAV_LINKS = [
  { label: 'Home', href: '#hero', id: 'hero' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Skills', href: '#skills', id: 'skills' },
  { label: 'Projects', href: '#projects', id: 'projects' },
  { label: 'Journey', href: '#journey', id: 'journey' },
  { label: 'Contact', href: '#contact', id: 'contact' }
];

export { SOCIAL_LINKS } from './socialLinks';

export const ASSET_PATHS = {
  logoSvg: '/src/assets/logo/mubdev-logo.svg',
  favicon: '/mubdev-favicon.svg',
  placeholderPortrait: heroPortraitImg,
  heroPortrait: heroPortraitImg
};
