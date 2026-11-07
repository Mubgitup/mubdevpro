import React from 'react';
import { 
  LayoutDashboard, 
  User, 
  Info, 
  Code, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Share2, 
  Mail, 
  Settings, 
  LogOut, 
  ExternalLink,
  ShieldAlert,
  ChevronRight,
  X
} from 'lucide-react';
import { Link, useRouter } from '../../router/Router';
import { MubdevLogo } from '../../assets/logo/MubdevLogo';
import api from '../../services/api';

const NAV_ITEMS = [
  { path: '/admin', label: 'Overview', icon: LayoutDashboard },
  { path: '/admin/profile', label: 'Profile', icon: User },
  { path: '/admin/about', label: 'About', icon: Info },
  { path: '/admin/skills', label: 'Skills', icon: Code },
  { path: '/admin/projects', label: 'Projects', icon: Briefcase },
  { path: '/admin/education', label: 'Education', icon: GraduationCap },
  { path: '/admin/certificates', label: 'Certificates', icon: Award },
  { path: '/admin/social-media', label: 'Social Media', icon: Share2 },
  { path: '/admin/messages', label: 'Contact Messages', icon: Mail, hasBadge: true },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export const AdminSidebar = ({ isOpen, onClose, unreadCount = 0 }) => {
  const { path, navigate } = useRouter();

  const handleLogout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // Ignore network errors on logout
    }
    navigate('/admin/login');
  };

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
      {/* Sidebar Header */}
      <div className="admin-sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <MubdevLogo size="sm" showText={true} />
          <span className="admin-brand-badge">ADMIN</span>
        </div>
        {isOpen && (
          <button 
            onClick={onClose}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ padding: '0.25rem', border: 'none', background: 'transparent' }}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="admin-nav-list">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = path === item.path || (item.path !== '/admin' && path.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => {
                if (onClose) onClose();
              }}
              className={`admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {item.hasBadge && unreadCount > 0 && (
                <span className="admin-nav-badge">{unreadCount}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="admin-sidebar-footer">
        <div className="admin-user-pill">
          <div className="admin-avatar">M</div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>Mubarek (Admin)</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(245, 248, 255, 0.5)' }}>admin@mubdev.com</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link 
            to="/" 
            className="admin-btn admin-btn-secondary admin-btn-sm" 
            style={{ flex: 1, fontSize: '0.75rem' }}
            title="Return to Public Website"
          >
            <ExternalLink size={14} /> Live Site
          </Link>
          <button 
            onClick={handleLogout}
            className="admin-btn admin-btn-danger admin-btn-sm"
            style={{ fontSize: '0.75rem' }}
            title="Sign out of Admin Dashboard"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;

