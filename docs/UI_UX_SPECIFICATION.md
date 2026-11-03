# Mubdev UI/UX Specification

## 1. Design Vision & Philosophy
The **Mubdev** design system is crafted to project an immersive, high-tech, and futuristic visual identity. It balances dark midnight space with vibrant neon energy, sharp geometric precision, and refined glassmorphic surfaces.

---

## 2. Visual Hierarchy & Proportions

### 2.1 Color Distribution Rule (60-30-10)
- **60% Primary Deep Space Canvas**:
  - Midnight (`#020817`) and Deep Navy (`#071B3D`) radial gradients creating infinite depth.
- **30% Elevated Translucent Surfaces**:
  - Glass panels (`rgba(7, 27, 61, 0.45)` to `rgba(7, 27, 61, 0.55)`) with `backdrop-filter: blur(20px)` and subtle cyan borders (`rgba(0, 217, 255, 0.18)`).
- **10% High-Impact Neon Accents**:
  - Electric Blue (`#087BFF`) interactive buttons, Neon Cyan (`#00D9FF`) text highlights and border glow, Violet (`#713BFF`) ambient aura.

### 2.2 Typography Hierarchy
- **Display Headings**: `Space Grotesk`, sans-serif (Weights: 600, 700, 800)
  - Hero Display: `clamp(2.5rem, 5.5vw, 4.25rem)`
  - Section Titles: `clamp(1.75rem, 4vw, 2.25rem)`
  - Subheadings: `clamp(1.25rem, 2.5vw, 1.85rem)`
- **Body & Navigation**: `Plus Jakarta Sans`, sans-serif (Weights: 400, 500, 600)
  - Base body: `1rem` (16px), line-height `1.6`
  - Small labels: `0.875rem` (14px)
- **Technical & Monospace**: `JetBrains Mono`, monospace (Weights: 400, 500)
  - Badges & status pills: `0.75rem` (12px), letter-spacing `0.05em`
  - Code snippets: `0.7rem` to `0.85rem`

---

## 3. Component Design Specifications

### 3.1 Glowing Buttons (`.btn`)
- **Primary Glowing Button (`.btn-primary`)**:
  - Background: `linear-gradient(135deg, #087BFF 0%, #0099ff 100%)`
  - Border: `1px solid rgba(0, 217, 255, 0.65)`
  - Box Shadow: `0 0 24px rgba(8, 123, 255, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.25)`
  - Hover: Transforms into bright Neon Cyan with `0 0 35px rgba(0, 217, 255, 0.5)` and `-2px` vertical lift.
- **Secondary Glass Button (`.btn-secondary`)**:
  - Background: `rgba(7, 27, 61, 0.55)` with `backdrop-filter: blur(14px)`
  - Border: `1px solid rgba(0, 217, 255, 0.35)`
  - Hover: Border and text brighten to Neon Cyan with soft ambient glow.

### 3.2 Glassmorphic Panels (`.glass-card`, `.glass-panel`)
- Background: Multi-layer translucent navy fill with `blur(20px)`
- Border: `1px solid rgba(0, 217, 255, 0.18)`
- Top Inset Highlight: `inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)` simulating light hitting the glass edge.
- Hover State: Vertical elevation `-3px` with dual cyan glow shadow (`0 14px 40px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 217, 255, 0.35)`).

### 3.3 Seamless Hero Portrait Stage
- **Structure**: Non-rectangular organic holographic projection.
- **Blending Mask**: Radial and linear gradient mask dissolving edges and bottom into `#020817`.
- **Atmospheric Backlight**: Dual-tier radial glow aura (`rgba(0, 217, 255, 0.28)` and `rgba(113, 59, 255, 0.22)`).
- **Orbit Rings**: Rotating dashed and dotted concentric SVG rings (`rotateSlow 30s` and `rotateReverse 40s`).
- **Floating Chips**: Floating tech badges with natural independent sinusoidal floating animation (`floatSlow 4s`).

---

## 4. Responsive Layout Rules

| Screen Category | Viewport Width | Layout Adaptations |
|---|---|---|
| **Large Desktop** | `> 1280px` | Maximum container width `1200px`, 2-column hero, 3-card bottom grid, full 3D particle volume. |
| **Standard Desktop** | `1024px - 1280px`| Container padding `2rem`, 2-column hero, full navigation links and social icons. |
| **Tablet** | `768px - 1023px` | Single-column hero with portrait stacked above heading, about grid collapses to 1 column. |
| **Mobile** | `<= 767px` | Navbar switches to hamburger with full-screen glass drawer, hero orbital rings hidden for performance, particle count scaled down to 80. |
