/**
 * Mubdev Brand Configuration & Profile Data
 * Source of truth for brand metadata, profile, and design tokens
 */

export const BRAND_PROFILE = {
  name: 'Mubarek Hussein',
  brand: 'Mubdev',
  role: 'Software Engineering Student & Aspiring Full-Stack Developer',
  education: {
    degree: 'Software Engineering',
    year: 'Third-year Student',
    university: 'Haramaya University'
  },
  professionalDirection: 'Aspiring Full-Stack Developer',
  technologies: [
    { name: 'HTML5', category: 'Frontend' },
    { name: 'CSS3', category: 'Frontend' },
    { name: 'JavaScript', category: 'Frontend' },
    { name: 'React', category: 'Frontend' },
    { name: 'Python', category: 'Backend' },
    { name: 'C++', category: 'Systems' },
    { name: 'PHP', category: 'Backend', note: 'Currently learning' }
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
  { label: 'Overview', href: '#overview' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' }
];

export const ASSET_PATHS = {
  logoSvg: '/src/assets/logo/mubdev-logo.svg',
  favicon: '/mubdev-favicon.svg',
  placeholderPortrait: '/src/assets/images/placeholder-portrait.svg'
};
