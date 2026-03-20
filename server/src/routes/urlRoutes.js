import express from "express";
import {
  createShortUrl,
  redirectUrl,
  getAnalytics,
  getUserUrls
} from "../controllers/urlController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware.verifyToken, createShortUrl);

router.get("/analytics/:slug", authMiddleware.verifyToken, getAnalytics);

router.get("/me", authMiddleware.verifyToken, getUserUrls);

router.get("/:slug", redirectUrl);

export default router;