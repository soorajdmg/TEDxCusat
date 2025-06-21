import React, { useState, useEffect, useRef } from 'react';
import './profile.css';

const ProfileDropdown = ({ 
  user, 
  isOpen, 
  onClose, 
  onLogout, 
  onProfileEdit,
  onSettings,
  onAdminPanel 
}) => {
  const dropdownRef = useRef(null);
  const [activeSection, setActiveSection] = useState('profile');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Sample user stats (you can replace with real data)
  const userStats = {
    eventsAttended: 12,
    registrations: 8,
    favorites: 15,
    connections: 234
  };

  const menuItems = [
    {
      id: 'profile',
      icon: '👤',
      label: 'My Profile',
      action: () => onProfileEdit()
    },
    {
      id: 'events',
      icon: '🎫',
      label: 'My Events',
      action: () => console.log('My Events')
    },
    {
      id: 'favorites',
      icon: '❤️',
      label: 'Favorites',
      action: () => console.log('Favorites')
    },
    {
      id: 'settings',
      icon: '⚙️',
      label: 'Settings',
      action: () => onSettings()
    },
    {
      id: 'notifications',
      icon: '🔔',
      label: 'Notifications',
      action: () => console.log('Notifications')
    }
  ];

  const adminMenuItems = [
    {
      id: 'dashboard',
      icon: '📊',
      label: 'Admin Dashboard',
      action: () => onAdminPanel()
    },
    {
      id: 'users',
      icon: '👥',
      label: 'Manage Users',
      action: () => console.log('Manage Users')
    },
    {
      id: 'events-admin',
      icon: '🎪',
      label: 'Manage Events',
      action: () => console.log('Manage Events')
    },
    {
      id: 'analytics',
      icon: '📈',
      label: 'Analytics',
      action: () => console.log('Analytics')
    }
  ];

  if (!isOpen) return null;

  return (
    <>
      <div className="profile-overlay" />
      <div className={`profile-dropdown ${user?.isAdmin ? 'admin' : ''}`} ref={dropdownRef}>
        {/* Header Section */}
        <div className="profile-header">
          <div className="profile-header-bg">
            <div className="profile-header-pattern"></div>
          </div>
          
          <div className="profile-user-info">
            <div className={`profile-avatar-container ${user?.isAdmin ? 'admin' : ''}`}>
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="profile-avatar-image"
                />
              ) : (
                <div className={`profile-avatar-fallback ${user?.isAdmin ? 'admin' : ''}`}>
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
              {user?.isAdmin && <div className="profile-admin-badge">A</div>}
              <div className="profile-status-indicator online"></div>
            </div>
            
            <div className="profile-user-details">
              <h3 className="profile-user-name">
                {user?.name || 'User'}
                {user?.isAdmin && <span className="profile-admin-tag">ADMIN</span>}
              </h3>
              <p className="profile-user-email">{user?.email || 'user@example.com'}</p>
              <p className="profile-user-role">
                {user?.isAdmin ? 'Administrator' : 'Event Attendee'}
              </p>
            </div>
          </div>

          {/* User Stats */}
          <div className="profile-stats">
            <div className="profile-stat">
              <span className="profile-stat-number">{userStats.eventsAttended}</span>
              <span className="profile-stat-label">Events</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-number">{userStats.registrations}</span>
              <span className="profile-stat-label">Registered</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-number">{userStats.favorites}</span>
              <span className="profile-stat-label">Favorites</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-number">{userStats.connections}</span>
              <span className="profile-stat-label">Connections</span>
            </div>
          </div>
        </div>

        {/* Menu Sections */}
        <div className="profile-menu">
          {/* Personal Menu */}
          <div className="profile-menu-section">
            <h4 className="profile-menu-title">Personal</h4>
            <div className="profile-menu-items">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className={`profile-menu-item ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSection(item.id);
                    item.action();
                  }}
                >
                  <span className="profile-menu-icon">{item.icon}</span>
                  <span className="profile-menu-label">{item.label}</span>
                  <span className="profile-menu-arrow">→</span>
                </button>
              ))}
            </div>
          </div>

          {/* Admin Menu */}
          {user?.isAdmin && (
            <div className="profile-menu-section admin-section">
              <h4 className="profile-menu-title admin-title">Administration</h4>
              <div className="profile-menu-items">
                {adminMenuItems.map((item) => (
                  <button
                    key={item.id}
                    className={`profile-menu-item admin-item ${activeSection === item.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveSection(item.id);
                      item.action();
                    }}
                  >
                    <span className="profile-menu-icon">{item.icon}</span>
                    <span className="profile-menu-label">{item.label}</span>
                    <span className="profile-menu-arrow">→</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="profile-quick-actions">
            <button className="profile-quick-action">
              <span className="profile-quick-icon">🌙</span>
              <span>Dark Mode</span>
            </button>
            <button className="profile-quick-action">
              <span className="profile-quick-icon">🔔</span>
              <span>Notifications</span>
            </button>
            <button className="profile-quick-action">
              <span className="profile-quick-icon">❓</span>
              <span>Help</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="profile-footer">
          <button className="profile-logout-btn" onClick={onLogout}>
            <span className="profile-logout-icon">🚪</span>
            <span>Sign Out</span>
          </button>
          <div className="profile-version">
            <span>TEDxCUSAT v2.0</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileDropdown;