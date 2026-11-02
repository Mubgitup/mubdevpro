/**
 * Mubdev Projects Data
 * Authentic academic, course, and practice projects.
 * Presented honestly as personal, educational, and practice works.
 */

export const PROJECT_CATEGORIES = ['All', 'Frontend', 'Full-Stack', 'Systems & C++'];

export const PROJECTS = [
  {
    id: 'mubdev-brand',
    title: 'Mubdev — Personal Brand Website',
    category: 'Frontend',
    description: 'Personal brand and developer portfolio built with React, Vite, Framer Motion, and a custom futuristic dark glassmorphic design system.',
    technologies: ['React', 'JavaScript', 'CSS3 Variables', 'Framer Motion'],
    featured: true,
    githubUrl: 'https://github.com/placeholder/mubdev',
    liveUrl: '#hero',
    badge: 'Portfolio / Current'
  },
  {
    id: 'course-portal',
    title: 'Student Course Portal & Management',
    category: 'Full-Stack',
    description: 'Academic practice application demonstrating relational data modeling, student registration workflows, and course enrollment records.',
    technologies: ['Python', 'Django', 'MySQL', 'HTML/CSS'],
    featured: true,
    githubUrl: 'https://github.com/placeholder/course-portal',
    liveUrl: null, // Placeholder indicating backend practice
    badge: 'Academic Practice'
  },
  {
    id: 'algo-visualizer',
    title: 'Data Structures & Algorithms Workbench',
    category: 'Systems & C++',
    description: 'Comprehensive collection of fundamental data structures, memory allocation experiments, and sorting algorithm implementations in modern C++.',
    technologies: ['C++', 'OOP', 'Data Structures', 'Algorithms'],
    featured: true,
    githubUrl: 'https://github.com/placeholder/cpp-algorithms',
    liveUrl: null,
    badge: 'Systems & Algorithms'
  },
  {
    id: 'udacity-web-showcase',
    title: 'Udacity Web Development Showcase',
    category: 'Frontend',
    description: 'Responsive interactive web application developed during Udacity coursework focusing on modular JavaScript, DOM manipulation, and responsive UI layout.',
    technologies: ['JavaScript', 'HTML5', 'CSS3', 'Web APIs'],
    featured: false,
    githubUrl: 'https://github.com/placeholder/udacity-web-project',
    liveUrl: null,
    badge: 'Course Project'
  }
];
