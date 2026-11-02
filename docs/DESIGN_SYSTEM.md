# Mubdev Official Design System

## Authoritative Color Tokens

| Token | Hex | RGB | Role / Usage |
|---|---|---|---|
| `--color-midnight` | `#020817` | `2, 8, 23` | Deepest canvas background |
| `--color-deep-navy` | `#071B3D` | `7, 27, 61` | Elevated surface & glass panel fill |
| `--color-electric-blue` | `#087BFF` | `8, 123, 255` | Primary interaction, buttons, glow |
| `--color-neon-cyan` | `#00D9FF` | `0, 217, 255` | Neon accents, borders, high-impact highlights |
| `--color-violet` | `#713BFF` | `113, 59, 255` | Secondary cyber glow & gradient terminal |
| `--color-white` | `#F5F8FF` | `245, 248, 255` | Crisp primary text & high-contrast elements |

## Gradients
- **`--gradient-cyber`**: `linear-gradient(135deg, #00D9FF 0%, #087BFF 50%, #713BFF 100%)`
- **`--gradient-neon`**: `linear-gradient(135deg, #00D9FF 0%, #087BFF 100%)`
- **`--gradient-violet-blue`**: `linear-gradient(135deg, #713BFF 0%, #087BFF 100%)`
- **`--gradient-glass`**: `linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.01) 100%)`

## Typography
- **Display Font**: `Space Grotesk`, sans-serif (Headers, titles, brand wordmark)
- **Body Font**: `Plus Jakarta Sans`, sans-serif (Paragraphs, navigation, UI labels)
- **Monospace Font**: `JetBrains Mono`, monospace (Code blocks, badges, technical labels)

## Glassmorphism Standards
- **Background**: `rgba(7, 27, 61, 0.5)` to `rgba(7, 27, 61, 0.7)`
- **Backdrop Filter**: `blur(16px)`
- **Border**: `1px solid rgba(0, 217, 255, 0.18)`
- **Hover Glow**: `0 0 24px rgba(0, 217, 255, 0.45)`

## Reusable Classes
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`
- `.glass-panel`, `.glass-card`
- `.glass-nav`, `.nav-links`, `.nav-link`
- `.section-container`, `.section-header`
- `.gradient-text`, `.neon-highlight`, `.accent-text`
- `.badge`, `.badge-dot`

