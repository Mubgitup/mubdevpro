# Mubdev Product Requirements Document (PRD)

## 1. Document Purpose
This document defines the product requirements, user personas, operational scope, and functional specifications for the **Mubdev** personal brand and engineering portfolio web application.

---

## 2. Product Objectives
1. **Professional Developer Identity**: Establish a distinct, authoritative digital presence for Mubarek Hussein reflecting his Software Engineering education at Haramaya University and technical direction as an Aspiring Full-Stack Developer.
2. **Authoritative Aesthetic Fidelity**: Adhere strictly to the approved dark futuristic technology aesthetic (midnight backgrounds, neon cyan/blue/violet glow, 3D floating elements, flowing light trails, glassmorphism).
3. **Information Integrity**: Maintain strict authenticity regarding skills, educational status, and project origins. Zero fabricated achievements, dates, proficiency percentages, or commercial product claims.
4. **Full-Stack Technical Demonstration**: Implement a modern, decoupled React frontend and Django REST Framework backend backed by a relational database schema.

---

## 3. User Personas

### Persona A: Technical Recruiter / Hiring Manager
- **Needs**: Fast assessment of technical stack, education credentials, genuine projects, and direct contact options.
- **Expectations**: Clean navigation, mobile responsiveness, fast load times, and authentic presentation of experience.

### Persona B: Senior Software Engineer / Collaborator
- **Needs**: Inspect code quality, architecture patterns, API contracts, and problem-solving approaches.
- **Expectations**: Clean component structure, modern CSS design tokens, robust error handling, database indexing, and automated tests.

---

## 4. Functional Requirements Matrix

| Module | Requirement ID | Requirement Description | Status |
|---|---|---|---|
| **Navigation** | FR-NAV-01 | Glassmorphism transparent navbar with background blur and border glow. | Implemented |
| | FR-NAV-02 | Scrollspy active section indicator tracking current section in viewport. | Implemented |
| | FR-NAV-03 | Accessible mobile drawer menu with keyboard escape dismissal. | Implemented |
| **Hero** | FR-HERO-01 | 2-column layout with student badge, name, role title, and dual CTA buttons. | Implemented |
| | FR-HERO-02 | Seamless borderless portrait stage with radial gradient mask and cyber orbital rings. | Implemented |
| | FR-HERO-03 | Replaceable asset slot (`placeholder-portrait.svg`) avoiding invented permanent portraits. | Implemented |
| | FR-HERO-04 | 3 bottom information cards (Haramaya University, Web Dev & Programming, Always Learning). | Implemented |
| **About** | FR-ABT-01 | Professional narrative detailing Software Engineering education, current learning, and goals. | Implemented |
| **Skills** | FR-SKL-01 | 4 organized categories (Frontend, Programming, Backend, Database). | Implemented |
| | FR-SKL-02 | Verified technologies with honest status tags (no fabricated proficiency percentages). | Implemented |
| **Projects** | FR-PRJ-01 | Filterable project showcase cards with category tabs (All, Frontend, Full-Stack, Systems). | Implemented |
| | FR-PRJ-02 | Honest presentation of academic and practice experiments with GitHub source links. | Implemented |
| **Journey** | FR-JRN-01 | Glowing vertical timeline displaying academic and coursework milestones without fake dates. | Implemented |
| **Contact** | FR-CNT-01 | Input fields for Name, Email, Subject, Message with instant client validation. | Implemented |
| | FR-CNT-02 | Anti-spam honeypot and anonymous rate limiting. | Implemented |
| | FR-CNT-03 | Real transmission to Django REST API (`POST /api/contact/`) with confirmed database storage. | Implemented |
| **Footer** | FR-FTR-01 | Brand logo, summary, navigation links, social placeholders, and back-to-top button. | Implemented |
| **3D & FX** | FR-FX-01 | Three.js canvas with floating wireframe cube, orbital torus, and digital particles. | Implemented |
| | FR-FX-02 | Vector flowing cyan/violet light trails with continuous SVG animations. | Implemented |
| | FR-FX-03 | Page Visibility API pause and `prefers-reduced-motion` accessibility support. | Implemented |

---

## 5. Non-Functional Requirements
- **Performance**: Initial frontend bundle split into isolated vendor chunks (`three`, `motion`, `lucide`, `index`) to maximize caching and minimize Time to Interactive (TTI).
- **Accessibility**: High-contrast `:focus-visible` rings, semantic HTML landmarks (`<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`), skip-to-content anchor, and ARIA labels.
- **Security**: Strict CORS policy, HTML input sanitization, zero hardcoded credentials, and suppression of backend stack traces.

