import React, { useState, useEffect } from 'react';
import Login from './login';
import Signup from './signup';
import './navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
        await fetch('http://localhost:5000/api/auth/logout', {
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
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

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
                <button className={`navbar-cta mobile ${isAdmin ? 'admin' : ''}`} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>

          <div className="navbar-actions">
            {isLoggedIn ? (
              <div className={`user-menu ${isAdmin ? 'admin' : ''}`}>
                {renderUserAvatar()}
                <div className="user-info">
                  <span className="user-greeting">Hello, {user?.name}!</span>
                  <span className="user-email">{user?.email}</span>
                  {isAdmin && <span className="admin-role-badge">Administrator</span>}
                </div>
                <button className={`navbar-cta ${isAdmin ? 'admin' : ''}`} onClick={handleLogout}>
                  Logout
                </button>
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
    </>
  );
};

export default Navbar;