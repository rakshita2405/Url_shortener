import * as urlService from "../services/urlService.js";

export const createShortUrl = async (req, res, next) => {
  try {
    const data = await urlService.createUrl(req.body);

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
    next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const data = await urlService.analytics(req.params.slug);

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};