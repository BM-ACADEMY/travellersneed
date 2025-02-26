const Address = require("../Models/addressModel");
const fs = require("fs-extra");
const path = require("path");
const TourPlan = require("../Models/tourPlanModel");
const cloudinary = require("../utils/cloudinary");
const UPLOADS_ROOT = path.join(__dirname, "..", "uploads", "addresses");

// // Helper function: Create a dynamic folder structure for state
// const createDynamicFolder = async (state) => {
//   const stateFolder = path.join(UPLOADS_ROOT, state.replace(/ /g, "_"));
//   await fs.ensureDir(stateFolder);
//   return stateFolder;
// };



// const UPLOADS_ROOT = path.join(__dirname, "..", "uploads", "addresses");

// // Ensure the root directory exists
// fs.ensureDirSync(UPLOADS_ROOT);

// // Multer Storage Configuration
// const storage = multer.diskStorage({
//   destination: async (req, file, cb) => {
//     try {
//       const state = req.body.state || "default"; // Ensure state is provided
//       const stateFolder = path.join(UPLOADS_ROOT, state.replace(/ /g, "_"));
//       await fs.ensureDir(stateFolder); // Create state folder if it doesn't exist
//       cb(null, stateFolder);
//     } catch (error) {
//       cb(error, null);
//     }
//   },
//   filename: (req, file, cb) => {
//     const timestamp = Date.now();
//     const newFileName = `${file.fieldname}-${timestamp}${path.extname(file.originalname)}`;
//     cb(null, newFileName);
//   },
// });

// const upload = multer({ storage });
// 1. Create a new address with dynamic image upload
// exports.createAddress = async (req, res) => {
//   try {
//     const { country, state, city, description, startingPrice, coordinates } = req.body;
//     // Validate coordinates
//     let parsedCoordinates;
//     try {
//       parsedCoordinates = typeof coordinates === "string" ? JSON.parse(coordinates) : coordinates;
//       if (!Array.isArray(parsedCoordinates) || parsedCoordinates.length !== 2) {
//         throw new Error("Coordinates must be an array of two numbers [latitude, longitude].");
//       }
//     } catch (err) {
//       return res.status(400).json({ message: "Invalid coordinates format." });
//     }

//     // Create state folder dynamically
//     const stateFolder = await createDynamicFolder(state);

//     // Rename and move uploaded files
//     const images = [];
//     if (req.files) {
//       for (const file of req.files) {
//         const timestamp = Date.now();
//         const newFileName = `${file.fieldname}-${timestamp}${path.extname(file.originalname)}`;
//         const destinationPath = path.join(stateFolder, newFileName);
//         await fs.move(file.path, destinationPath);
//         images.push(path.relative(UPLOADS_ROOT, destinationPath));
//       }
//     }

//     // Create a new address document
//     const newAddress = new Address({
//       country,
//       state,
//       city,
//       description,
//       images,
//       startingPrice,
//       coordinates: parsedCoordinates,
//     });

//     await newAddress.save();
//     res.status(201).json({ message: "Address created successfully", address: newAddress });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// exports.updateAddress = async (req, res) => {
//   try {
//     const { addressId } = req.params;
//     const updatedData = req.body;

//     // Fetch the current address from the database to get existing images
//     const currentAddress = await Address.findById(addressId);
//     if (!currentAddress) {
//       return res.status(404).json({ message: "Address not found." });
//     }

//     // If no new files are uploaded, retain the existing images
//     if (req.files && req.files.length > 0) {
//       const stateFolder = await createDynamicFolder(req.body.state || "default");
//       const images = [];
//       for (const file of req.files) {
//         const timestamp = Date.now();
//         const newFileName = `${file.fieldname}-${timestamp}${path.extname(file.originalname)}`;
//         const destinationPath = path.join(stateFolder, newFileName);
//         await fs.move(file.path, destinationPath);
//         images.push(path.relative(UPLOADS_ROOT, destinationPath));
//       }
//       updatedData.images = images; // Update the images if new files are uploaded
//     } else {
//       // If no new images are provided, retain the old images
//       updatedData.images = currentAddress.images;
//     }

