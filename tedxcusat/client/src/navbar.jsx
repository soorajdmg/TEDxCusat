import React, { useState, useEffect } from 'react';
import Login from './login';
import Signup from './signup';
import Profile from './profile';
import './navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [imageLoadError, setImageLoadError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('Loaded user from localStorage:', parsedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  }, []);

  useEffect(() => {
    setImageLoadError(false);
  }, [user]);

  const isAdmin = user?.role === 'admin' || user?.isAdmin === true;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const openProfile = () => {
    setIsProfileOpen(true);
    setShowProfileDropdown(false);
  };

  const closeProfile = () => {
    setIsProfileOpen(false);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const openLogin = () => {
    setShowLogin(true);
    setShowSignup(false);
    setIsOpen(false);
  };

  const openSignup = () => {
    setShowSignup(true);
    setShowLogin(false);
    setIsOpen(false);
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowSignup(false);
  };

  const switchToSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const switchToLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const handleLoginSuccess = (userData) => {
    console.log('Login success - user data received:', userData);
    setUser(userData);
    setIsLoggedIn(true);
    setShowLogin(false);
    setImageLoadError(false);
  };

  const handleSignupSuccess = (userData) => {
    console.log('Signup success - user data received:', userData);
    setUser(userData);
    setIsLoggedIn(true);
    setShowSignup(false);
    setImageLoadError(false);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        await fetch('https://tedxcusat-backend.onrender.com/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
      setIsLoggedIn(false);
      setImageLoadError(false);
      setShowProfileDropdown(false);
    }
  };

  const handleImageError = (e) => {
    console.log('Image failed to load:', e.target.src);
    setImageLoadError(true);
  };

  const handleImageLoad = (e) => {
    console.log('Image loaded successfully:', e.target.src);
    setImageLoadError(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.navbar-container')) {
        setIsOpen(false);
      }
      if (showProfileDropdown && !event.target.closest('.user-menu')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, showProfileDropdown]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const getProfilePictureUrl = () => {
    if (!user) return null;

    const possibleUrls = [
      user.profilePicture,
      user.picture,
      user.avatar,
      user.photo
    ];

    console.log('User object:', user);
    console.log('Possible profile picture URLs:', possibleUrls);

    const validUrl = possibleUrls.find(url => url && typeof url === 'string' && url.trim() !== '');
    console.log('Selected profile picture URL:', validUrl);

    return validUrl;
  };

  const renderUserAvatar = () => {
    const profilePictureUrl = getProfilePictureUrl();
    const hasValidImage = profilePictureUrl && !imageLoadError;

    console.log('Rendering avatar - URL:', profilePictureUrl, 'hasValidImage:', hasValidImage, 'imageLoadError:', imageLoadError);

    return (
      <div className={`user-avatar-container ${isAdmin ? 'admin' : ''}`}>
        {hasValidImage ? (
          <img
            src={profilePictureUrl}
            alt={`${user.name || 'User'}'s profile`}
            className="user-avatar-image"
            onError={handleImageError}
            onLoad={handleImageLoad}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className={`user-avatar-fallback ${isAdmin ? 'admin' : ''}`}>
            {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        )}
        {isAdmin && <div className="admin-badge">★</div>}
      </div>
    );
  };

  return (
    <>
      <nav className={`navbar ${isAdmin ? 'admin-navbar' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-brand" onClick={() => scrollToSection('home')}>
            <span className="ted">TED</span>
            <span className="x">x</span>
            <span className="cusat">CUSAT</span>
            {isAdmin && <span className="admin-indicator">ADMIN</span>}
          </div>

          <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
            <a
              href="#home"
              className="navbar-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('home');
              }}
            >
              Home
            </a>
            <a
              href="#speakers"
              className="navbar-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('speakers');
              }}
            >
              Speakers
            </a>
            <a
              href="#about"
              className="navbar-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('about');
              }}
            >
              About
            </a>
            <a
              href="#contact"
              className="navbar-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('contact');
              }}
            >
              Contact
            </a>

            {isAdmin && (
              <>
                <a
                  href="#dashboard"
                  className="navbar-link admin-link"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('dashboard');
                  }}
                >
                  Dashboard
                </a>
                <a
                  href="#manage"
                  className="navbar-link admin-link"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('manage');
                  }}
                >
                  Manage
                </a>
              </>
            )}

            {!isLoggedIn && (
              <div className="mobile-auth-buttons">
                <button
                  className="navbar-login mobile"
                  onClick={openLogin}
                >
                  Login
                </button>
                <button
                  className="navbar-cta mobile"
                  onClick={openSignup}
                >
                  Sign Up
                </button>
              </div>
            )}

            {isLoggedIn && (
              <div className="mobile-user-menu">
                <div className={`mobile-user-profile ${isAdmin ? 'admin' : ''}`}>
                  {renderUserAvatar()}
                  <div className="mobile-user-details">
                    <span className="user-greeting mobile">Hello, {user?.name}!</span>
                    {isAdmin && <span className="admin-role-badge mobile">Administrator</span>}
                  </div>
                </div>
                <div className="mobile-profile-actions">
                  <button className="mobile-profile-btn" onClick={openProfile}>
                    View Profile
                  </button>
                  <button className={`navbar-cta mobile ${isAdmin ? 'admin' : ''}`} onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="navbar-actions">
            {isLoggedIn ? (
              <div className={`user-menu ${isAdmin ? 'admin' : ''}`}>
                <div className="user-menu-trigger" onClick={toggleProfileDropdown}>
                  {renderUserAvatar()}
                  <div className="user-info">
                    <span className="user-greeting">Hello, {user?.name}!</span>
                    <span className="user-email">{user?.email}</span>
                    {isAdmin && <span className="admin-role-badge">Administrator</span>}
                  </div>
                  <div className={`dropdown-arrow ${showProfileDropdown ? 'open' : ''}`}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                
                {showProfileDropdown && (
                  <div className={`profile-dropdown ${showProfileDropdown ? 'active' : ''} ${isAdmin ? 'admin' : ''}`}>
                    <div className="dropdown-header">
                      <div className="dropdown-user-info">
                        {renderUserAvatar()}
                        <div className="dropdown-user-details">
                          <span className="dropdown-user-name">{user?.name}</span>
                          <span className="dropdown-user-email">{user?.email}</span>
                          {isAdmin && <span className="dropdown-admin-badge">Administrator</span>}
                        </div>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <div className="dropdown-menu">
                      <button className="dropdown-item" onClick={openProfile}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8Z" fill="currentColor"/>
                          <path d="M8 10C3.58172 10 0 13.5817 0 18H16C16 13.5817 12.4183 10 8 10Z" fill="currentColor"/>
                        </svg>
                        View Profile
                      </button>
                      <button className="dropdown-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 1C11.866 1 15 4.134 15 8C15 11.866 11.866 15 8 15C4.134 15 1 11.866 1 8C1 4.134 4.134 1 8 1ZM8 2.5C4.9625 2.5 2.5 4.9625 2.5 8C2.5 11.0375 4.9625 13.5 8 13.5C11.0375 13.5 13.5 11.0375 13.5 8C13.5 4.9625 11.0375 2.5 8 2.5ZM8 4.25C8.4142 4.25 8.75 4.5858 8.75 5V8C8.75 8.4142 8.4142 8.75 8 8.75C7.5858 8.75 7.25 8.4142 7.25 8V5C7.25 4.5858 7.5858 4.25 8 4.25ZM8 10.25C8.4142 10.25 8.75 10.5858 8.75 11C8.75 11.4142 8.4142 11.75 8 11.75C7.5858 11.75 7.25 11.4142 7.25 11C7.25 10.5858 7.5858 10.25 8 10.25Z" fill="currentColor"/>
                        </svg>
                        Help & Support
                      </button>
                      {isAdmin && (
                        <>
                          <div className="dropdown-divider"></div>
                          <button className="dropdown-item admin-item" onClick={() => scrollToSection('dashboard')}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 3C1 2.44772 1.44772 2 2 2H6C6.55228 2 7 2.44772 7 3V6C7 6.55228 6.55228 7 6 7H2C1.44772 7 1 6.55228 1 6V3Z" fill="currentColor"/>
                              <path d="M9 3C9 2.44772 9.44772 2 10 2H14C14.5523 2 15 2.44772 15 3V6C15 6.55228 14.5523 7 14 7H10C9.44772 7 9 6.55228 9 6V3Z" fill="currentColor"/>
                              <path d="M1 10C1 9.44772 1.44772 9 2 9H6C6.55228 9 7 9.44772 7 10V13C7 13.5523 6.55228 14 6 14H2C1.44772 14 1 13.5523 1 13V10Z" fill="currentColor"/>
                              <path d="M9 10C9 9.44772 9.44772 9 10 9H14C14.5523 9 15 9.44772 15 10V13C15 13.5523 14.5523 14 14 14H10C9.44772 14 9 13.5523 9 13V10Z" fill="currentColor"/>
                            </svg>
                            Admin Dashboard
                          </button>
                          <button className="dropdown-item admin-item" onClick={() => scrollToSection('manage')}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8 1C8.55228 1 9 1.44772 9 2V3.20711C9.89035 3.6018 10.3982 4.10965 10.7929 5H13C13.5523 5 14 5.44772 14 6C14 6.55228 13.5523 7 13 7H10.7929C10.3982 7.89035 9.89035 8.3982 9 8.79289V10H10C10.5523 10 11 10.4477 11 11C11 11.5523 10.5523 12 10 12H9V14C9 14.5523 8.55228 15 8 15C7.44772 15 7 14.5523 7 14V12H6C5.44772 12 5 11.5523 5 11C5 10.4477 5.44772 10 6 10H7V8.79289C6.10965 8.3982 5.6018 7.89035 5.20711 7H3C2.44772 7 2 6.55228 2 6C2 5.44772 2.44772 5 3 5H5.20711C5.6018 4.10965 6.10965 3.6018 7 3.20711V2C7 1.44772 7.44772 1 8 1Z" fill="currentColor"/>
                            </svg>
                            Manage Content
                          </button>
                        </>
                      )}
                      <div className="dropdown-divider"></div>
                      <button className="dropdown-item logout-item" onClick={handleLogout}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 2C6 1.44772 6.44772 1 7 1H13C13.5523 1 14 1.44772 14 2V14C14 14.5523 13.5523 15 13 15H7C6.44772 15 6 14.5523 6 14C6 13.4477 6.44772 13 7 13H12V3H7C6.44772 3 6 2.55228 6 2Z" fill="currentColor"/>
                          <path d="M2.29289 7.29289C1.90237 7.68342 1.90237 8.31658 2.29289 8.70711L4.29289 10.7071C4.68342 11.0976 5.31658 11.0976 5.70711 10.7071C6.09763 10.3166 6.09763 9.68342 5.70711 9.29289L4.41421 8L10 8C10.5523 8 11 7.55228 11 7C11 6.44772 10.5523 6 10 6L4.41421 6L5.70711 4.70711C6.09763 4.31658 6.09763 3.68342 5.70711 3.29289C5.31658 2.90237 4.68342 2.90237 4.29289 3.29289L2.29289 5.29289C1.90237 5.68342 1.90237 6.31658 2.29289 7.29289Z" fill="currentColor"/>
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <button
                  className="navbar-login"
                  onClick={openLogin}
                >
                  Login
                </button>
                <button
                  className="navbar-cta"
                  onClick={openSignup}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          <div className={`hamburger ${isOpen ? 'active' : ''} ${isAdmin ? 'admin' : ''}`} onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {showLogin && (
        <Login
          onClose={closeModals}
          onSwitchToSignup={switchToSignup}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {showSignup && (
        <Signup
          onClose={closeModals}
          onSwitchToLogin={switchToLogin}
          onSignupSuccess={handleSignupSuccess}
        />
      )}

      {isProfileOpen && (
        <Profile
          user={user}
          onClose={closeProfile}
          isAdmin={isAdmin}
        />
      )}
    </>
  );
};

export default Navbar;