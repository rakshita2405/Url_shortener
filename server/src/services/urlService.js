import Url from "../models/Url.js";
import bcrypt from 'bcrypt';
import generateSlug from "../utils/generateSlug.js";
import generateQR from "../utils/qrGenerator.js";
import checkMalware from "../utils/malwareCheck.js";

export const createUrl = async (data) => {
  const { longUrl, password, expiresAt, userId, customSlug, redirectRules } = data;

  if (!userId) {
    throw new Error('Authenticated user is required to create URLs');
  }

  const malware = await checkMalware(longUrl);

  if (malware === 'malicious') {
    throw new Error('Malicious URL detected');
  }

  let slug;
  if (customSlug && typeof customSlug === 'string') {
    slug = customSlug.trim().toLowerCase();
    if (!slug.match(/^[a-zA-Z0-9-_]+$/)) {
      throw new Error('Custom slug can contain only letters, numbers, hyphens and underscores');
    }
    const existing = await Url.findOne({ slug });
    if (existing) {
      throw new Error('Custom slug already taken');
    }
  } else {
    slug = await generateSlug(longUrl);
  }

  const shortUrl = `${process.env.BASE_URL}/${slug}`;
  const qrCode = await generateQR(shortUrl);

  const urlData = {
    longUrl,
    slug,
    shortUrl,
    userId,
    expiresAt,
    qrCode,
    malwareStatus: malware,
    redirectRules: redirectRules || {}
  };

  if (password) {
    const saltRounds = 12;
    urlData.passwordHash = await bcrypt.hash(password, saltRounds);
  }

  const url = await Url.create(urlData);

  return url;
};

export const redirect = async (slug, req) => {
  const url = await Url.findOne({ slug });

  if (!url) throw new Error('URL not found');

  if (url.expiresAt && Date.now() > url.expiresAt) {
    throw new Error('Link expired');
  }

  // Password protection support
  if (url.passwordHash) {
    if (!req.query?.password) {
      const err = new Error('Password required to access this link');
      err.status = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(req.query.password, url.passwordHash);
    if (!isMatch) {
      const err = new Error('Invalid password');
      err.status = 403;
      throw err;
    }
  }

  // Smart device redirect rules
  const userAgent = (req.headers['user-agent'] || '').toLowerCase();
  let targetUrl = url.longUrl;

  if (url.redirectRules) {
    const { android, ios, desktop } = url.redirectRules;

    if (android && userAgent.includes('android')) targetUrl = android;
    else if (ios && (userAgent.includes('iphone') || userAgent.includes('ipad') || userAgent.includes('ipod'))) targetUrl = ios;
    else if (desktop && !userAgent.includes('android') && !userAgent.includes('iphone') && !userAgent.includes('ipad') && !userAgent.includes('ipod')) targetUrl = desktop;
  }

  url.clicks += 1;
  await url.save();

  return targetUrl;
};

export const analytics = async (slug, userId) => {
  const url = await Url.findOne({ slug, userId });

  if (!url) throw new Error('URL not found or not owned by user');

  return {
    clicks: url.clicks,
    createdAt: url.createdAt
  };
};

export const getUserUrls = async (userId) => {
  const urls = await Url.find({ userId }).sort({ createdAt: -1 });
  return urls;
};