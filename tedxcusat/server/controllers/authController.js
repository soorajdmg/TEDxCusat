const User = require('../model/user');
const RefreshToken = require('../model/refreshToken');
const { generateTokens } = require('../middleware/authMiddleware');
const { OAuth2Client } = require('google-auth-library');


const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const verifyGoogleToken = async (credential) => {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
  } catch (error) {
    console.error('Google token verification failed:', error);
    throw new Error('Invalid Google token');
  }
};


const createOrUpdateGoogleUser = async (googleUser, isSignup = false) => {
  const { sub: googleId, email, name, picture } = googleUser;


  let user = await User.findOne({ email });

  if (user) {

    if (!user.googleId) {
      user.googleId = googleId;
      user.avatar = picture;
      await user.save();
    }


    if (isSignup) {
      throw new Error('User already exists with this email');
    }
  } else {

    user = new User({
      name,
      email,
      googleId,
      avatar: picture,
      isEmailVerified: true,
      authProvider: 'google'
    });
    await user.save();
  }

  return user;
};


const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required'
      });
    }


    const googleUser = await verifyGoogleToken(credential);


    const user = await createOrUpdateGoogleUser(googleUser, false);


    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive'
      });
    }


    user.lastLogin = new Date();
    await user.save();


    const { accessToken, refreshToken } = generateTokens(user._id);


    const refreshTokenDoc = new RefreshToken({
      token: refreshToken,
      userId: user._id,
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip
    });
    await refreshTokenDoc.save();


    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      avatar: user.avatar,
      authProvider: user.authProvider,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLogin: user.lastLogin
    };

    res.json({
      success: true,
      message: 'Google login successful',
      data: {
        user: userResponse,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Google login failed'
    });
  }
};


const googleSignup = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required'
      });
    }


    const googleUser = await verifyGoogleToken(credential);


    const user = await createOrUpdateGoogleUser(googleUser, true);


    const { accessToken, refreshToken } = generateTokens(user._id);


    const refreshTokenDoc = new RefreshToken({
      token: refreshToken,
      userId: user._id,
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip
    });
    await refreshTokenDoc.save();


    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      avatar: user.avatar,
      authProvider: user.authProvider,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(201).json({
      success: true,
      message: 'Google signup successful',
      data: {
        user: userResponse,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Google signup error:', error);


    if (error.message === 'User already exists with this email') {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists. Please use login instead.'
      });
    }

    res.status(400).json({
      success: false,
      message: error.message || 'Google signup failed'
    });
  }
};


const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }


    const userData = { name, email, password, authProvider: 'local' };
    if (role === 'admin') {

      if (!req.user || req.user.role !== 'admin') {
        userData.role = 'user';
      } else {
        userData.role = 'admin';
      }
    }

    const user = new User(userData);
    await user.save();


    const { accessToken, refreshToken } = generateTokens(user._id);


    const refreshTokenDoc = new RefreshToken({
      token: refreshToken,
      userId: user._id,
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip
    });
    await refreshTokenDoc.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          authProvider: user.authProvider,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;


    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }


    if (user.authProvider === 'google' && !user.password) {
      return res.status(401).json({
        success: false,
        message: 'This account was created with Google. Please use Google login.'
      });
    }


    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account temporarily locked due to too many failed attempts'
      });
    }


    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      await user.incLoginAttempts();
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }


    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }


    user.lastLogin = new Date();
    await user.save();


    const { accessToken, refreshToken } = generateTokens(user._id);


    const refreshTokenDoc = new RefreshToken({
      token: refreshToken,
      userId: user._id,
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip
    });
    await refreshTokenDoc.save();


    user.password = undefined;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};


const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token required'
      });
    }


    const tokenDoc = await RefreshToken.findOne({ token: refreshToken }).populate('userId');

    if (!tokenDoc || !tokenDoc.isValid()) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }


    if (!tokenDoc.userId.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is inactive'
      });
    }


    const { accessToken, refreshToken: newRefreshToken } = generateTokens(tokenDoc.userId._id);


    tokenDoc.isRevoked = true;
    await tokenDoc.save();

    const newRefreshTokenDoc = new RefreshToken({
      token: newRefreshToken,
      userId: tokenDoc.userId._id,
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip
    });
    await newRefreshTokenDoc.save();

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Token refresh failed'
    });
  }
};


const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {

      await RefreshToken.updateOne(
        { token: refreshToken },
        { isRevoked: true }
      );
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};


const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: { user: req.user }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  }
};


const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;


    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }


    if (user.authProvider === 'google' && !user.password) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change password for Google-authenticated accounts'
      });
    }


    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }


    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
};

module.exports = {
  signup,
  login,
  googleLogin,
  googleSignup,
  refreshToken,
  logout,
  getProfile,
  changePassword
};