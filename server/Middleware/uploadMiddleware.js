// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Multer storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Sanitize package name
//     const packageName = req.body.name
//       .replace(/[<>:"/\\|?*\s]+/g, '-') // Replace invalid characters and spaces with hyphens
//       .toLowerCase();

//     // Define the package-specific folder
//     const packageDir = path.join(__dirname, `../uploads/packages/${packageName}`);

//     // Create the folder if it doesn't exist
//     fs.mkdirSync(packageDir, { recursive: true });

//     cb(null, packageDir); // Save files in the package-specific folder
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, `${uniqueSuffix}-${file.originalname}`); // Format filename with timestamp and original name
//   },
// });
// // File filter to allow only images
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true); // Accept image files
//   } else {
//     cb(new Error('Only image files are allowed!'), false); // Reject non-image files
//   }
// };
// // Multer instance
// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   // limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB per image
// });

// module.exports = upload;
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");

const UPLOADS_ROOT = path.join(__dirname, "..", "uploads", "addresses");

// Ensure the root directory exists
fs.ensureDirSync(UPLOADS_ROOT);

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const state = req.body.state || "default";
      const stateFolder = path.join(UPLOADS_ROOT, state.replace(/ /g, "_"));
      await fs.ensureDir(stateFolder);
      cb(null, stateFolder);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const newFileName = `${file.fieldname}-${timestamp}${path.extname(file.originalname)}`;
    cb(null, newFileName);
  },
});

const upload = multer({ storage });

module.exports = upload;
