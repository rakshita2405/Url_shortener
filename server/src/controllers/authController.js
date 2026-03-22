import authService from '../services/authService.js';

const authController = {
  // Register new user
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Basic validation
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username, email, and password are required'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long'
        });
      }

      const result = await authService.register(username, email, password);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Registration failed'
      });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { identifier, password } = req.body;

      if (!identifier || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email/username and password are required'
        });
      }

      const result = await authService.login(identifier, password);

      res.json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({
        success: false,
        message: error.message || 'Login failed'
      });
    }
  },

  // Get current user profile
  getProfile: async (req, res) => {
    try {
      const user = await authService.getUserById(req.user.userId);

      res.json({
        success: true,
        data: {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            avatarUrl: user.avatarUrl || '',
            createdAt: user.createdAt
          }
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(404).json({
        success: false,
        message: error.message || 'User not found'
      });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const { username, email, avatarUrl, currentPassword, newPassword } = req.body;
      const updated = await authService.updateProfile(req.user.userId, {
        username,
        email,
        avatarUrl,
        currentPassword,
        newPassword
      });
      res.json({
        success: true,
        message: 'Profile updated',
        data: { user: updated }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Update failed'
      });
    }
  },

  deleteAccount: async (req, res) => {
    try {
      const { password } = req.body;
      if (!password) {
        return res.status(400).json({
          success: false,
          message: 'Password is required to delete your account'
        });
      }
      await authService.deleteAccount(req.user.userId, password);
      res.json({
        success: true,
        message: 'Account deleted'
      });
    } catch (error) {
      console.error('Delete account error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Could not delete account'
      });
    }
  }
};

export default authController;