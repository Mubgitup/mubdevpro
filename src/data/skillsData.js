/**
 * Mubdev Skills Data
 * Categorized strictly according to verified profile technologies.
 * No fabricated percentages or unverified expertise claims.
 * 
 * Supports official vector logos, synchronized browser storage,
 * and dynamic administrative management.
 */

export const DEFAULT_SKILL_CATEGORIES = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    description: 'Building responsive, modern, and accessible user interfaces.',
    skills: [
      {
        name: 'HTML5',
        icon: 'html5',
        status: 'Core Proficiency',
        description: 'Semantic structure, accessible markup, and modern web standards.',
        color: '#E34F26'
      },
      {
        name: 'CSS3',
        icon: 'css3',
        status: 'Core Proficiency',
        description: 'Custom styling, Flexbox, CSS Grid, animations, and responsive layouts.',
        color: '#1572B6'
      },
      {
        name: 'JavaScript',
        icon: 'javascript',
        status: 'Core Proficiency',
        description: 'ES6+ syntax, asynchronous programming, DOM manipulation, and modern web APIs.',
        color: '#F7DF1E'
      },
      {
        name: 'React',
        icon: 'react',
        status: 'Active Development',
        description: 'Component architecture, state management, hooks, and modern frontend ecosystems.',
        color: '#00D9FF'
      }
    ]
  },
  {
    id: 'programming',
    title: 'Programming & Systems',
    description: 'Foundational programming languages and algorithmic problem solving.',
    skills: [
      {
        name: 'Python',
        icon: 'python',
        status: 'Core Proficiency',
        description: 'Object-oriented programming, data structures, scripting, and backend development.',
        color: '#3776AB'
      },
      {
        name: 'C++',
        icon: 'c++',
        status: 'Core Proficiency',
        description: 'Systems programming, memory management, OOP, and computer science fundamentals.',
        color: '#00599C'
      }
    ]
  },
  {
    id: 'backend',
    title: 'Backend Development',
    description: 'Server-side architectures, RESTful APIs, and application logic.',
    skills: [
      {
        name: 'Python Backend',
        icon: 'python',
        status: 'Active Development',
        description: 'Server logic, package management, and backend scripting foundations.',
        color: '#3776AB'
      },
      {
        name: 'Django',
        icon: 'django',
        status: 'Learning & Developing',
        description: 'Model-View-Template architecture, Django REST Framework, and secure API endpoints.',
        color: '#092E20'
      },
      {
        name: 'PHP',
        icon: 'php',
        status: 'Currently Learning',
        description: 'Server-side scripting, form handling, and web backend fundamentals.',
        color: '#777BB4'
      }
    ]
  },
  {
    id: 'database',
    title: 'Database Systems',
    description: 'Relational data modeling, querying, and persistent storage.',
    skills: [
      {
        name: 'MySQL',
        icon: 'mysql',
        status: 'Learning & Developing',
        description: 'Relational schema design, SQL queries, table relationships, and data normalization.',
        color: '#00D9FF'
      }
    ]
  },
  {
    id: 'tools',
    title: 'Developer Tools & Workflow',
    description: 'Version control, collaborative workflows, and modern development environments.',
    skills: [
      {
        name: 'Git',
        icon: 'git',
        status: 'Core Proficiency',
        description: 'Distributed version control, branching workflows, and commit history management.',
        color: '#F05032'
      },
      {
        name: 'GitHub',
        icon: 'github',
        status: 'Core Proficiency',
        description: 'Code hosting, pull requests, issue tracking, and repository management.',
        color: '#F5F8FF'
      },
      {
        name: 'VS Code',
        icon: 'vscode',
        status: 'Core Proficiency',
        description: 'Primary IDE, debugging configurations, workspace extensions, and terminal integration.',
        color: '#007ACC'
      }
    ]
  }
];

export const SKILLS_STORAGE_KEY = 'mubdev_skills_categories';

/**
 * Retrieve skills categories from localStorage with validation and fallback to defaults.
 * Automatically backfills missing icon keys and categories.
 */
export function getSkillsData() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return DEFAULT_SKILL_CATEGORIES;
  }

  try {
    const raw = window.localStorage.getItem(SKILLS_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_SKILL_CATEGORIES;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_SKILL_CATEGORIES;
    }

    // Verify each category and skill has icons
    return parsed.map((cat) => {
      const defaultCat = DEFAULT_SKILL_CATEGORIES.find((d) => d.id === cat.id);
      return {
        ...cat,
        skills: (cat.skills || []).map((skill) => {
          const defaultSkill = defaultCat?.skills.find((s) => s.name.toLowerCase() === skill.name.toLowerCase());
          return {
            ...skill,
            icon: skill.icon || defaultSkill?.icon || skill.name.toLowerCase().replace(/[^a-z0-9]/g, '')
          };
        })
      };
    });
  } catch {
    return DEFAULT_SKILL_CATEGORIES;
  }
}

/**
 * Save updated skills categories to localStorage and broadcast an update event
 * so all active components synchronize in real time.
 */
export function saveSkillsData(categories) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    window.localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(categories));
    window.dispatchEvent(new CustomEvent('mubdev_skills_updated', { detail: categories }));
    return true;
  } catch (err) {
    console.error('Failed to save skills data:', err);
    return false;
  }
}

/**
 * Reset skills data back to the official verified default state.
 */
export function resetSkillsData() {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem(SKILLS_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('mubdev_skills_updated', { detail: DEFAULT_SKILL_CATEGORIES }));
  }
  return DEFAULT_SKILL_CATEGORIES;
}

// Backward-compatible export
export const SKILL_CATEGORIES = DEFAULT_SKILL_CATEGORIES;
