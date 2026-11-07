import React, { useState, useEffect } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminNavbar } from './AdminNavbar';
import api from '../../services/api';
import '../../styles/admin.css';

/**
 * AdminLayout
 * Wraps all protected administrative routes with the dedicated admin shell:
 * - Collapsible responsive sidebar
 * - Top header with breadcrumbs and live system connection monitor
 * - Content area matching the dark futuristic Mubdev aesthetic
 */
export const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.messages.list({ limit: 1 });
      if (res.meta?.unread_count !== undefined) {
        setUnreadCount(res.meta.unread_count);
      }
    } catch {
      // Ignore background counter error
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const timer = setInterval(fetchUnreadCount, 45000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="admin-root">
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div 
          className="admin-mobile-overlay" 
          onClick={() => setSidebarOpen(false)} 
          aria-hidden="true" 
        />
      )}

      {/* Admin Sidebar */}
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        unreadCount={unreadCount} 
      />

      {/* Admin Content Viewport */}
      <div className="admin-main">
        <AdminNavbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="admin-page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

