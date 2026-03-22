import express from 'express';
import authController from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', authMiddleware.verifyToken, authController.getProfile);
router.patch('/profile', authMiddleware.verifyToken, authController.updateProfile);
router.delete('/account', authMiddleware.verifyToken, authController.deleteAccount);

export default router;