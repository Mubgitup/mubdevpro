import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ThreeBackground } from '../effects/ThreeBackground';
import { LightTrails } from '../effects/LightTrails';

/**
 * Core Application Layout
 * Provides 3D Three.js technology background, flowing light trails,
 * glassmorphic navigation, and footer shell.
 */
export const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      {/* 3D Three.js Ambient Tech Background */}
      <ThreeBackground />

      {/* Flowing Vector Light Trails */}
      <LightTrails />

      {/* Ambient Grid Backdrop */}
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
