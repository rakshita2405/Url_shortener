import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const authService = {
  register: async (username, email, password) => {
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      throw new Error('Email is already registered');
    }

    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      throw new Error('Username is already taken');
    }

    const passwordHash = await User.hashPassword(password);

    const user = await User.create({ username, email, passwordHash });

    const token = jwt.sign(
      { userId: user._id.toString(), username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      token
    };
  },

  login: async (identifier, password) => {
    // identifier is email or username
    const searchCondition = identifier.includes('@') ? { email: identifier.toLowerCase() } : { username: identifier };

    const user = await User.findOne(searchCondition);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const passwordMatches = await user.comparePassword(password);
    if (!passwordMatches) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user._id.toString(), username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      token
    };
  },

  getUserById: async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
};

export default authService;