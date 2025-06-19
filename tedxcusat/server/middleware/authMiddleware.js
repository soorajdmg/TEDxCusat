const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../model/user');
const RefreshToken = require('../model/refreshToken');


const generateTokens = (userId) => {
    const accessToken = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    const refreshToken = RefreshToken.generateToken();

    return { accessToken, refreshToken };
};


const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select('-password');
        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token or user not found'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired',
                code: 'TOKEN_EXPIRED'
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};


const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions'
            });
        }

        next();
    };
};


const requireAdmin = (req, res, next) => {
    return requireRole('admin')(req, res, next);
};


const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};


const validateSignup = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes')
        .custom((value) => {

            const trimmed = value.replace(/\s+/g, ' ').trim();
            if (trimmed.length < 2) {
                throw new Error('Name must contain at least 2 non-space characters');
            }
            return true;
        }),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail()
        .isLength({ max: 255 })
        .withMessage('Email cannot exceed 255 characters')
        .custom(async (email) => {

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error('User already exists with this email');
            }
            return true;
        }),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6, max: 128 })
        .withMessage('Password must be between 6 and 128 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
        .custom((password) => {

            const commonPasswords = ['password', '123456', 'password123', 'admin123', 'qwerty'];
            if (commonPasswords.includes(password.toLowerCase())) {
                throw new Error('Password is too common. Please choose a stronger password');
            }
            return true;
        }),

    body('role')
        .optional()
        .isIn(['user', 'admin'])
        .withMessage('Role must be either user or admin'),

    handleValidationErrors
];


const validateLogin = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 1, max: 128 })
        .withMessage('Password cannot exceed 128 characters'),

    handleValidationErrors
];


const validatePasswordUpdate = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required')
        .isLength({ min: 1, max: 128 })
        .withMessage('Current password cannot exceed 128 characters'),

    body('newPassword')
        .notEmpty()
        .withMessage('New password is required')
        .isLength({ min: 6, max: 128 })
        .withMessage('New password must be between 6 and 128 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number')
        .custom((newPassword, { req }) => {

            if (newPassword === req.body.currentPassword) {
                throw new Error('New password must be different from current password');
            }


            const commonPasswords = ['password', '123456', 'password123', 'admin123', 'qwerty'];
            if (commonPasswords.includes(newPassword.toLowerCase())) {
                throw new Error('Password is too common. Please choose a stronger password');
            }
            return true;
        }),

    handleValidationErrors
];


const validateRefreshToken = [
    body('refreshToken')
        .notEmpty()
        .withMessage('Refresh token is required')
        .isLength({ min: 1, max: 500 })
        .withMessage('Invalid refresh token format'),

    handleValidationErrors
];


const validateProfileUpdate = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),

    body('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail()
        .isLength({ max: 255 })
        .withMessage('Email cannot exceed 255 characters')
        .custom(async (email, { req }) => {
            if (email) {

                const existingUser = await User.findOne({
                    email,
                    _id: { $ne: req.user._id }
                });
                if (existingUser) {
                    throw new Error('Email is already in use by another account');
                }
            }
            return true;
        }),

    handleValidationErrors
];


const authRateLimit = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000;
    const maxAttempts = 500;

    if (!req.app.locals.authAttempts) {
        req.app.locals.authAttempts = {};
    }

    const attempts = req.app.locals.authAttempts[ip] || [];
    const recentAttempts = attempts.filter(time => now - time < windowMs);

    if (recentAttempts.length >= maxAttempts) {
        return res.status(429).json({
            success: false,
            message: 'Too many authentication attempts. Please try again later',
            retryAfter: Math.ceil((windowMs - (now - Math.min(...recentAttempts))) / 1000)
        });
    }

    req.app.locals.authAttempts[ip] = [...recentAttempts, now];
    next();
};


const sanitizeUserData = (user) => {
    const userData = user.toObject ? user.toObject() : user;
    delete userData.password;
    delete userData.loginAttempts;
    delete userData.lockUntil;
    delete userData.__v;
    return userData;
};

module.exports = {
    generateTokens,
    verifyToken,
    requireRole,
    requireAdmin,
    validateSignup,
    validateLogin,
    validatePasswordUpdate,
    validateRefreshToken,
    validateProfileUpdate,
    authRateLimit,
    sanitizeUserData,
    handleValidationErrors
};