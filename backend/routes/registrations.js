const express = require("express");
const mongoose = require("mongoose");
const Registration = require("../models/Registration");
const requireAdmin = require("../middleware/auth");

const router = express.Router();

let inMemoryRegistrations = [
  {
    _id: "mock_reg_1",
    fullname: "Rahul Sharma",
    email: "rahul.s@example.com",
    college: "KLE Mahalingpur",
    phone: "9876543210",
    event: "QUIZ (GENERAL & IT)",
    pucRoll: "PUC-2026-101",
    teamName: "Alpha Brains",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: "mock_reg_2",
    fullname: "Pooja Patil",
    email: "pooja.p@example.com",
    college: "Govt PU College",
    phone: "9876543211",
    event: "AI QUIZ",
    pucRoll: "PUC-2026-102",
    teamName: "",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    _id: "mock_reg_3",
    fullname: "Amit Kulkarni",
    email: "amit.k@example.com",
    college: "Basaveshwar PU College",
    phone: "9876543212",
    event: "AI POSTER MAKING",
    pucRoll: "PUC-2026-103",
    teamName: "Pixel Pioneers",
    createdAt: new Date(Date.now() - 600000).toISOString(),
  },
];

// POST /api/registrations (public — students register)
router.post("/", async (req, res) => {
  try {
    const { fullname, email, college, phone, event, pucRoll, teamName } =
      req.body || {};

    const required = { fullname, email, college, phone, event, pucRoll };
    const allPresent = Object.values(required).every(
      (v) => typeof v === "string" && v.trim() !== ""
    );
    if (!allPresent) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    if (!/^\d{10}$/.test(phone.trim())) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be exactly 10 digits.",
      });
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const registration = new Registration({
          ...required,
          teamName: typeof teamName === "string" ? teamName : "",
        });
        const saved = await registration.save();
        return res.status(201).json({
          success: true,
          message: "Registration successful!",
          data: saved,
        });
      } catch (dbErr) {
        if (dbErr.name === "ValidationError") {
          const first = Object.values(dbErr.errors)[0];
          return res.status(400).json({ success: false, message: first.message });
        }
        console.warn("DB save failed, falling back to in-memory:", dbErr.message);
      }
    }

    const doc = {
      _id: "reg_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
      fullname: fullname.trim(),
      email: email.trim().toLowerCase(),
      college: college.trim(),
      phone: phone.trim(),
      event: event.trim(),
      pucRoll: pucRoll.trim(),
      teamName: typeof teamName === "string" ? teamName.trim() : "",
      createdAt: new Date().toISOString(),
    };
    inMemoryRegistrations.unshift(doc);

    return res.status(201).json({
      success: true,
      message: "Registration successful!",
      data: doc,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while saving registration.",
    });
  }
});

// GET /api/registrations/recent (public)
router.get("/recent", async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const rows = await Registration.find({}, "fullname college event createdAt")
          .sort({ createdAt: -1 })
          .limit(10)
          .lean();
        return res.json(
          rows.map((r) => ({
            firstName: String(r.fullname || "").trim().split(/\s+/)[0],
            college: r.college,
            event: r.event,
            createdAt: r.createdAt,
          }))
        );
      } catch (dbErr) {
        console.warn("DB find failed, falling back to in-memory:", dbErr.message);
      }
    }

    const recent = inMemoryRegistrations.slice(0, 10).map((r) => ({
      firstName: String(r.fullname || "").trim().split(/\s+/)[0],
      college: r.college,
      event: r.event,
      createdAt: r.createdAt,
    }));
    res.json(recent);
  } catch (error) {
    console.error("Recent error:", error);
    res.status(500).json({ success: false, message: "Could not load recent registrations." });
  }
});

// GET /api/registrations (admin only)
router.get("/", requireAdmin, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const registrations = await Registration.find().sort({ createdAt: -1 });
        return res.json(registrations);
      } catch (dbErr) {
        console.warn("DB find failed, falling back to in-memory:", dbErr.message);
      }
    }
    res.json(inMemoryRegistrations);
  } catch (error) {
    console.error("Fetch error:", error);
    res
      .status(500)
      .json({ success: false, message: "Could not fetch registrations." });
  }
});

// DELETE /api/registrations/:id (admin only)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      try {
        const removed = await Registration.findByIdAndDelete(id);
        if (removed) {
          return res.json({ success: true, message: "Registration deleted." });
        }
      } catch (dbErr) {
        console.warn("DB delete failed, falling back to in-memory:", dbErr.message);
      }
    }

    const prevLen = inMemoryRegistrations.length;
    inMemoryRegistrations = inMemoryRegistrations.filter((r) => String(r._id) !== String(id));
    if (inMemoryRegistrations.length === prevLen) {
      return res
        .status(404)
        .json({ success: false, message: "Registration not found." });
    }
    res.json({ success: true, message: "Registration deleted." });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, message: "Could not delete." });
  }
});

module.exports = router;
