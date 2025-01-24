const express = require("express");
const Contact = require("../models/contact");

const router = express.Router();

// POST route to save contact form data
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res.status(201).json({ message: "Contact saved successfully." });
  } catch (error) {
    console.error("Error saving contact:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

module.exports = router;
