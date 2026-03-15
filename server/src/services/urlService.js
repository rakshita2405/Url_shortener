import Url from "../models/Url.js";
import generateSlug from "../utils/generateSlug.js";
import generateQR from "../utils/qrGenerator.js";
import checkMalware from "../utils/malwareCheck.js";

export const createUrl = async (data) => {

  const { longUrl, password, expiresAt } = data;

  const malware = await checkMalware(longUrl);

  if (malware === "malicious") {
    throw new Error("Malicious URL detected");
  }

  const slug = await generateSlug(longUrl);

  const shortUrl = `${process.env.BASE_URL}/${slug}`;

  const qrCode = await generateQR(shortUrl);

  const url = await Url.create({
    longUrl,
    slug,
    shortUrl,
    expiresAt,
    qrCode,
    malwareStatus: malware
  });

  return url;
};

export const redirect = async (slug) => {

  const url = await Url.findOne({ slug });

  if (!url) throw new Error("URL not found");

  if (url.expiresAt && Date.now() > url.expiresAt) {
    throw new Error("Link expired");
  }

  url.clicks += 1;
  await url.save();

  return url.longUrl;
};

export const analytics = async (slug) => {

  const url = await Url.findOne({ slug });

  return {
    clicks: url.clicks,
    createdAt: url.createdAt
  };
};