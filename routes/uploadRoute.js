const express = require("express");
const router = express.Router();
const uploadController = require("../controller/upload");
const imageProcessingController = require("../controller/imageProcessingController");
// Define the route for video upload
router.post("/upload", uploadController.uploadVideo);
router.post("/upload-image", imageProcessingController.uploadImage);

module.exports = router;
