import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Button Component for Mubdev Design System
 * 
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'ghost'} [props.variant='primary']
 * @param {'sm' | 'md' | 'lg'} [props.size='md']
 * @param {React.ReactNode} [props.icon]
 * @param {'left' | 'right'} [props.iconPosition='left']
 * @param {string} [props.href]
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.className='']
 * @param {React.ReactNode} props.children
 * @param {function} [props.onClick]
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  icon = null,
  iconPosition = 'left',
  href = null,
  disabled = false,
  className = '',
  children,
  onClick,
  ...rest
}) => {
  const baseClasses = `btn btn-${variant} btn-${size} ${className}`.trim();

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="btn-icon">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="btn-icon">{icon}</span>}
    </>
  );

  const motionProps = {
    whileHover: disabled ? {} : { scale: 1.02 },
    whileTap: disabled ? {} : { scale: 0.98 },
    transition: { type: 'spring', stiffness: 400, damping: 25 }
  };

  if (href && !disabled) {
    return (
      <motion.a
        href={href}
        className={baseClasses}
        onClick={onClick}
        {...motionProps}
        {...rest}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      className={baseClasses}
      disabled={disabled}
      onClick={onClick}
      {...motionProps}
      {...rest}
    >
      {content}
    </motion.button>
  );
};

export default Button;

