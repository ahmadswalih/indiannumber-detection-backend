const express = require("express");
const router = express.Router();
const uploadController = require("../controller/upload");

// Define the route for video upload
router.post("/upload", uploadController.uploadVideo);

module.exports = router;
