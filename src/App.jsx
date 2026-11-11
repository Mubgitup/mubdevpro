import React from 'react';
import { Router, Route, useRouter } from './router/Router';
import { ProtectedRoute } from './router/ProtectedRoute';

// Public Homepage
import { PublicHomePage } from './pages/public/PublicHomePage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProfilePage } from './pages/admin/AdminProfilePage';
import { AdminAboutPage } from './pages/admin/AdminAboutPage';
import { AdminSkillsPage } from './pages/admin/AdminSkillsPage';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { AdminEducationPage } from './pages/admin/AdminEducationPage';
import { AdminCertificatesPage } from './pages/admin/AdminCertificatesPage';
import { AdminAchievementsPage } from './pages/admin/AdminAchievementsPage';
import { AdminSocialMediaPage } from './pages/admin/AdminSocialMediaPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

const KNOWN_ROUTES = [
  '/',
  '/admin/login',
  '/admin',
  '/admin/profile',
  '/admin/about',
  '/admin/skills',
  '/admin/projects',
  '/admin/education',
  '/admin/certificates',
  '/admin/achievements',
  '/admin/social-media',
  '/admin/messages',
  '/admin/settings'
];

/**
 * Fallback route handler:
 * Directs unknown administrative URLs to /admin/login,
 * and unknown public URLs to the PublicHomePage.
 */
function RouteFallback() {
  const { path } = useRouter();
  const normCurrent = path.replace(/\/+$/, '') || '/';

  if (!KNOWN_ROUTES.includes(normCurrent)) {
    if (normCurrent.startsWith('/admin')) {
      return <AdminLoginPage />;
    }
    return <PublicHomePage />;
  }
  return null;
}

export function App() {
  return (
    <Router>
      {/* 1. Public Portfolio Website */}
      <Route path="/" element={<PublicHomePage />} />

      {/* 2. Admin Authentication (Publicly accessible without auth) */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* 3. Protected Admin Routes (Requires authentication token) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute>
            <AdminProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/about"
        element={
          <ProtectedRoute>
            <AdminAboutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/skills"
        element={
          <ProtectedRoute>
            <AdminSkillsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/projects"
        element={
          <ProtectedRoute>
            <AdminProjectsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/education"
        element={
          <ProtectedRoute>
            <AdminEducationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/certificates"
        element={
          <ProtectedRoute>
            <AdminCertificatesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/achievements"
        element={
          <ProtectedRoute>
            <AdminAchievementsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/social-media"
        element={
          <ProtectedRoute>
            <AdminSocialMediaPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/messages"
        element={
          <ProtectedRoute>
            <AdminMessagesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute>
            <AdminSettingsPage />
          </ProtectedRoute>
        }
      />

      {/* 4. Graceful Fallback for unknown URLs */}
      <RouteFallback />
    </Router>
  );
}

export default App;
