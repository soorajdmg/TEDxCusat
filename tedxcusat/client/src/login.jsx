import React, { useState, useEffect } from 'react';
import './login.css';

const Login = ({ onClose, onSwitchToSignup, onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [googleLoading, setGoogleLoading] = useState(false);
    const [googleReady, setGoogleReady] = useState(false);

    const decodeJWT = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error decoding JWT:', error);
            return null;
        }
    };

    useEffect(() => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        console.log("Client ID:", clientId);

        if (!clientId) {
            console.error('Google Client ID is missing. Check your .env file.');
            setError('Google authentication is not configured properly.');
            return;
        }

        const initializeGoogleAuth = () => {
            if (window.google && window.google.accounts) {
                try {
                    window.google.accounts.id.initialize({
                        client_id: clientId,
                        callback: handleGoogleResponse,
                        auto_select: false,
                        cancel_on_tap_outside: true
                    });
                    setGoogleReady(true);
                    console.log("Google OAuth initialized successfully");
                } catch (error) {
                    console.error("Error initializing Google OAuth:", error);
                    setError('Failed to initialize Google authentication.');
                }
            } else {
                console.error("Google accounts API not available");
            }
        };

        if (window.google) {
            initializeGoogleAuth();
        } else {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = () => {
                console.log("Google script loaded");
                setTimeout(initializeGoogleAuth, 100);
            };
            script.onerror = () => {
                console.error("Failed to load Google script");
                setError('Failed to load Google authentication.');
            };
            document.head.appendChild(script);
        }

        return () => {
            const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
            if (existingScript && existingScript.onload) {
                existingScript.remove();
            }
        };
    }, []);

    const handleGoogleResponse = async (response) => {
        console.log("Google response received:", response);
        setGoogleLoading(true);
        setError('');

        try {
            const googleUserInfo = decodeJWT(response.credential);
            console.log("Decoded Google user info:", googleUserInfo);

            const loginResponse = await fetch('http://localhost:5000/api/auth/google-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    credential: response.credential
                }),
            });

            const loginResult = await loginResponse.json();

            if (loginResponse.ok) {
                const userData = {
                    ...loginResult.data.user,
                    profilePicture: googleUserInfo?.picture || loginResult.data.user.profilePicture || loginResult.data.user.picture,
                    picture: googleUserInfo?.picture || loginResult.data.user.picture || loginResult.data.user.profilePicture
                };

                console.log("Final user data with profile picture:", userData);

                localStorage.setItem('authToken', loginResult.data.accessToken || loginResult.data.token);
                localStorage.setItem('user', JSON.stringify(userData));
                onLoginSuccess(userData);
                onClose();
            } else if (loginResponse.status === 404 || loginResponse.status === 401) {
                console.log("User doesn't exist, attempting signup...");

                const signupResponse = await fetch('http://localhost:5000/api/auth/google-signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        credential: response.credential
                    }),
                });

                const signupResult = await signupResponse.json();

                if (signupResponse.ok) {
                    const userData = {
                        ...signupResult.data.user,
                        profilePicture: googleUserInfo?.picture || signupResult.data.user.profilePicture || signupResult.data.user.picture,
                        picture: googleUserInfo?.picture || signupResult.data.user.picture || signupResult.data.user.profilePicture
                    };

                    console.log("Final signup user data with profile picture:", userData);

                    localStorage.setItem('authToken', signupResult.data.accessToken || signupResult.data.token);
                    localStorage.setItem('user', JSON.stringify(userData));
                    onLoginSuccess(userData);
                    onClose();
                } else {
                    setError('Unable to authenticate with Google. Please try again or use email/password.');
                }
            } else {
                setError(loginResult.message || 'Google login failed. Please try again.');
            }
        } catch (err) {
            setError('Network error during Google authentication. Please try again.');
            console.error('Google authentication error:', err);
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        console.log("Google login button clicked");
        console.log("Google ready:", googleReady);
        console.log("Window.google:", window.google);

        if (!googleReady) {
            setError('Google authentication is still loading. Please wait a moment and try again.');
            return;
        }

        if (window.google && window.google.accounts) {
            try {
                window.google.accounts.id.prompt((notification) => {
                    console.log("Google prompt notification:", notification);
                    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                        console.log("Google prompt was not displayed or skipped");
                        const tempDiv = document.createElement('div');
                        document.body.appendChild(tempDiv);

                        window.google.accounts.id.renderButton(tempDiv, {
                            theme: 'outline',
                            size: 'large',
                            type: 'standard'
                        });

                        setTimeout(() => {
                            const googleBtn = tempDiv.querySelector('div[role="button"]');
                            if (googleBtn) {
                                googleBtn.click();
                            }
                            document.body.removeChild(tempDiv);
                        }, 100);
                    }
                });
            } catch (error) {
                console.error("Error triggering Google prompt:", error);
                setError('Failed to open Google sign-in. Please try again.');
            }
        } else {
            console.error("Google accounts API not available");
            setError('Google authentication is not available. Please try again.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            console.log('Response status:', response.status);
            console.log('Form data sent:', formData);

            const result = await response.json();
            console.log('Form data received:', result.data);

            if (response.ok) {
                localStorage.setItem('authToken', result.data.accessToken || result.data.token);
                localStorage.setItem('user', JSON.stringify(result.data.user));

                onLoginSuccess(result.data.user);
                onClose();
            } else if (response.status === 404) {
                setError('No account found with this email. Please check your email or sign up.');
            } else if (response.status === 401) {
                setError('Invalid email or password. Please try again.');
            } else {
                setError(result.message || 'Login failed. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please check your connection and try again.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    const isAnyLoading = loading || googleLoading;

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                <div className="auth-modal-header">
                    <h2>Welcome Back</h2>
                    <button className="auth-close" onClick={onClose}>×</button>
                </div>

                {error && (
                    <div className="auth-error">
                        <span className="error-icon">⚠️</span>
                        {error}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                            disabled={isAnyLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                            disabled={isAnyLoading}
                        />
                    </div>

                    <div className="form-options">
                        <label className="checkbox-container">
                            <input type="checkbox" disabled={isAnyLoading} />
                            <span className="checkmark"></span>
                            Remember me
                        </label>
                        <a href="#forgot-password" className="forgot-password">
                            Forgot password?
                        </a>
                    </div>

                    <button type="submit" className="auth-submit" disabled={isAnyLoading}>
                        {loading ? (
                            <span className="loading-spinner">
                                <span className="spinner"></span>
                                Logging in...
                            </span>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>

                <div className="auth-switch">
                    <p>
                        Don't have an account?{' '}
                        <button
                            type="button"
                            className="auth-switch-btn"
                            onClick={onSwitchToSignup}
                            disabled={isAnyLoading}
                        >
                            Sign Up
                        </button>
                    </p>
                </div>

                <div className="auth-divider">
                    <span>or</span>
                </div>

                <div className="social-login">
                    <button
                        type="button"
                        className="social-btn google-btn"
                        onClick={handleGoogleLogin}
                        disabled={isAnyLoading || !googleReady}
                    >
                        {googleLoading ? (
                            <span className="loading-spinner">
                                <span className="spinner"></span>
                                Signing in with Google...
                            </span>
                        ) : !googleReady ? (
                            <>
                                <span className="social-icon">
                                    <svg width="20" height="20" viewBox="0 0 48 48">
                                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                                    </svg>
                                </span>
                                Loading Google...
                            </>
                        ) : (
                            <>
                                <span className="social-icon">
                                    <svg width="20" height="20" viewBox="0 0 48 48">
                                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                                    </svg>
                                </span>
                                Continue with Google
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;