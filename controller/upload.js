const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const axios = require("axios");
const FormData = require("form-data");

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Store uploaded files in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Sample user data for authentication
const userData = {
  DL3CBJ1384: {
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "123-456-7890",
  },
  // Add more user data as needed
};

// Controller for video upload and processing
exports.uploadVideo = [
  upload.single("video"), // Middleware to handle file upload
  (req, res) => {
    if (!req.file) {
      return res.status(400).send("No video file uploaded.");
    }

    const videoPath = req.file.path;
    const duration = parseInt(req.body.duration, 10) || 10;

    // Get video metadata
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        console.error("Error getting video metadata:", err);
        return res.status(500).send("Error getting video metadata.");
      }

      const videoDuration = metadata.format.duration;
      const frameCount = Math.min(duration, videoDuration);
      const width = metadata.streams[0].width;
      const height = metadata.streams[0].height;

      // Extract frames from the video
      ffmpeg(videoPath)
        .on("end", function () {
          console.log("Frames extraction completed.");
          processFrames(res);
        })
        .on("error", function (err) {
          console.error("Error extracting frames:", err);
          res.status(500).send("Error extracting frames.");
        })
        .screenshots({
          count: frameCount,
          folder: "uploads/",
          filename: "frame-at-%s-seconds.png",
          size: `${width}x${height}`,
        });
    });
  },
];

// Process extracted frames
function processFrames(res) {
  const frames = fs
    .readdirSync("uploads/")
    .filter((file) => file.startsWith("frame-"));
  const promises = [];
  const verifiedNumbers = Object.keys(userData);

  // Send each frame to the plate reader API
  frames.forEach((frame) => {
    const framePath = `uploads/${frame}`;
    console.log(`Processing frame: ${framePath}`);

    const formData = new FormData();
    formData.append("upload", fs.createReadStream(framePath), {
      filename: frame,
      contentType: "image/png",
    });

    const headers = {
      ...formData.getHeaders(),
    };

    promises.push(
      axios.post("http://localhost:8080/v1/plate-reader/", formData, {
        headers,
      })
    );
  });

  // Process all API responses
  Promise.all(promises)
    .then((responses) => {
      const uniqueResults = new Map();

      responses.forEach((response) => {
        if (response.data.results && response.data.results.length > 0) {
          response.data.results.forEach((plateResult) => {
            const plate = plateResult.plate.toUpperCase();

            const vehicleType = plateResult.vehicle
              ? plateResult.vehicle.type
              : null;
            let authenticationStatus = "New Visitor";
            let userAssociatedData = null;

            // Check if the plate number is verified
            if (verifiedNumbers.includes(plate)) {
              authenticationStatus = "Verified";
              userAssociatedData = userData[plate];
            }

            // Store the result with the highest confidence score
            if (
              !uniqueResults.has(plate) ||
              plateResult.score > uniqueResults.get(plate).score
            ) {
              uniqueResults.set(plate, {
                plate: plate,
                score: plateResult.score,
                authentication: authenticationStatus,
                user: userAssociatedData,
                vehicleType: vehicleType,
              });
            }
          });
        }
      });

      const results = Array.from(uniqueResults.values());
      res.json(results);
      cleanUpFiles();
    })
    .catch((error) => {
      console.error("Error processing frames:", error);
      // Log detailed error information
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
      res.status(500).send("Error processing frames.");
      cleanUpFiles();
    });
}

// Clean up temporary files
function cleanUpFiles() {
  const files = fs.readdirSync("uploads/");
  files.forEach((file) => {
    fs.unlinkSync(`uploads/${file}`);
  });
}
