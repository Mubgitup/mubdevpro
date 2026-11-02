# Mubdev Official Design System

## Authoritative Color Tokens

| Token | Hex | RGB | Role / Usage |
|---|---|---|---|
| `--color-midnight` | `#020817` | `2, 8, 23` | Deepest canvas background & 3D fog |
| `--color-deep-navy` | `#071B3D` | `7, 27, 61` | Elevated surface, glass panel fill, 3D ambient light |
| `--color-electric-blue` | `#087BFF` | `8, 123, 255` | Primary interaction, buttons, 3D directional light |
| `--color-neon-cyan` | `#00D9FF` | `0, 217, 255` | Neon accents, borders, high-impact highlights, 3D point light |
| `--color-violet` | `#713BFF` | `113, 59, 255` | Secondary cyber glow, gradient terminal, 3D point light |
| `--color-white` | `#F5F8FF` | `245, 248, 255` | Crisp primary text & high-contrast elements |

## Gradients & Vector Trails
- **`--gradient-cyber`**: `linear-gradient(135deg, #00D9FF 0%, #087BFF 50%, #713BFF 100%)`
- **`--gradient-neon`**: `linear-gradient(135deg, #00D9FF 0%, #087BFF 100%)`
- **`--gradient-violet-blue`**: `linear-gradient(135deg, #713BFF 0%, #087BFF 100%)`
- **`--gradient-glass`**: `linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.01) 100%)`
- **Light Trail 1**: Neon Cyan to Electric Blue curved bezier stream (`stroke-dashoffset` animation).
- **Light Trail 2**: Violet to Cyan complementary energy stream.

## 3D Scene Geometry & Lighting
- **Wireframe Box**: `0x071b3d` mesh with `0x00d9ff` neon cyan edges, slow dual-axis rotation.
- **Orbital Torus**: `0x713bff` emissive torus with metallic reflection.
- **Particles**: Dual-color buffer points (Cyan & Violet) drifting with gentle sinusoidal oscillation.
- **Atmospheric Fog**: Exponential density `0.035` in `#020817` to eliminate hard clipping.

## Refined Glassmorphism Standards
- **Background**: `rgba(7, 27, 61, 0.45)` to `rgba(7, 27, 61, 0.55)`
- **Backdrop Filter**: `blur(20px)`
- **Border**: `1px solid rgba(0, 217, 255, 0.18)`
- **Top Inset Highlight**: `inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)`
- **Hover Glow**: `0 14px 40px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 217, 255, 0.35)`

## Motion & Animation Standards (Framer Motion)
- **Entrance Easing**: Cubic Bezier `[0.16, 1, 0.3, 1]` (smooth, natural deceleration).
- **Stagger Timing**: `0.1s` to `0.15s` between consecutive child items.
- **Scroll Threshold**: Viewport margin `-40px`, triggers once when scrolled into view.
- **Reduced Motion**: Disables animation transitions and 3D camera drift automatically when system preferences indicate `prefers-reduced-motion: reduce`.
