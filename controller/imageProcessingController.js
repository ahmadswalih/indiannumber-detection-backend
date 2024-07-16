const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const multer = require("multer");
const path = require("path");

// Sample user data for authentication
const userData = {
  DL3CBJ1384: {
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "123-456-7890",
  },
  // Add more user data as needed
};

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

// Controller for image upload and processing
exports.uploadImage = [
  upload.single("image"), // Middleware to handle file upload
  (req, res) => {
    if (!req.file) {
      return res.status(400).send("No image file uploaded.");
    }

    const imagePath = req.file.path;
    const verifiedNumbers = Object.keys(userData);

    const formData = new FormData();
    formData.append("upload", fs.createReadStream(imagePath), {
      filename: req.file.filename,
      contentType: req.file.mimetype,
    });

    const headers = {
      ...formData.getHeaders(),
    };

    axios
      .post("http://15.206.84.14:8080/v1/plate-reader/", formData, {
        headers,
      })
      .then((response) => {
        if (response.data.results && response.data.results.length > 0) {
          const results = response.data.results.map((plateResult) => {
            const plate = plateResult.plate.toUpperCase();
            const region = plateResult.region.code;
            const box = plateResult.box;
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

            return {
              plate: plate,
              score: plateResult.score,
              authentication: authenticationStatus,
              user: userAssociatedData,
              vehicleType: vehicleType,
              region: region,
              box: box,
            };
          });

          res.json(results);
        } else {
          res.status(404).send("No plate detected.");
        }
      })
      .catch((error) => {
        console.error("Error processing image:", error);
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
        res.status(500).send("Error processing image.");
      })
      .finally(() => {
        cleanUpFiles();
      });
  },
];

// Clean up temporary files
function cleanUpFiles() {
  const files = fs.readdirSync("uploads/");
  files.forEach((file) => {
    fs.unlinkSync(`uploads/${file}`);
  });
}
