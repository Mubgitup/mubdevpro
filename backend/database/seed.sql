-- ==============================================================================
-- MUBDEV PORTFOLIO DATABASE SEED DATA
-- Preserves existing contact inquiries, projects, and provisions default administrator
-- ==============================================================================

USE `mubdev_db`;

-- 1. Seed default administrator account
INSERT INTO `admin_users` (`id`, `username`, `email`, `password_hash`, `is_active`, `created_at`)
VALUES (
  1,
  'admin',
  'admin@mubdev.com',
  '$2y$10$xMbdARoMuaPvboadnBGe4uoO79IqADi4LQkRhB0.l1aJ9ZYx1GXsi',
  1,
  NOW()
)
ON DUPLICATE KEY UPDATE `username` = VALUES(`username`);

-- 2. Seed preserved contact messages migrated from previous session
INSERT INTO `mubdev_contact_messages` (`id`, `name`, `email`, `subject`, `message`, `ip_address`, `is_read`, `created_at`)
VALUES 
(
  1,
  'Mubarek Test Visitor',
  'visitor@example.com',
  'Inquiry regarding Full-Stack Development',
  'Hello Mubarek, testing the full-stack database integration and message transmission pipeline.',
  '127.0.0.1',
  1,
  '2026-11-03 16:04:18'
),
(
  2,
  'Mubarek Test Visitor',
  'visitor@example.com',
  'Inquiry regarding Full-Stack Development',
  'Hello Mubarek, testing the full-stack database integration and message transmission pipeline.',
  '127.0.0.1',
  1,
  '2026-11-03 16:17:27'
),
(
  3,
  'Mubarek Test Visitor',
  'visitor@example.com',
  'Inquiry regarding Full-Stack Development',
  'Hello Mubarek, testing the full-stack database integration and message transmission pipeline.',
  '127.0.0.1',
  0,
  '2026-11-03 16:53:11'
),
(
  4,
  'Mubarek Test Visitor',
  'visitor@example.com',
  'Inquiry regarding Full-Stack Development',
  'Hello Mubarek, testing the full-stack database integration and message transmission pipeline.',
  '127.0.0.1',
  0,
  '2026-11-05 06:32:47'
)
ON DUPLICATE KEY UPDATE `id` = VALUES(`id`);

