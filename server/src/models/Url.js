import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
{
  longUrl: {
    type: String,
    required: true
  },

  slug: {
    type: String,
    unique: true,
    required: true,
    index: true
  },

  shortUrl: String,

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  passwordHash: String,

  clicks: {
    type: Number,
    default: 0
  },

  expiresAt: Date,

  qrCode: String,

  malwareStatus: {
    type: String,
    enum: ["safe", "malicious", "unknown"],
    default: "unknown"
  },

  redirectRules: {
    android: String,
    ios: String,
    desktop: String
  }
},
{ timestamps: true }
);

export default mongoose.model("Url", urlSchema);