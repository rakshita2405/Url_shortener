import express from "express";
import {
  createShortUrl,
  redirectUrl,
  getAnalytics
} from "../controllers/urlController.js";

const router = express.Router();

router.post("/create", createShortUrl);

router.get("/analytics/:slug", getAnalytics);

router.get("/:slug", redirectUrl);

export default router;