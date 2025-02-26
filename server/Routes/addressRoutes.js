// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const {
//   createAddress,
//   getAllAddresses,
//   getAddressByFilters,
//   updateAddress,
//   deleteAddress,
//   getImage,
//   getAllAddressesWithCategories,
//   getAllAddressesForTourType,
//   getAddressForPlaces,
//   getAllAddressesforAdminAddress
// } = require("../Controller/addressController");

// const router = express.Router();

// // Configure multer for file uploads
// const upload = multer({ dest: path.join(__dirname, "..", "temp") });

// // Routes with unique names
// router.post("/create-address", upload.array("images"), createAddress); // Create a new address
// router.get("/get-all-addresses", getAllAddresses); // Get all addresses
// router.get("/get-all-addresses-for-admin-page", getAllAddressesforAdminAddress); // Get all addresses
// router.get("/get-all-addresses-for-places", getAddressForPlaces); // Get all addresses
// router.get("/get-all-addresses-tour-type", getAllAddressesForTourType); // Get all addresses
// router.get("/get-addresses-by-filters", getAddressByFilters); // Get addresses filtered by query
// router.get("/get-addresses-with-packages", getAllAddressesWithCategories); // Get addresses with associated packages
// router.put("/update-address/:addressId", upload.array("images"), updateAddress); // Update an address by ID
// router.delete("/delete-address/:addressId", deleteAddress); // Delete an address by ID
// router.get("/get-image", getImage); // Serve an image by state name and file name

// module.exports = router;


const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary"); // Ensure this is correctly configured
const {
  createAddress,
  getAllAddresses,
  getAddressByFilters,
  updateAddress,
  deleteAddress,
  getImage,
  getAllAddressesWithCategories,
  getAllAddressesForTourType,
  getAddressForPlaces,
  getAllAddressesforAdminAddress,
} = require("../Controller/addressController");

const router = express.Router();

// Cloudinary Storage Setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: `addresses/${req.body.state || "default"}`, // Store images in state folders
      public_id: `${Date.now()}-${file.originalname}`,
      resource_type: "image",
    };
  },
});

const upload = multer({ storage });

// Routes with Cloudinary Upload
router.post("/create-address", upload.array("images"), createAddress);
router.put("/update-address/:addressId", upload.array("images"), updateAddress);

// Other Routes
router.get("/get-all-addresses", getAllAddresses);
router.get("/get-all-addresses-for-admin-page", getAllAddressesforAdminAddress);
router.get("/get-all-addresses-for-places", getAddressForPlaces);
router.get("/get-all-addresses-tour-type", getAllAddressesForTourType);
router.get("/get-addresses-by-filters", getAddressByFilters);
router.get("/get-addresses-with-packages", getAllAddressesWithCategories);
router.delete("/delete-address/:addressId", deleteAddress);
router.get("/get-image", getImage);

module.exports = router;

