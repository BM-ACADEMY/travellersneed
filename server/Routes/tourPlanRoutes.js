// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const {
//   createTourPlan,
//   getAllTourPlans,
//   getTourPlanById,
//   getTourPlanByTourCode,
//   getTourPlansByState,
//   updateTourPlan,
//   deleteTourPlan,
//   getTourPlanImage,
//   getItineraryByTourCode,
//   getAllTourPlansForSearch,
//   getTourPlanByStateSearch,
//   getReviewsByState,
//   getTourPlansByCity
 
// } = require("../Controller/tourPlanController");
// const router = express.Router();
// // Configure multer for file uploads
// const upload = multer({ dest: path.join(__dirname, "..", "temp") }); // Temporary folder for uploads
// // Routes
// router.post("/create-tour-plan", upload.array("images"), createTourPlan); // Create a tour plan
// router.get("/get-all-tour-plans", getAllTourPlans); // Retrieve all tour plans
// router.get("/get-all-tour-plans-for-search", getAllTourPlansForSearch); // Retrieve all tour plans
// router.get("/get-all-tour-plans-for-search-by-state/:stateName", getTourPlanByStateSearch); // Retrieve all tour plans
// router.get("/get-all-tour-plan-reviews-by-state/:stateName", getReviewsByState); // Retrieve all tour plans
// router.get("/tour-plans/tour-packages/:stateName", getTourPlansByState);
// router.get("/get-all-tour-plans-for-search-by-city", getTourPlansByCity);


// router.get("/get-tour-plan/:tourPlanId", getTourPlanById); // Retrieve a tour plan by ID
// router.put("/update-tour-plan/:tourPlanId", upload.array("images"), updateTourPlan); // Update a tour plan
// router.get("/tour-plans/tour-code/:tourCode", getTourPlanByTourCode);
// router.get("/itinerary/tour-code/:tourCode", getItineraryByTourCode);
// router.delete("/delete-tour-plan/:tourPlanId", deleteTourPlan); // Delete a tour plan
// router.get("/get-tour-plan-image", getTourPlanImage); // Serve a tour plan image

// module.exports = router;




const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary"); // Cloudinary configuration
const {
  createTourPlan,
  getAllTourPlans,
  getTourPlanById,
  getTourPlanByTourCode,
  getTourPlansByState,
  updateTourPlan,
  deleteTourPlan,
  getTourPlanImage,
  getItineraryByTourCode,
  getAllTourPlansForSearch,
  getTourPlanByStateSearch,
  getReviewsByState,
  getTourPlansByCity
} = require("../Controller/tourPlanController");

const router = express.Router();

// Cloudinary Storage Setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: `tourPlans/${req.body.tourCode || "default"}`, // Store images in tourCode folders
      public_id: `${Date.now()}-${file.originalname}`,
      resource_type: "image",
    };
  },
});

const upload = multer({ storage });

// Routes with Cloudinary Upload
router.post("/create-tour-plan", upload.array("images"), createTourPlan);
router.put("/update-tour-plan/:tourPlanId", upload.array("images"), updateTourPlan);

// Other Routes
router.get("/get-all-tour-plans", getAllTourPlans);
router.get("/get-all-tour-plans-for-search", getAllTourPlansForSearch);
router.get("/get-all-tour-plans-for-search-by-state/:stateName", getTourPlanByStateSearch);
router.get("/get-all-tour-plan-reviews-by-state/:stateName", getReviewsByState);
router.get("/tour-plans/tour-packages/:stateName", getTourPlansByState);
router.get("/get-all-tour-plans-for-search-by-city", getTourPlansByCity);
router.get("/get-tour-plan/:tourPlanId", getTourPlanById);
router.get("/tour-plans/tour-code/:tourCode", getTourPlanByTourCode);
router.get("/itinerary/tour-code/:tourCode", getItineraryByTourCode);
router.delete("/delete-tour-plan/:tourPlanId", deleteTourPlan);
router.get("/get-tour-plan-image", getTourPlanImage);

module.exports = router;

