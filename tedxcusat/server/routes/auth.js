const express = require('express');
const router = express.Router();


const {
    signup,
    login,
    googleLogin,
    googleSignup,
    refreshToken,
    logout,
    getProfile,
    changePassword
} = require('../controllers/authController');


const {
    verifyToken,
    requireAdmin,
    validateSignup,
    validateLogin,
    validatePasswordUpdate,
    validateRefreshToken,
    validateProfileUpdate,
    authRateLimit
} = require('../middleware/authMiddleware');


router.post('/signup',
    authRateLimit,
    validateSignup,
    signup
);

router.post('/login',
    authRateLimit,
    validateLogin,
    login
);


router.post('/google-login',
    authRateLimit,
    googleLogin
);

router.post('/google-signup',
    authRateLimit,
    googleSignup
);

router.post('/refresh-token',
    validateRefreshToken,
    refreshToken
);

router.post('/logout', logout);


router.get('/profile',
    verifyToken,
    getProfile
);

router.put('/change-password',
    verifyToken,
    validatePasswordUpdate,
    changePassword
);

router.put('/profile',
    verifyToken,
    validateProfileUpdate,
    getProfile
);


router.post('/admin/create-user',
    verifyToken,
    requireAdmin,
    validateSignup,
    signup
);

module.exports = router;