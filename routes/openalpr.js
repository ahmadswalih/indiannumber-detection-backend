const express = require("express");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

const secretKey = "sk_DEMODEMODEMODEMODEMODEMO";
const apiUrl = `https://api.openalpr.com/v3/recognize_bytes?recognize_vehicle=1&country=&secret_key=${secretKey}`;

router.post("/openalpr", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");

    const response = await axios.post(apiUrl, base64Image, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Delete the file after processing
    fs.unlinkSync(imagePath);

    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error processing image");
  }
});

module.exports = router;
