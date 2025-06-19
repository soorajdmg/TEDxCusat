import React, { useState, useEffect } from 'react';
import './signup.css';

const Signup = ({ onClose, onSwitchToLogin, onSignupSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [googleReady, setGoogleReady] = useState(false);

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
            const signupResponse = await fetch('https://tedxcusat-backend.onrender.com/api/auth/google-signup', {
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
                localStorage.setItem('authToken', signupResult.data.accessToken || signupResult.data.token);
                localStorage.setItem('user', JSON.stringify(signupResult.data.user));
                onSignupSuccess(signupResult.data.user);
                onClose();
            } else if (signupResponse.status === 409) {
                console.log("User already exists, attempting login...");

                const loginResponse = await fetch('https://tedxcusat-backend.onrender.com/api/auth/google-login', {
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
                    localStorage.setItem('authToken', loginResult.data.accessToken || loginResult.data.token);
                    localStorage.setItem('user', JSON.stringify(loginResult.data.user));
                    onSignupSuccess(loginResult.data.user);
                    onClose();
                } else {
                    setError('An account with this email already exists. Please try logging in instead.');
                }
            } else {
                setError(signupResult.message || 'Google signup failed. Please try again.');
            }
        } catch (err) {
            setError('Network error during Google authentication. Please try again.');
            console.error('Google authentication error:', err);
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleGoogleSignup = () => {
        console.log("Google signup button clicked");
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
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        if (error) setError('');
        if (name === 'password') {
            calculatePasswordStrength(value);
        }
    };

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        setPasswordStrength(strength);
    };

    const getPasswordStrengthLabel = () => {
        switch (passwordStrength) {
            case 0:
            case 1: return { label: 'Weak', color: '#ef4444' };
            case 2:
            case 3: return { label: 'Medium', color: '#f97316' };
            case 4:
            case 5: return { label: 'Strong', color: '#22c55e' };
            default: return { label: 'Weak', color: '#ef4444' };
        }
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Full name is required');
            return false;
        }

        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        if (!formData.agreeToTerms) {
            setError('You must agree to the terms and conditions');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch('https://tedxcusat-backend.onrender.com/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                }),
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem('authToken', result.data.token);
                localStorage.setItem('user', JSON.stringify(result.data.user));

                onSignupSuccess(result.data.user);
                onClose();
            } else if (response.status === 409) {
                setError('An account with this email already exists. Please try logging in instead.');
            } else {
                setError(result.message || 'Signup failed. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please check your connection and try again.');
            console.error('Signup error:', err);
        } finally {
            setLoading(false);
        }
    };

    const strengthData = getPasswordStrengthLabel();
    const isAnyLoading = loading || googleLoading;

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal signup-modal" onClick={(e) => e.stopPropagation()}>
                <div className="auth-modal-header">
                    <h2>Join TEDxCUSAT</h2>
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
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your full name"
                            disabled={isAnyLoading}
                        />
                    </div>

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
                            placeholder="Create a strong password"
                            disabled={isAnyLoading}
                        />
                        {formData.password && (
                            <div className="password-strength">
                                <div className="strength-bar">
                                    <div
                                        className="strength-fill"
                                        style={{
                                            width: `${(passwordStrength / 5) * 100}%`,
                                            backgroundColor: strengthData.color
                                        }}
                                    ></div>
                                </div>
                                <span
                                    className="strength-label"
                                    style={{ color: strengthData.color }}
                                >
                                    {strengthData.label}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Confirm your password"
                            disabled={isAnyLoading}
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label className="checkbox-container">
                            <input
                                type="checkbox"
                                name="agreeToTerms"
                                checked={formData.agreeToTerms}
                                onChange={handleChange}
                                required
                                disabled={isAnyLoading}
                            />
                            <span className="checkmark"></span>
                            I agree to the{' '}
                            <a href="#terms" className="terms-link"> Terms & Conditions </a>
                            {' '} and {' '}
                            <a href="#privacy" className="terms-link"> Privacy Policy</a>
                        </label>
                    </div>

                    <button type="submit" className="auth-submit" disabled={isAnyLoading}>
                        {loading ? (
                            <span className="loading-spinner">
                                <span className="spinner"></span>
                                Creating account...
                            </span>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                <div className="auth-switch">
                    <p>
                        Already have an account?{' '}
                        <button
                            type="button"
                            className="auth-switch-btn"
                            onClick={onSwitchToLogin}
                            disabled={isAnyLoading}
                        >
                            Login
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
                        onClick={handleGoogleSignup}
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

export default Signup;