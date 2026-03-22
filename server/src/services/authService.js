import User from '../models/User.js';
import Url from '../models/Url.js';
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
        email: user.email,
        avatarUrl: user.avatarUrl || ''
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
        email: user.email,
        avatarUrl: user.avatarUrl || ''
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
  },

  updateProfile: async (userId, { username, email, avatarUrl, currentPassword, newPassword }) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (newPassword) {
      if (!currentPassword) {
        throw new Error('Current password is required to set a new password');
      }
      const matches = await user.comparePassword(currentPassword);
      if (!matches) {
        throw new Error('Current password is incorrect');
      }
      if (newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters long');
      }
      user.passwordHash = await User.hashPassword(newPassword);
    }

    if (username !== undefined && username.trim() !== user.username) {
      const taken = await User.findOne({ username: username.trim(), _id: { $ne: userId } });
      if (taken) {
        throw new Error('Username is already taken');
      }
      user.username = username.trim();
    }

    if (email !== undefined) {
      const lower = email.toLowerCase().trim();
      if (lower !== user.email) {
        const taken = await User.findOne({ email: lower, _id: { $ne: userId } });
        if (taken) {
          throw new Error('Email is already registered');
        }
        user.email = lower;
      }
    }

    if (avatarUrl !== undefined) {
      if (typeof avatarUrl !== 'string') {
        throw new Error('Invalid avatar data');
      }
      if (avatarUrl.length > 500000) {
        throw new Error('Avatar image is too large');
      }
      user.avatarUrl = avatarUrl;
    }

    await user.save();

    return {
      id: user._id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl || '',
      createdAt: user.createdAt
    };
  },

  deleteAccount: async (userId, password) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const matches = await user.comparePassword(password);
    if (!matches) {
      throw new Error('Password is incorrect');
    }
    await Url.deleteMany({ userId: user._id });
    await User.deleteOne({ _id: userId });
  }
};

export default authService;