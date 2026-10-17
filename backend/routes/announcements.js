const express = require("express");
const mongoose = require("mongoose");
const Announcement = require("../models/Announcement");
const requireAdmin = require("../middleware/auth");

const router = express.Router();

let inMemoryAnnouncements = [
  {
    _id: "ann_1",
    title: "AI-AURA 2026 Registration Open",
    message: "Welcome to AI-AURA! Registrations are open for all PUC students across Karnataka & neighboring colleges.",
    category: "important",
    date: "2026-11-06",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: "ann_2",
    title: "Spot Registrations & Timing",
    message: "All events kick off at 09:30 AM sharp. Participants should report to the registration desk with their college ID card.",
    category: "general",
    date: "2026-11-06",
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    _id: "ann_3",
    title: "Cash Prizes & Merit Certificates",
    message: "Exciting trophies, cash awards, and certificates of excellence for winners and runners-up in each category!",
    category: "date",
    date: "2026-11-06",
    createdAt: new Date(Date.now() - 21600000).toISOString(),
  },
];

const pick = (body = {}) => ({
  title: body.title,
  message: body.message,
  category: body.category || "general",
  date: body.date || "",
});

function handleError(res, error) {
  console.error("Announcement error:", error);
  if (error.name === "ValidationError") {
    const first = Object.values(error.errors)[0];
    return res.status(400).json({ success: false, message: first.message });
  }
  return res
    .status(500)
    .json({ success: false, message: "Server error. Please try again." });
}

// GET /api/announcements (public)
router.get("/", async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const rows = await Announcement.find().sort({ createdAt: -1 });
        return res.json(rows);
      } catch (dbErr) {
        console.warn("DB announcements fetch failed, falling back:", dbErr.message);
      }
    }
    res.json(inMemoryAnnouncements);
  } catch (error) {
    handleError(res, error);
  }
});

// POST /api/announcements (admin)
router.post("/", requireAdmin, async (req, res) => {
  try {
    const data = pick(req.body);
    if (!data.title || !data.message) {
      return res.status(400).json({ success: false, message: "Title and message are required." });
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const created = await Announcement.create(data);
        return res.status(201).json(created);
      } catch (dbErr) {
        console.warn("DB announcement create failed, falling back:", dbErr.message);
      }
    }

    const created = {
      _id: "ann_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
      ...data,
      createdAt: new Date().toISOString(),
    };
    inMemoryAnnouncements.unshift(created);
    res.status(201).json(created);
  } catch (error) {
    handleError(res, error);
  }
});

// PUT /api/announcements/:id (admin)
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const data = pick(req.body);

    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      try {
        const updated = await Announcement.findByIdAndUpdate(id, data, {
          new: true,
          runValidators: true,
        });
        if (updated) return res.json(updated);
      } catch (dbErr) {
        console.warn("DB announcement update failed, falling back:", dbErr.message);
      }
    }

    const idx = inMemoryAnnouncements.findIndex((a) => String(a._id) === String(id));
    if (idx === -1) {
      return res.status(404).json({ success: false, message: "Announcement not found." });
    }
    inMemoryAnnouncements[idx] = {
      ...inMemoryAnnouncements[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    res.json(inMemoryAnnouncements[idx]);
  } catch (error) {
    handleError(res, error);
  }
});

// DELETE /api/announcements/:id (admin)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      try {
        const removed = await Announcement.findByIdAndDelete(id);
        if (removed) return res.json({ success: true });
      } catch (dbErr) {
        console.warn("DB announcement delete failed, falling back:", dbErr.message);
      }
    }

    const prevLen = inMemoryAnnouncements.length;
    inMemoryAnnouncements = inMemoryAnnouncements.filter((a) => String(a._id) !== String(id));
    if (inMemoryAnnouncements.length === prevLen) {
      return res.status(404).json({ success: false, message: "Announcement not found." });
    }
    res.json({ success: true });
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;
