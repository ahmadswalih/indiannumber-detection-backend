const express = require("express");
const cors = require("cors");
const uploadRoute = require("./routes/uploadRoute");

const app = express();
const port = 4000 || process.env.PORT;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET", "PUT", "DELETE", "PATCH"],
  })
);
// Root route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Use the upload route
app.use("/", uploadRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
