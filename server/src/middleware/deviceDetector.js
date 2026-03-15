import UAParser from "ua-parser-js";

export default function detectDevice(req, res, next) {

  const parser = new UAParser(req.headers["user-agent"]);

  req.device = parser.getDevice().type || "desktop";

  next();
}