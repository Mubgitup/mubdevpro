import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable GlassCard Component for Mubdev Design System
 * 
 * @param {Object} props
 * @param {'default' | 'elevated' | 'interactive'} [props.variant='default']
 * @param {'cyan' | 'blue' | 'violet' | 'none'} [props.glowColor='cyan']
 * @param {string} [props.className='']
 * @param {Object} [props.style={}]
 * @param {React.ReactNode} props.children
 */
export const GlassCard = ({
  variant = 'default',
  glowColor = 'cyan',
  className = '',
  style = {},
  children,
  ...rest
}) => {
  const isInteractive = variant === 'interactive';

  const glowStyle = {
    cyan: 'var(--glow-cyan-sm)',
    blue: 'var(--glow-blue-sm)',
    violet: 'var(--glow-violet-sm)',
    none: 'none'
  }[glowColor];

  const motionProps = isInteractive
    ? {
        whileHover: { y: -4, boxShadow: `${glowStyle}, var(--shadow-elevation-2)` },
        transition: { duration: 0.25 }
      }
    : {};

  return (
    <motion.div
      className={`glass-card ${className}`.trim()}
      style={{
        ...style
      }}
      {...motionProps}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
