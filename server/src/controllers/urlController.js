import * as urlService from "../services/urlService.js";

export const createShortUrl = async (req, res, next) => {
  try {
    const userId = req.user?.userId;

    const data = await urlService.createUrl({
      ...req.body,
      userId
    });

    return res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

export const redirectUrl = async (req, res, next) => {
  try {
    const redirectUrl = await urlService.redirect(req.params.slug, req);
    return res.redirect(redirectUrl);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user?.userId;

    const data = await urlService.analytics(req.params.slug, userId);

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

export const getUserUrls = async (req, res, next) => {
  try {
    const userId = req.user?.userId;

    const urls = await urlService.getUserUrls(userId);

    return res.status(200).json({
      success: true,
      data: urls
    });
  } catch (error) {
    next(error);
  }
};