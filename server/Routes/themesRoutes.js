// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const {
//   createTheme,
//   getAllThemesWithTourPlans,
//   getThemeById,
//   updateTheme,
//   deleteTheme,
//   getThemeDetailsWithTourPlans,
//   getImage,
//   getAllThemes
// } = require("../Controller/themesController");

// const router = express.Router();

// // Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const tempDir = path.join(__dirname, "..", "temp");
//     cb(null, tempDir); // Save files temporarily in "temp" directory
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName); // Use timestamp + original name for unique file names
//   },
// });

// const upload = multer({ storage });

// // Define routes

// // Create a new theme with file upload
// router.post(
//   "/create-theme",
//   upload.array("themeImage", 10), // Limit to 10 images per request
//   createTheme
// );

// // Retrieve all themes with associated tour plans
// router.get("/get-all-themes-by-tour-plan", getAllThemesWithTourPlans);

// // Retrieve a single theme by ID
// router.get("/get-theme/:themeId", getThemeById);

// router.get("/get-all-themes", getAllThemes);

// // Update an existing theme with optional file upload
// router.put(
//   "/update-theme/:themeId",
//   upload.array("themeImage", 10), // Limit to 10 images per request
//   updateTheme
// );

// // Retrieve theme details and associated tour plans by theme name
// router.get("/themes/:themename", getThemeDetailsWithTourPlans);

// // Delete a theme by ID
// router.delete("/delete-theme/:themeId", deleteTheme);

// // Serve an image by theme name and file name
// router.get("/get-image", getImage);

// module.exports = router;


const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");
const {
  createTheme,
  getAllThemesWithTourPlans,
  getThemeById,
  updateTheme,
  deleteTheme,
  getThemeDetailsWithTourPlans,
  getAllThemes,
} = require("../Controller/themesController");

const router = express.Router();

// Cloudinary storage configuration for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: `themes/${req.body.name || "default"}`, // Dynamic Cloudinary folder
      public_id: `${Date.now()}-${file.originalname}`,
      resource_type: "image",
    };
  },
});

const upload = multer({ storage });

// **Routes for themes**
router.post("/create-theme", upload.array("themeImage", 10), createTheme);
router.get("/get-all-themes-by-tour-plan", getAllThemesWithTourPlans);
router.get("/get-theme/:themeId", getThemeById);
router.get("/get-all-themes", getAllThemes);
router.put("/update-theme/:themeId", upload.array("themeImage", 10), updateTheme);
router.get("/themes/:themename", getThemeDetailsWithTourPlans);
router.delete("/delete-theme/:themeId", deleteTheme);

module.exports = router;