//     // Update the address with the new data
//     const updatedAddress = await Address.findByIdAndUpdate(addressId, updatedData, { new: true });
//     if (!updatedAddress) {
//       return res.status(404).json({ message: "Address not found." });
//     }

//     res.json({ message: "Address updated successfully", address: updatedAddress });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.createAddress = async (req, res) => {
  try {
    const { country, state, city, description, startingPrice, coordinates } = req.body;

    // Validate coordinates
    let parsedCoordinates;
    try {
      parsedCoordinates = typeof coordinates === "string" ? JSON.parse(coordinates) : coordinates;
      if (!Array.isArray(parsedCoordinates) || parsedCoordinates.length !== 2) {
        throw new Error("Coordinates must be an array of two numbers [latitude, longitude].");
      }
    } catch (err) {
      return res.status(400).json({ message: "Invalid coordinates format." });
    }

    // Upload images to Cloudinary
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: `addresses/${state || "default"}`, // Store under state folder
          public_id: `${Date.now()}-${file.originalname}`,
          resource_type: "image",
        });
        images.push(result.secure_url); // Save Cloudinary URL
      }
    }

    // Create new Address document
    const newAddress = new Address({
      country,
      state,
      city,
      description,
      images, // Store Cloudinary image URLs in DB
      startingPrice,
      coordinates: parsedCoordinates,
    });

    await newAddress.save();
    res.status(201).json({ message: "Address created successfully", address: newAddress });
  } catch (error) {
    console.error("Error creating address:", error);
    res.status(500).json({ error: error.message });
  }
};
// 2️⃣ Update Address and Replace Images If New Ones Are Provided
exports.updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const updatedData = req.body;

    // Fetch current address
    const currentAddress = await Address.findById(addressId);
    if (!currentAddress) {
      return res.status(404).json({ message: "Address not found." });
    }

    // Process new images (if uploaded)
    if (req.files && req.files.length > 0) {
      // Delete old images from Cloudinary
      if (currentAddress.images && currentAddress.images.length > 0) {
        for (const oldImage of currentAddress.images) {
          const publicId = oldImage.split("/").pop().split(".")[0]; // Extract public ID
          await cloudinary.uploader.destroy(`addresses/${publicId}`);
        }
      }

      // Upload new images to Cloudinary
      updatedData.images = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: `addresses/${currentAddress.state || "default"}`,
          public_id: `${Date.now()}-${file.originalname}`,
          resource_type: "image",
        });
        updatedData.images.push(result.secure_url);
      }
    } else {
      updatedData.images = currentAddress.images; // Keep existing images if none uploaded
    }

    // Update Address
    const updatedAddress = await Address.findByIdAndUpdate(addressId, updatedData, { new: true });

    res.json({ message: "Address updated successfully", address: updatedAddress });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ error: error.message });
  }
};

// 2. Get all addresses
exports.getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find();


    const transformedAddresses = addresses.map(address => {
      if (address.city && address.coordinates && address.startingPrice) {
        return {
          cityName: address.city,
          coordinates: address.coordinates.map(coord => parseFloat(coord)),
          startingPrice: address.startingPrice
        };
      } else {
       
        return null;
      }
    }).filter(record => record !== null);

    res.json({ message: "All addresses retrieved successfully", addresses: transformedAddresses });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllAddressesforAdminAddress = async (req, res) => {
  try {
    const { page = 1, limit = 10, country, state, city } = req.query;

    // Build the query object dynamically based on filters
    const query = {};
    if (country) query.country = { $regex: new RegExp(country, 'i') }; // Case-insensitive
    if (state) query.state = { $regex: new RegExp(state, 'i') };
    if (city) query.city = { $regex: new RegExp(city, 'i') };

    // Get total count for pagination metadata
    const totalRecords = await Address.countDocuments(query);

    // Fetch paginated and filtered addresses
    const addresses = await Address.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Transform the results
    const transformedAddresses = addresses.map((address) => {
      if (address.city && address.coordinates && address.startingPrice) {
        return {
          cityName: address.city,
          stateName:address.state,
          countryName:address.country,
          description:address.description,
          coordinates: address.coordinates.map((coord) => parseFloat(coord)),
          startingPrice: address.startingPrice,
          images:address.images,
          id:address._id
        };
      } else {
  
        return null;
      }
    }).filter((record) => record !== null);

    // Respond with paginated results and metadata
    res.json({
      message: 'All addresses retrieved successfully',
      metadata: {
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
      addresses: transformedAddresses,
    });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ error: error.message });
  }
};


