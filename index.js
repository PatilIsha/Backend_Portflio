const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    // Start the server only after connecting to MongoDB
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Contact = mongoose.model("Contact", contactSchema);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the API! Your backend is working fine.");
});

// Route to handle form submission
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Please fill all the fields." });
    }

    // Save to MongoDB
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // Send success response
    res.status(201).json({ message: "Message received. Thank you for contacting us!" });
  } catch (error) {
    console.error("Error saving contact:", error.message);
    res.status(500).json({ error: "Internal server error. Please try again later." });
  }
});
