import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

/**
 * Core Application Layout
 * Provides ambient futuristic background layers, glass navigation, and footer shell.
 */
export const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      {/* Background Ambience Layers */}
      <div className="mub-background-glow" aria-hidden="true" />
      <div className="mub-grid-overlay" aria-hidden="true" />

      {/* Glass Navigation Bar */}
      <Navbar />

      {/* Main Page Content */}
      <main className="main-content">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;