-- 3. Seed initial authentic portfolio projects
INSERT INTO `mubdev_projects` (`id`, `title`, `category`, `short_description`, `full_description`, `technologies`, `image_url`, `github_url`, `live_url`, `status`, `badge`, `display_order`, `featured`, `created_at`)
VALUES
(
  1,
  'Mubdev — Personal Brand Website',
  'Frontend',
  'Personal brand and developer portfolio built with React, Vite, Framer Motion, and a custom futuristic dark glassmorphic design system.',
  'Comprehensive personal developer brand and portfolio application showcasing responsive layouts, authentic vector technology logos, interactive 3D hero stage, and an administrative control panel for inquiry and project management.',
  '["React", "JavaScript", "CSS3 Variables", "Framer Motion"]',
  '/src/assets/images/mubdev-hero.jpg',
  'https://github.com/placeholder/mubdev',
  '#hero',
  'published',
  'Portfolio / Current',
  1,
  1,
  '2026-11-01 10:00:00'
),
(
  2,
  'Student Course Portal & Management',
  'Full-Stack',
  'Academic practice application demonstrating relational data modeling, student registration workflows, and course enrollment records.',
  'Full-stack student course portal built with Python, Django, and MySQL. Implements student authentication, course catalog browsing, enrollment limit validations, and administrative grading dashboards.',
  '["Python", "Django", "MySQL", "HTML/CSS"]',
  NULL,
  'https://github.com/placeholder/course-portal',
  NULL,
  'published',
  'Academic Practice',
  2,
  1,
  '2026-11-02 11:30:00'
),
(
  3,
  'Data Structures & Algorithms Workbench',
  'Systems & C++',
  'Comprehensive collection of fundamental data structures, memory allocation experiments, and sorting algorithm implementations in modern C++.',
  'High-performance C++ workbench showcasing manual memory management, custom linked lists, binary search trees, hash tables, and algorithm benchmarking suites with visual complexity outputs.',
  '["C++", "OOP", "Data Structures", "Algorithms"]',
  NULL,
  'https://github.com/placeholder/cpp-algorithms',
  NULL,
  'published',
  'Systems & Algorithms',
  3,
  1,
  '2026-11-03 14:15:00'
),
(
  4,
  'Udacity Web Development Showcase',
  'Frontend',
  'Responsive interactive web application developed during Udacity coursework focusing on modular JavaScript, DOM manipulation, and responsive UI layout.',
  'Front-end web development project highlighting semantic HTML5 architecture, responsive Flexbox and Grid layouts, dynamic DOM event listeners, and asynchronous Web API integration.',
  '["JavaScript", "HTML5", "CSS3", "Web APIs"]',
  NULL,
  'https://github.com/placeholder/udacity-web-project',
  NULL,
  'published',
  'Course Project',
  4,
  0,
  '2026-11-04 16:45:00'
)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- 4. Seed authentic education records and learning milestones
INSERT INTO `mubdev_education` (`id`, `institution`, `degree`, `field_of_study`, `description`, `start_date`, `end_date`, `is_current`, `status`, `type`, `location`, `image_url`, `highlights`, `display_order`, `created_at`)
VALUES
(
  1,
  'Haramaya University',
  'Third-Year Software Engineering Studies',
  'Software Engineering',
  'Pursuing Software Engineering degree coursework covering Object-Oriented Programming, Database Systems, Software Requirements & Design, and Systems Programming.',
  '2022',
  '2026',
  1,
  'Current Academic Standing',
  'Formal Degree Education',
  'Dire Dawa, Ethiopia',
  NULL,
  '["C++ & Systems Programming", "Object-Oriented Design", "Software Engineering Principles", "Database Design"]',
  1,
  '2026-11-01 10:00:00'
),
(
  2,
  'Self-Directed & Hands-on Exploration',
  'Full-Stack Expansion & Advanced Backend',
  'Full-Stack Engineering & System Architecture',
  'Deepening full-stack engineering capabilities with Django REST Framework, PHP backend fundamentals, MySQL relational database architecture, and scalable system design.',
  '2023',
  'Present',
  1,
  'In Progress / Current',
  'Skill Development',
  'Independent / Remote',
  NULL,
  '["Django REST Framework", "PHP server-side scripting", "MySQL database modeling", "API architecture"]',
  2,
  '2026-11-02 11:30:00'
),
(
  3,
  'Independent Lab & Practice Work',
  'Practical Software & Application Development',
  'Applied Software Engineering',
  'Engineering practice projects, translating theoretical concepts from coursework into real code, algorithmic problem solving, and modern frontend interfaces.',
  '2023',
  'Present',
  1,
  'Continuous',
  'Applied Experience',
  'Independent / Remote',
  NULL,
  '["React component engineering", "Full-stack prototyping", "Algorithmic problem solving"]',
  3,
  '2026-11-03 14:00:00'
),
(
  4,
  'Udacity Coursework',
  'Udacity Web Development Program',
  'Frontend & Modern Web Technologies',
  'Completed foundational and intermediate web development curriculum covering modern semantic HTML, advanced CSS layouts, responsive design, and core JavaScript concepts.',
  '2023',
  '2024',
  0,
  'Completed Milestone',
  'Professional Coursework',
  'Online Course',
  NULL,
  '["Responsive web design", "Vanilla JavaScript & DOM manipulation", "Modern CSS layout models"]',
  4,
  '2026-11-04 16:00:00'
)
ON DUPLICATE KEY UPDATE `institution` = VALUES(`institution`), `degree` = VALUES(`degree`);

