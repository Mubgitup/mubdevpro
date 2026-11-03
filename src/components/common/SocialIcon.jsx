import React from 'react';
import { Github, Instagram, Globe } from 'lucide-react';

/**
 * Reusable official brand icon component for social media channels.
 * Uses official Lucide icons for GitHub & Instagram, and authentic vector
 * brand glyphs for Telegram & TikTok with full currentColor & responsive sizing.
 */
export const SocialIcon = ({ name = '', size = 18, className = '', ...props }) => {
  const normalized = String(name).toLowerCase().trim();

  switch (normalized) {
    case 'github':
      return <Github size={size} className={className} aria-hidden="true" {...props} />;

    case 'instagram':
      return <Instagram size={size} className={className} aria-hidden="true" {...props} />;

    case 'telegram':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          aria-hidden="true"
          style={{ display: 'inline-block', verticalAlign: 'middle' }}
          {...props}
        >
          <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.693c.46 0 .663-.211.921-.46l2.211-2.15 4.6 3.398c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z" />
        </svg>
      );

    case 'tiktok':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          aria-hidden="true"
          style={{ display: 'inline-block', verticalAlign: 'middle' }}
          {...props}
        >
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.77 1.81-.03 3.31-1.42 3.44-3.22.06-2.58.03-5.16.03-7.74.01-4.43.01-8.86.01-13.29z" />
        </svg>
      );

    default:
      return <Globe size={size} className={className} aria-hidden="true" {...props} />;
  }
};

export default SocialIcon;

