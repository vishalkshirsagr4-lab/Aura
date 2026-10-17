const express = require("express");
const mongoose = require("mongoose");
const Setting = require("../models/Setting");
const requireAdmin = require("../middleware/auth");

const router = express.Router();

const REQUIRED = ["eventDate", "startTime", "endTime", "venue"];
const SOCIAL = ["instagram", "youtube", "facebook", "linkedin", "website"];

let inMemorySettings = {
  key: "main",
  eventDate: "2026-11-06",
  startTime: "09:30",
  endTime: "17:00",
  venue: "KLE BCA & BBA College Auditorium, Mahalingpur",
  instagram: "https://instagram.com",
  youtube: "https://youtube.com",
  facebook: "https://facebook.com",
  linkedin: "https://linkedin.com",
  website: "https://klecollege.edu",
};

// What the public can read: only fields that have a value
const publicView = (doc = {}) =>
  [...REQUIRED, ...SOCIAL].reduce((out, f) => {
    if (doc[f]) out[f] = doc[f];
    return out;
  }, {});

// What the admin can write: event fields must be non-empty,
// social links may be cleared by sending an empty string
const writable = (body = {}) => {
  const out = {};
  REQUIRED.forEach((f) => {
    if (typeof body[f] === "string" && body[f].trim()) out[f] = body[f].trim();
  });
  SOCIAL.forEach((f) => {
    if (typeof body[f] === "string") out[f] = body[f].trim();
  });
  return out;
};

// GET /api/settings (public — the student portal reads these)
router.get("/", async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const doc = await Setting.findOne({ key: "main" }).lean();
        if (doc) return res.json(publicView(doc));
      } catch (dbErr) {
        console.warn("DB settings get failed, falling back:", dbErr.message);
      }
    }
    res.json(publicView(inMemorySettings));
  } catch (error) {
    console.error("Settings error:", error);
    res.status(500).json({ success: false, message: "Could not load settings." });
  }
});

// PUT /api/settings (admin)
router.put("/", requireAdmin, async (req, res) => {
  try {
    const changes = writable(req.body);
    if (mongoose.connection.readyState === 1) {
      try {
        const doc = await Setting.findOneAndUpdate(
          { key: "main" },
          { $set: changes },
          { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        ).lean();
        return res.json(publicView(doc));
      } catch (dbErr) {
        if (dbErr.name === "ValidationError") {
          const first = Object.values(dbErr.errors)[0];
          return res.status(400).json({ success: false, message: first.message });
        }
        console.warn("DB settings save failed, falling back:", dbErr.message);
      }
    }

    inMemorySettings = {
      ...inMemorySettings,
      ...changes,
    };
    res.json(publicView(inMemorySettings));
  } catch (error) {
    console.error("Settings error:", error);
    res.status(500).json({ success: false, message: "Could not save settings." });
  }
});

module.exports = router;