exports.getAddressForPlaces = async (req, res) => {
  try {
    const addresses = await Address.find();


    // Extract unique states and cities
    const states = [];
    const cities = [];

    addresses.forEach(address => {
      if (address.state && address._id) {
        // Check if the state is already added
        if (!states.some(state => state.stateName === address.state)) {
          states.push({
            stateName: address.state,
            _id: address._id
          });
        }
      }

      if (address.city && address._id) {
        cities.push({
          cityName: address.city,
          _id: address._id
        });
      }
    });

    res.json({
      message: "Addresses grouped successfully",
      states,
      cities
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllAddressesForTourType = async (req, res) => {
  try {
    // Fetch all addresses
    const addresses = await Address.find();

    // Initialize containers for grouping
    const domesticAddresses = [];
    const internationalAddresses = [];

    for (const address of addresses) {
      if (address.city && address.coordinates && address.startingPrice) {
        // Check if the address is linked to a domestic or international tour plan
        const linkedTourPlans = await TourPlan.find({ addressId: address._id });

        // Determine if the address is domestic or international
        const isDomestic = linkedTourPlans.some(plan => plan.tourType === "D");
        const isInternational = linkedTourPlans.some(plan => plan.tourType === "I");

        const transformedAddress = {
          cityName: address.state,
          coordinates: address.coordinates.map(coord => parseFloat(coord)),
          startingPrice: address.startingPrice,
        };

        if (isDomestic) {
          domesticAddresses.push(transformedAddress);
        }
        if (isInternational) {
          internationalAddresses.push(transformedAddress);
        }
      } else {
      
      }
    }

    // Combine results into categories
    const groupedAddresses = {
      domestic: domesticAddresses,
      international: internationalAddresses,
    };

    res.json({
      message: "Addresses grouped by state and category retrieved successfully",
      addresses: groupedAddresses,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: error.message });
  }
};

// 3. Get addresses by filters
exports.getAddressByFilters = async (req, res) => {
  try {
    const filters = req.query; // Use query parameters for filtering
    const addresses = await Address.find(filters);
    res.json({ message: "Filtered addresses retrieved successfully", addresses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Get all addresses with packages (custom logic)
exports.getAllAddressesWithCategories = async (req, res) => {
  try {
    const addresses = await Address.aggregate([
      {
        $lookup: {
          from: "packages", // Assuming "packages" is another collection
          localField: "_id",
          foreignField: "addressId",
          as: "packages",
        },
      },
    ]);
    res.json({ message: "Addresses with categories retrieved successfully", addresses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Update an address by ID


// 6. Delete an address by ID
exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    // Find address by ID
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found." });
    }

    // Delete images from Cloudinary
    if (address.images && address.images.length > 0) {
      for (const imageUrl of address.images) {
        // Extract public_id from the URL
        const publicId = imageUrl
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0]; // Extracts 'folder/imageName' without extension

        await cloudinary.uploader.destroy(publicId);
      }
    }

    // Delete Address from Database
    await Address.findByIdAndDelete(addressId);

    res.json({ message: "Address and associated images deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 7. Serve an image by state name and file name
exports.getImage = async (req, res) => {
  try {
    const { state, fileName } = req.query; // Pass state and fileName as query parameters
    const filePath = path.join(UPLOADS_ROOT, state.replace(/ /g, "_"), fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Image not found." });
    }

    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
