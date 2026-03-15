import QRCode from "qrcode";

export default async function generateQR(url) {
  return await QRCode.toDataURL(url);
}