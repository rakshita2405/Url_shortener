import jwt from 'jsonwebtoken';

const authMiddleware = {
  // Verify JWT token
  verifyToken: (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'Access token required'
        });
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

      req.user = decoded;
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  },

  // Optional authentication (doesn't fail if no token)
  optionalAuth: (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
      }

      next();
    } catch (error) {
      // Don't fail, just continue without user
      next();
    }
  }
};

export default authMiddleware;