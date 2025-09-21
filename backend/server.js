const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");
const FormData = require("form-data");
const sharp = require("sharp"); // for PNG conversion and RGBA
require("dotenv").config();

const app = express();
const PORT = 5000;

// Allow frontend requests
app.use(cors({ origin: "http://localhost:8080" }));
app.use(express.json());

// --- MongoDB Connection ---
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// --- MongoDB Schema ---
const imageSchema = new mongoose.Schema({
  name: String,
  img: {
    data: Buffer,
    contentType: String,
  },
  preview: String,
});
const Image = mongoose.model("Image", imageSchema);

// --- Multer Setup ---
const storage = multer.memoryStorage();
const upload = multer({ storage });

// --- Upload Route ---
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Convert to PNG RGBA to satisfy OpenAI requirements
    const pngBuffer = await sharp(req.file.buffer)
      .png()
      .ensureAlpha()
      .toBuffer();

    const newImage = new Image({
      name: req.file.originalname,
      img: { data: pngBuffer, contentType: "image/png" },
      preview: `data:image/png;base64,${pngBuffer.toString("base64")}`,
    });

    const savedImage = await newImage.save();
    console.log("Image uploaded:", savedImage._id);

    res.json({ message: "Image uploaded to MongoDB!", id: savedImage._id });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

// --- Beautify Route ---
app.post("/beautify/:id", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ error: "Image not found" });

    console.log(`Beautifying image: ${image.name} (${image._id})`);

    const prompt =
      "Enhance colors, brightness, contrast, sharpen product details, remove shadows, make background pure white, professional e-commerce product photo";

    // Convert image to PNG RGBA before sending
    const pngBuffer = await sharp(image.img.data)
      .png()
      .ensureAlpha()
      .toBuffer();

    const form = new FormData();
    form.append("image", pngBuffer, {
      filename: image.name.replace(/\..+$/, ".png"),
      contentType: "image/png",
    });
    form.append("prompt", prompt);
    form.append("n", "1"); // Only one image to save cost
    form.append("size", "1024x1024");
    form.append("response_format", "b64_json");

    console.log("Sending request to OpenAI...");

    const response = await axios.post(
      "https://api.openai.com/v1/images/edits",
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        timeout: 60000,
      }
    );

    if (!response.data.data || response.data.data.length === 0) {
      return res.status(500).json({ error: "No images returned from OpenAI" });
    }

    const item = response.data.data[0];
    if (!item.b64_json)
      return res.status(500).json({ error: "Invalid image from OpenAI" });

    const buffer = Buffer.from(item.b64_json, "base64");
    const beautifiedImage = new Image({
      name: `beautified_${Date.now()}.png`,
      img: { data: buffer, contentType: "image/png" },
      preview: `data:image/png;base64,${item.b64_json}`,
    });

    const saved = await beautifiedImage.save();
    console.log("Beautification completed. Image saved:", saved._id);

    res.json({
      message: "Beautified image generated",
      imageId: saved._id,
      image: saved.preview,
    });
  } catch (error) {
    console.error(
      "Beautify failed:",
      error.response?.data || error.message || error
    );
    res.status(500).json({
      error: "Beautify failed",
      details: error.response?.data || error.message,
    });
  }
});

// --- Start Server ---
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
