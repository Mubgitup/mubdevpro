import React from 'react';
import { Code2, Terminal, Database, Layers, Cpu, Server } from 'lucide-react';

/**
 * TechIcon Component
 * 
 * Renders authentic, high-precision official technology logos for all supported
 * programming languages, frameworks, databases, and developer tools.
 * 
 * Supports:
 * - HTML5
 * - CSS3
 * - JavaScript
 * - React
 * - Python / Python Backend
 * - PHP
 * - MySQL
 * - C++
 * - Git
 * - GitHub
 * - VS Code
 * - Django
 * - Fallback icons for custom/other technologies
 * 
 * @param {Object} props
 * @param {string} props.name - Technology or icon identifier
 * @param {number} [props.size=24] - Icon width/height in pixels
 * @param {string} [props.className=''] - Optional CSS class
 * @param {string} [props.color] - Override accent color
 */
export const TechIcon = ({ name = '', size = 24, className = '', color = null, style = {}, ...props }) => {
  const norm = String(name).toLowerCase().trim().replace(/[\s\-_.]+/g, '');

  switch (norm) {
    // --------------------------------------------------------------------------
    // HTML5
    // --------------------------------------------------------------------------
    case 'html5':
    case 'html':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
          aria-label="HTML5 Logo"
          {...props}
        >
          <path d="M2.5 1.5h19l-1.73 19.467L12 23.5l-7.77-2.533L2.5 1.5z" fill={color || '#E34F26'} />
          <path d="M12 21.438l6.3-1.735 1.4-15.703H12v17.438z" fill="#EF652A" />
          <path d="M12 9.538H8.567l-.234-2.632H12V4.406H5.666l.7 7.632H12v-2.5zm0 6.643l-.014.004-2.73-.737-.175-1.957H6.55l.343 3.844L12 18.72V16.18z" fill="#EBEBEB" />
          <path d="M12 9.538h3.407l-.32 3.593-3.087.833V16.5l4.896-1.32.443-4.975H12V9.538zm0-5.132v2.5h5.833l-.222 2.5H12V6.906h5.833l.222-2.5H12z" fill="#FFFFFF" />
        </svg>
      );

    // --------------------------------------------------------------------------
    // CSS3
    // --------------------------------------------------------------------------
    case 'css3':
    case 'css':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
          aria-label="CSS3 Logo"
          {...props}
        >
          <path d="M2.5 1.5h19l-1.73 19.467L12 23.5l-7.77-2.533L2.5 1.5z" fill={color || '#1572B6'} />
          <path d="M12 21.438l6.3-1.735 1.4-15.703H12v17.438z" fill="#33A9DC" />
          <path d="M12 9.538H8.567l-.234-2.632H12V4.406H5.666l.233 2.5h2.668l.233 2.632H6.133l.7 7.632 5.167 1.433v-2.54l-2.73-.737-.175-1.957H12V9.538z" fill="#EBEBEB" />
          <path d="M12 9.538v2.495h3.087l-.32 3.593-2.767.747v2.538l5.427-1.456.654-7.38H12zm0-5.132v2.5h5.833l.222-2.5H12z" fill="#FFFFFF" />
        </svg>
      );

    // --------------------------------------------------------------------------
    // JavaScript
    // --------------------------------------------------------------------------
    case 'javascript':
    case 'js':
    case 'ecmascript':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
          aria-label="JavaScript Logo"
          {...props}
        >
          <rect width="24" height="24" rx="3.5" fill={color || '#F7DF1E'} />
          <path
            d="M7.7 18.3c-.3.2-.7.3-1.2.3-1.2 0-1.9-.7-1.9-1.9v-5.6h1.7v5.5c0 .5.2.8.6.8.3 0 .5-.1.8-.2v1.1zm4.1.3c-1.4 0-2.3-.8-2.3-2.1 0-.8.4-1.4 1.1-1.8.6-.3 1.3-.5 2-.8.4-.1.7-.3.7-.6 0-.4-.3-.6-.9-.6-.7 0-1.4.3-1.8.8l-.9-1c.8-.7 1.8-1 2.9-1 1.4 0 2.3.8 2.3 2 0 .7-.3 1.3-1 1.7-.6.4-1.3.6-2 .8-.4.2-.7.3-.7.6 0 .4.4.6 1 .6.8 0 1.5-.4 2-.9l.9 1c-.8.8-1.9 1.4-3.3 1.4z"
            fill="#000000"
          />
        </svg>
      );

    // --------------------------------------------------------------------------
    // React
    // --------------------------------------------------------------------------
    case 'react':
    case 'reactjs':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
          aria-label="React Logo"
          {...props}
        >
          <g stroke={color || '#00D9FF'} strokeWidth="1.5" fill="none">
            <ellipse cx="12" cy="12" rx="10" ry="3.8" />
            <ellipse cx="12" cy="12" rx="10" ry="3.8" transform="rotate(60 12 12)" />
            <ellipse cx="12" cy="12" rx="10" ry="3.8" transform="rotate(120 12 12)" />
          </g>
          <circle cx="12" cy="12" r="1.9" fill={color || '#00D9FF'} />
        </svg>
      );

    // --------------------------------------------------------------------------
    // Python & Python Backend
    // --------------------------------------------------------------------------
    case 'python':
    case 'pythonbackend':
    case 'py':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
          aria-label="Python Logo"
          {...props}
        >
          <path
            d="M11.914 1.5c-5.49 0-5.148 2.38-5.148 2.38l.006 2.464h5.215v.741H4.536S1 6.666 1 12.15c0 5.485 3.05 5.31 3.05 5.31h1.82v-2.553s-.1-3.05 2.998-3.05h5.174s2.904.048 2.904-2.815V3.88s.39-2.38-5.032-2.38zm-2.895 1.646a.934.934 0 1 1 0 1.868.934.934 0 0 1 0-1.868z"
            fill={color ? color : '#3776AB'}
          />
          <path
            d="M12.086 22.5c5.49 0 5.148-2.38 5.148-2.38l-.006-2.464h-5.215v-.741h7.451S23 17.334 23 11.85c0-5.485-3.05-5.31-3.05-5.31h-1.82v2.553s.1 3.05-2.998 3.05H9.958s-2.904-.048-2.904 2.815v5.174s-.39 2.38 5.032 2.38zm2.895-1.646a.934.934 0 1 1 0-1.868.934.934 0 0 1 0 1.868z"
            fill={color ? color : '#FFD43B'}
          />
        </svg>
      );

    // --------------------------------------------------------------------------
    // C++
    // --------------------------------------------------------------------------
    case 'c++':
    case 'cpp':
    case 'cplusplus':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
          aria-label="C++ Logo"
          {...props}
        >
          <path
            d="M22.378 17.067l-9.155 5.286a2.43 2.43 0 0 1-2.446 0l-9.155-5.286A2.43 2.43 0 0 1 .4 14.96V4.387c0-.871.468-1.674 1.222-2.107l9.155-5.286a2.43 2.43 0 0 1 2.446 0l9.155 5.286a2.43 2.43 0 0 1 1.222 2.107v10.573a2.43 2.43 0 0 1-1.222 2.107z"
            fill={color || '#00599C'}
          />
          <path
            d="M9.588 13.333a3.89 3.89 0 0 0 2.213.682c2.052 0 3.328-1.196 3.328-3.033 0-1.838-1.276-3.034-3.328-3.034a3.89 3.89 0 0 0-2.213.682v-1.74a5.28 5.28 0 0 1 2.374-.537c3.109 0 5.176 1.838 5.176 4.629 0 2.79-2.067 4.628-5.176 4.628a5.28 5.28 0 0 1-2.374-.536v-1.741zm8.01-3.693v-1.39h1.39v1.39h1.39v1.39h-1.39v1.39h-1.39v-1.39h-1.39v-1.39h1.39zm3.5 0v-1.39h1.39v1.39h1.39v1.39h-1.39v1.39h-1.39v-1.39h-1.39v-1.39h1.39z"
            fill="#FFFFFF"
          />
        </svg>
      );

    // --------------------------------------------------------------------------
    // PHP
    // --------------------------------------------------------------------------
    case 'php':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
          aria-label="PHP Logo"
          {...props}
        >
          <ellipse cx="12" cy="12" rx="11" ry="7.5" fill={color || '#777BB4'} />
          <path
            d="M6.3 8.8h1.9c.9 0 1.5.2 1.8.6.3.4.3 1 .07 1.7-.27.7-.77 1.2-1.46 1.5-.46.17-1.07.24-1.74.24H6.17l-.53 2.47H4.3L5.7 8.8h.6zm.9 3.1h.63c.53 0 .94-.09 1.17-.25.25-.17.43-.48.52-.89.09-.38.04-.67-.13-.83-.16-.16-.5-.24-.98-.24H7.9l-.7 2.21zm4.1-3.1h1.16l-.6 2.47h1.82c.88 0 1.52.23 1.83.65.3.41.33 1 .07 1.67-.27.72-.78 1.24-1.47 1.5-.47.17-1.08.25-1.75.25h-2.1l1.04-6.54zm.9 3.1h.64c.53 0 .94-.09 1.17-.25.25-.17.43-.48.52-.89.09-.38.04-.67-.13-.83-.16-.16-.5-.24-.98-.24h-.65l-.57 2.21zm-2.05 3.44l.93-4.08h1.16l-.93 4.08h-1.16z"
            fill="#FFFFFF"
          />
        </svg>
      );

    // --------------------------------------------------------------------------
    // MySQL
    // --------------------------------------------------------------------------
    case 'mysql':
    case 'sqldatabase':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
          aria-label="MySQL Logo"
          {...props}
        >
          <path
            d="M18.995 8.162c-.097-.043-.443-.197-.852-.197-.737 0-1.156.402-1.468.917-.333.55-.544 1.258-.895 1.802-.303.471-.786.756-1.34.756-.34 0-.671-.11-.967-.323-.396-.285-.68-.722-.843-1.272-.257-.869-.174-1.884.228-2.775.405-.895 1.096-1.597 1.9-2.029.352-.189.658-.302.898-.363-.035-.084-.084-.184-.143-.298-.245-.472-.638-.977-1.23-1.306C14.778 2.457 13.79 2.25 12.7 2.25c-2.36 0-4.482 1.059-5.94 2.766-.46.538-.838 1.144-1.127 1.794-.298.67-.478 1.401-.527 2.158-.042.645.034 1.307.228 1.938.27.876.758 1.666 1.406 2.296-.06.27-.087.545-.078.82.02.61.196 1.2.51 1.72.333.55.807.994 1.378 1.294.617.324 1.32.483 2.03.465.74-.019 1.46-.226 2.08-.602.443-.268.824-.627 1.11-1.053.118-.175.215-.363.29-.56.46.223.97.339 1.48.339 1.01 0 1.97-.432 2.65-1.185.64-.707.98-1.644.97-2.616-.01-.767-.25-1.513-.69-2.13-.39-.545-.92-.953-1.52-1.185l.06-.05zM9.54 12.39c-.58 0-1.05-.47-1.05-1.05s.47-1.05 1.05-1.05 1.05.47 1.05 1.05-.47 1.05-1.05 1.05z"
            fill={color || '#00D9FF'}
          />
          <path
            d="M19.5 17.5c-.8.8-1.8 1.2-2.9 1.2-.5 0-1-.1-1.5-.3l-.3.5c.6.3 1.2.4 1.8.4 1.3 0 2.4-.5 3.3-1.4l-.4-.4z"
            fill="#F29111"
          />
        </svg>
      );

    // --------------------------------------------------------------------------
    // Git
    // --------------------------------------------------------------------------
    case 'git':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
          aria-label="Git Logo"
          {...props}
        >
          <path
            d="M23.546 10.93L13.067.452a1.5 1.5 0 0 0-2.126 0L8.808 2.585l2.83 2.829a1.78 1.78 0 0 1 2.247 2.261l2.723 2.724a1.78 1.78 0 0 1 2.27 2.257l3.668 3.668a1.5 1.5 0 0 0 2.126-2.126l-1.126-1.126zm-14.738-4.52l-6.356 6.355a1.5 1.5 0 0 0 0 2.126l10.479 10.478a1.5 1.5 0 0 0 2.126 0l6.326-6.325-2.859-2.86a1.78 1.78 0 0 1-2.227-2.264l-2.73-2.73a1.78 1.78 0 0 1-1.768-.466l-2.991 2.991a1.78 1.78 0 1 1-1.06-1.06l2.977-2.977a1.78 1.78 0 0 1-.466-1.769l-1.45-1.45z"
            fill={color || '#F05032'}
          />
        </svg>
      );

    // --------------------------------------------------------------------------
    // GitHub
    // --------------------------------------------------------------------------
    case 'github':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', color: color || '#F5F8FF', ...style }}
          aria-label="GitHub Logo"
          {...props}
        >
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
      );

    // --------------------------------------------------------------------------
    // VS Code
    // --------------------------------------------------------------------------
    case 'vscode':
    case 'visualstudiocode':
    case 'vscodeide':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
          aria-label="VS Code Logo"
          {...props}
        >
          <path
            d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .32 8.688l3.65 3.31-3.65 3.314a1 1 0 0 0 .006 1.427l1.323 1.202a1 1 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"
            fill={color || '#007ACC'}
          />
        </svg>
      );

    // --------------------------------------------------------------------------
    // Django
    // --------------------------------------------------------------------------
    case 'django':
    case 'djangorestframework':
    case 'drf':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', color: color || '#00D9FF', ...style }}
          aria-label="Django Logo"
          {...props}
        >
          <path d="M11.146 0h3.924v18.777c-1.897.378-3.153.514-4.577.514-4.551 0-7.072-2.004-7.072-5.607 0-3.494 2.492-5.742 6.177-5.742.623 0 1.056.054 1.548.19V0zm0 11.242a4.34 4.34 0 0 0-1.463-.244c-2.032 0-3.359 1.165-3.359 3.142 0 1.95 1.273 3.088 3.278 3.088.514 0 .975-.054 1.544-.19v-5.796zm12.854 4.714v.244c0 3.332-1.707 4.93-5.066 4.93-1.653 0-3.116-.325-4.145-.813l.813-2.925c.894.433 2.086.731 3.251.731 1.761 0 2.492-.704 2.492-2.221V8.37h2.655v7.586zM21.345 4.388c0 1.138-.894 2.032-2.032 2.032-1.138 0-2.032-.894-2.032-2.032 0-1.138.894-2.032 2.032-2.032 1.138 0 2.032.894 2.032 2.032z" />
        </svg>
      );

    // --------------------------------------------------------------------------
    // Clean Fallback for other / custom technologies
    // --------------------------------------------------------------------------
    default:
      return (
        <Code2
          size={size}
          color={color || 'var(--color-neon-cyan, #00D9FF)'}
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
          aria-hidden="true"
          {...props}
        />
      );
  }
};

/**
 * Registry of available technology icons for admin selection
 */
export const AVAILABLE_TECH_ICONS = [
  { id: 'html5', label: 'HTML5', defaultColor: '#E34F26' },
  { id: 'css3', label: 'CSS3', defaultColor: '#1572B6' },
  { id: 'javascript', label: 'JavaScript', defaultColor: '#F7DF1E' },
  { id: 'react', label: 'React', defaultColor: '#00D9FF' },
  { id: 'python', label: 'Python', defaultColor: '#3776AB' },
  { id: 'c++', label: 'C++', defaultColor: '#00599C' },
  { id: 'php', label: 'PHP', defaultColor: '#777BB4' },
  { id: 'mysql', label: 'MySQL', defaultColor: '#00D9FF' },
  { id: 'git', label: 'Git', defaultColor: '#F05032' },
  { id: 'github', label: 'GitHub', defaultColor: '#F5F8FF' },
  { id: 'vscode', label: 'VS Code', defaultColor: '#007ACC' },
  { id: 'django', label: 'Django', defaultColor: '#092E20' },
  { id: 'other', label: 'Other / Code', defaultColor: '#00D9FF' }
];

export default TechIcon;
