import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Reusable MotionReveal Component
 * Smooth, scroll-triggered animations powered by Framer Motion.
 * Automatically respects user's prefers-reduced-motion preferences.
 * 
 * @param {Object} props
 * @param {'up' | 'down' | 'left' | 'right' | 'none'} [props.direction='up']
 * @param {number} [props.delay=0]
 * @param {number} [props.duration=0.55]
 * @param {number} [props.distance=24]
 * @param {string} [props.className='']
 * @param {Object} [props.style={}]
 * @param {boolean} [props.viewportOnce=true]
 * @param {React.ReactNode} props.children
 */
export const MotionReveal = ({
  direction = 'up',
  delay = 0,
  duration = 0.55,
  distance = 24,
  className = '',
  style = {},
  viewportOnce = true,
  children,
  ...rest
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={className} style={style} {...rest}>
        {children}
      </div>
    );
  }

  const offsetMap = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none: { x: 0, y: 0 }
  };

  const initialOffset = offsetMap[direction] || offsetMap.up;

  const variants = {
    hidden: {
      opacity: 0,
      x: initialOffset.x,
      y: initialOffset.y
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1] // Apple / cubic-bezier smooth ease-out
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: viewportOnce, margin: '-40px' }}
      variants={variants}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default MotionReveal;