-- 5. Seed authentic certificate credentials and achievements
INSERT INTO `mubdev_certificates` (`id`, `title`, `issuer`, `issue_date`, `credential_id`, `verification_url`, `image_url`, `skills`, `description`, `display_order`, `featured`, `created_at`)
VALUES
(
  1,
  'Udacity Web Development Program Certificate',
  'Udacity',
  '2024',
  'UDACITY-WD-2024',
  'https://www.udacity.com',
  NULL,
  '["Semantic HTML5", "Modern CSS Layouts", "Vanilla JavaScript & DOM", "Web APIs"]',
  'Intensive curriculum focused on building responsive, performant web applications with standards-compliant HTML5, modular CSS layouts, dynamic DOM manipulation, and asynchronous REST APIs.',
  1,
  1,
  '2026-11-01 12:00:00'
),
(
  2,
  'Software Engineering Coursework Credential',
  'Haramaya University',
  '2024',
  'HU-SE-3RDYEAR',
  'https://www.haramaya.edu.et',
  NULL,
  '["C++ & OOP", "Relational Databases", "Data Structures", "Software Engineering Principles"]',
  'Verified academic transcript and curriculum achievements in Object-Oriented Programming, Data Structures, Relational Database Modeling, and Software Engineering Systems.',
  2,
  1,
  '2026-11-02 14:00:00'
),
(
  3,
  '[SAMPLE / DEMO] Web Development Professional Certificate',
  'Demo Training Institute (SAMPLE)',
  '2024 (DEMO)',
  'DEMO-WD-2024-SAMPLE',
  'https://example.com/verify/demo-wd',
  '/uploads/certificates/demo_cert_webdev.svg',
  '["HTML5 (Demo)", "CSS3 (Demo)", "JavaScript (Demo)", "Responsive Design"]',
  '[SAMPLE / DEMO RECORD] Demonstrates completed coursework in frontend web development architectures, layout modeling, and interactive DOM development.',
  3,
  1,
  '2026-11-03 10:00:00'
),
(
  4,
  '[SAMPLE / DEMO] Python Programming & Backend Foundations',
  'Demo Technology Academy (SAMPLE)',
  '2024 (DEMO)',
  'DEMO-PY-2024-SAMPLE',
  'https://example.com/verify/demo-py',
  '/uploads/certificates/demo_cert_python.svg',
  '["Python (Demo)", "Data Structures (Demo)", "Algorithms", "Backend Scripting"]',
  '[SAMPLE / DEMO RECORD] Demonstrates foundational programming in Python, object-oriented concepts, algorithm optimization, and server-side data processing.',
  4,
  1,
  '2026-11-04 11:30:00'
),
(
  5,
  '[SAMPLE / DEMO] UI/UX Design & Digital Interface Principles',
  'Demo Creative Academy (SAMPLE)',
  '2024 (DEMO)',
  'DEMO-UIUX-2024-SAMPLE',
  'https://example.com/verify/demo-uiux',
  '/uploads/certificates/demo_cert_uiux.svg',
  '["Wireframing (Demo)", "Figma Prototyping", "User Research", "Visual Systems"]',
  '[SAMPLE / DEMO RECORD] Demonstrates foundational principles of modern user interface design, user journey mapping, design systems, and responsive wireframing.',
  5,
  1,
  '2026-11-05 14:00:00'
)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`), `issuer` = VALUES(`issuer`);

-- 6. Seed authentic milestones, technical achievements, and recognitions
INSERT INTO `mubdev_achievements` (`id`, `title`, `category`, `organization`, `date`, `description`, `image_url`, `link_url`, `highlights`, `display_order`, `featured`, `created_at`)
VALUES
(
  1,
  'Full-Stack Architecture & Backend Systems Milestone',
  'Technical Milestone',
  'Self-Directed Exploration & Research',
  '2023 - Present',
  'Deepening full-stack engineering capabilities with Django REST Framework, PHP backend fundamentals, MySQL relational database architecture, and scalable system design.',
  NULL,
  NULL,
  '["Django REST Framework", "PHP server-side scripting", "MySQL database modeling", "API architecture"]',
  1,
  1,
  '2026-11-01 10:00:00'
),
(
  2,
  'Applied Software Practice & Algorithmic Problem Solving',
  'Applied Milestone',
  'Independent Lab & University Practice',
  '2023 - Present',
  'Engineering practice projects, translating theoretical concepts from coursework into real code, algorithmic problem solving in C++, and modern frontend interfaces.',
  NULL,
  NULL,
  '["React component engineering", "Full-stack prototyping", "Algorithmic problem solving"]',
  2,
  1,
  '2026-11-02 11:30:00'
),
(
  3,
  'Academic Standing & Software Engineering Curriculum Honors',
  'Academic Recognition',
  'Haramaya University',
  '2024',
  'Maintaining strong academic standing across foundational and advanced software engineering coursework including Object-Oriented Design, Database Systems, and Systems Programming.',
  NULL,
  'https://www.haramaya.edu.et',
  '["C++ & Systems Programming", "Object-Oriented Design", "Relational Database Modeling"]',
  3,
  1,
  '2026-11-03 14:00:00'
),
(
  4,
  'Udacity Web Development Program Completion',
  'Technical Milestone',
  'Udacity',
  '2024',
  'Successfully completed comprehensive coursework in responsive web architecture, modular JavaScript programming, DOM event models, and asynchronous REST APIs.',
  NULL,
  'https://www.udacity.com',
  '["Responsive web design", "Vanilla JavaScript & DOM manipulation", "Modern CSS layout models"]',
  4,
  1,
  '2026-11-04 16:00:00'
)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`), `category` = VALUES(`category`);
