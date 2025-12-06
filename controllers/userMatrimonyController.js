// const mongoose = require('mongoose');
// const { v4: uuidv4 } = require('uuid');
// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
// const Matrimony = require('../models/matrimonyModel');
// const Request = require('../models/userContactMatrimonyModel');
// const Package = require('../models/packagesMatrimonyModel');
// const User = require('../models/userModels');

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// exports.createMatrimony = async (req, res) => {
//   try {
//     const { fullName, fathersName, gender, ...otherFields } = req.body;
//     const createdBy = req.user._id;

//     // Check if the user has selected a package
//     const user = await User.findById(createdBy);
//     if (!user.selectedPackage) {
//       return res.status(403).json({ success: false, error: 'User has not selected a package' });
//     }

//     // Check if the user already has a matrimony entry
//     const existingMatrimony = await Matrimony.findOne({ createdBy });
//     if (existingMatrimony) {
//       return res.status(400).json({ success: false, error: 'User can only create one matrimony entry' });
//     }

//     // Handle multiple image uploads
//     const imageKeys = [];
//     if (req.files && req.files.length > 0) {
//       for (const file of req.files) {
//         const imageKey = `${uuidv4()}_${file.originalname}`;
//         const params = {
//           Bucket: process.env.UPLOADSIMAGEBUCKET,
//           Key: imageKey,
//           Body: file.buffer,
//           ContentType: file.mimetype,
//         };
//         await s3.send(new PutObjectCommand(params));
//         imageKeys.push(imageKey);
//       }
//     }

//     // Create the matrimony entry
//     const matrimony = await Matrimony.create({
//       fullName,
//       fathersName,
//       gender,
//       images: imageKeys,
//       ...otherFields,
//       createdBy,
//     });

//     // Fetch the newly created matrimony with the createdBy field populated
//     const populatedMatrimony = await Matrimony.findById(matrimony._id).populate('createdBy');

//     // Fetch details of the selected package
//     const selectedPackage = await Package.findById(user.selectedPackage);

//     res.status(201).json({ success: true, data: { matrimony: populatedMatrimony, selectedPackage } });
//   } catch (err) {
//     res.status(400).json({ success: false, error: err.message });
//   }
// };



// exports.updateOwnMatrimony = async (req, res) => {
//   try {
//     const createdBy = req.user._id;
//     const { packageId, ...updateFields } = req.body;

//     // Check if the user has selected a package
//     const user = await User.findById(createdBy).populate('selectedPackage');
//     if (!user || !user.selectedPackage) {
//       return res.status(403).json({ success: false, error: 'User has not selected a package' });
//     }

//     // Find the matrimony entry created by the authenticated user
//     const existingMatrimony = await Matrimony.findOne({ createdBy });
//     if (!existingMatrimony) {
//       return res.status(404).json({ success: false, error: 'Matrimony not found or unauthorized' });
//     }

//     // Handle multiple image uploads
//     if (req.files && req.files.length > 0) {
//       const imageKeys = [];
//       for (const file of req.files) {
//         const imageKey = `${uuidv4()}_${file.originalname}`;
//         const params = {
//           Bucket: process.env.UPLOADSIMAGEBUCKET,
//           Key: imageKey,
//           Body: file.buffer,
//           ContentType: file.mimetype,
//         };
//         await s3.send(new PutObjectCommand(params));
//         imageKeys.push(imageKey);
//       }
//       updateFields.images = imageKeys; // Update images array
//     }

//     // Update the found matrimony entry
//     const updatedMatrimony = await Matrimony.findOneAndUpdate(
//       { _id: existingMatrimony._id },
//       updateFields,
//       { new: true, runValidators: true },
//     ).populate('createdBy');

//     // If a new packageId is provided, update the package
//     if (packageId) {
//       const newPackage = await Package.findById(packageId);
//       if (!newPackage) {
//         return res.status(404).json({ success: false, error: 'Package not found' });
//       }
//       user.selectedPackage = packageId;
//       await user.save();
//     }

//     // Fetch all details of the selected package
//     const fullPackage = await Package.findById(user.selectedPackage);

//     res.status(200).json({ success: true, data: { matrimony: updatedMatrimony, package: fullPackage } });
//   } catch (err) {
//     res.status(400).json({ success: false, error: err.message });
//   }
// };




// // Get Own Matrimony
// exports.getOwnMatrimony = async (req, res) => {
//   try {
//     const createdBy = req.user._id;

//     const ownMatrimony = await Matrimony.findOne({ createdBy }).populate('createdBy');
//     if (!ownMatrimony) {
//       return res.status(404).json({ success: false, error: 'No matrimony entry found for this user' });
//     }

//     // Get the selected package details and populate it
//     const userWithPackage = await User.findById(createdBy).populate({
//       path: 'selectedPackage',
//       model: 'packageMatrimony'
//     });
//     const selectedPackage = userWithPackage.selectedPackage;

//     res.status(200).json({ success: true, data: { matrimony: ownMatrimony, package: selectedPackage } });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// // Get All Matrimonys (Except Own)
// // Get All Matrimonys (Except Own)
// exports.getAllMatrimonysUser = async (req, res) => {
//   const { page = 1, limit = 10, subcaste, city, manglik, dateOfBirth } = req.query;
//   const skip = (page - 1) * limit;

//   try {
//     let query = {};

//     // Apply search filters if provided
//     if (subcaste) {
//       query.subcaste = subcaste;
//     }
//     if (city) {
//       query.city = city;
//     }
//     if (manglik !== undefined) {
//       query.manglik = manglik === "true";
//     }
//     if (dateOfBirth) {
//       const yearOfBirth = new Date(dateOfBirth).getFullYear();
//       query.dateOfBirth = {
//         $gte: new Date(yearOfBirth, 0, 1), // Start of the year
//         $lt: new Date(yearOfBirth + 1, 0, 1) // Start of next year
//       };
//     }

//     const createdBy = req.user._id;

//     // Get the user's wishlist
//     const user = await User.findById(createdBy).select('wishlist');

//     // Fetch total documents count with filters
//     const totalDocuments = await Matrimony.countDocuments({ ...query, createdBy: { $ne: createdBy } });

//     // Fetch matrimony profiles with filters, pagination, and sorting
//     const allMatrimonys = await Matrimony.find({ ...query, createdBy: { $ne: createdBy } })
//       .populate('createdBy')
//       .sort({ createdAt: -1 }) // Sort by createdAt in descending order for consistency
//       .skip(skip)
//       .limit(Number(limit));

//     // Add isWishlisted field to each matrimony profile
//     const matrimonysWithWishlistStatus = allMatrimonys.map(matrimony => {
//       const isWishlisted = user.wishlist.includes(matrimony._id.toString());
//       return { ...matrimony.toObject(), isWishlisted };
//     });

//     res.status(200).json({
//       success: true,
//       data: matrimonysWithWishlistStatus,
//       currentPage: parseInt(page),
//       totalPages: Math.ceil(totalDocuments / limit)
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };




// // Get Matrimony by ID (For All Users)
// exports.getMatrimonyById = async (req, res) => {
//   try {
//     const matrimony = await Matrimony.findById(req.params.id).populate('createdBy');
//     if (!matrimony) {
//       return res.status(404).json({ success: false, error: 'Matrimony not found' });
//     }

//     const userId = req.user.id;
//     const user = await User.findById(userId);

//     const isWishlisted = user ? user.wishlist.includes(matrimony._id.toString()) : false;

//     res.status(200).json({ success: true, data: matrimony, isWishlisted });
//   } catch (err) {
//     res.status (500).json({ success: false, error: err.message });
//   }
// };


// exports.addToWishlist = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { matrimonyId } = req.body;

//     // Log userId and matrimonyId for debugging purposes


//     // Check if matrimonyId is provided
//     if (!matrimonyId) {
//       return res.status(400).json({ success: false, error: 'Matrimony ID is required' });
//     }

//     // Check if matrimonyId is a valid MongoDB ObjectId
//     if (!mongoose.Types.ObjectId.isValid(matrimonyId)) {
//       return res.status(400).json({ success: false, error: 'Invalid Matrimony ID' });
//     }

//     const user = await User.findById(userId);

//     // Ensure user exists
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }

//     // Check if the matrimony profile is already in the wishlist
//     if (user.wishlist.includes(matrimonyId)) {
//       return res.status(400).json({ success: false, error: 'Matrimony profile is already in wishlist' });
//     }

//     // Add the matrimony profile to the wishlist
//     user.wishlist.push(matrimonyId);
//     await user.save();

//     res.status(200).json({ success: true, message: 'Matrimony profile added to wishlist' });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };




// exports.removeFromWishlist = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const matrimonyId = req.params.matrimonyId;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }

//     user.wishlist = user.wishlist.filter(id => id?.toString() !== matrimonyId);
//     await user.save();

//     res.status(200).json({ success: true, message: 'Matrimony removed from wishlist' });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };


// // Generate Request
// exports.generateRequest = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const matrimony = await Matrimony.findById(id);
//     if (!matrimony) {
//       return res.status(404).json({ success: false, error: 'Matrimony not found' });
//     }

//     const requester = req.user._id;

//     const request = await Request.create({ matrimonyUser: id, requester });

//     const populatedRequest = await Request.findById(request._id)
//       .populate('requester', '-password -__v') // Populate requester details, exclude password and __v
//       .populate('matrimonyUser'); // Populate matrimony user details

//     res.status(201).json({ success: true, data: populatedRequest });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };



 

// exports.deleteOwnMatrimony = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const createdBy = req.user._id;

//     const deletedMatrimony = await Matrimony.findOneAndDelete({ _id: id, createdBy });

//     if (!deletedMatrimony) {
//       return res.status(404).json({ success: false, error: 'Matrimony not found or unauthorized' });
//     }

//     res.status(200).json({ success: true, message: 'Matrimony deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// module.exports = exports;


// controllers/userMatrimonyController.js

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Matrimony = require('../models/matrimonyModel');
const Request = require('../models/userContactMatrimonyModel');
const Package = require('../models/packagesMatrimonyModel');
const User = require('../models/userModels');
const { PutObjectCommand } = require('@aws-sdk/client-s3');

// --- CHANGE 1: SAHI S3 CLIENT KO IMPORT KAREIN ---
// Path check karein. Agar s3.js file controllers ke bahar hai to '../s3' path aayega.
const { s3 } = require('../s3');

// --- CHANGE 2: PURANA, GALAT S3 CLIENT HATA DIYA GAYA HAI ---
// const s3 = new S3Client({ ... }); // <-- Yeh line ab yahan nahi hai.

// Helper function to format response with full URLs
const formatMatrimonyResponse = async (matrimony) => {
    if (!matrimony) return null;
    
    if (!matrimony.populated('createdBy')) {
        await matrimony.populate('createdBy', 'fullName image');
    }

    const matObject = matrimony.toObject();
    
    // Convert Matrimony images to full URLs
    if (matObject.images && matObject.images.length > 0) {
        matObject.images = matObject.images.map(img => `${process.env.DO_SPACES_URL}/${img}`);
    }
    
    // Convert createdBy user image to full URL
    if (matObject.createdBy && matObject.createdBy.image) {
        matObject.createdBy.image = `${process.env.DO_SPACES_URL}/${matObject.createdBy.image}`;
    }
    
    return matObject;
};


exports.createMatrimony = async (req, res) => {
    try {
        const { fullName, fathersName, gender, ...otherFields } = req.body;
        const createdBy = req.user._id;

        const user = await User.findById(createdBy);
        if (!user.selectedPackage) return res.status(403).json({ success: false, error: 'User has not selected a package' });
        
        const existingMatrimony = await Matrimony.findOne({ createdBy });
        if (existingMatrimony) return res.status(400).json({ success: false, error: 'User can only create one matrimony entry' });

        const BUCKET_NAME = process.env.UPLOADSIMAGEBUCKET;
        const imageKeys = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const imageKey = `matrimony/images/${uuidv4()}_${file.originalname}`;
                const params = { Bucket: BUCKET_NAME, Key: imageKey, Body: file.buffer, ContentType: file.mimetype, ACL: 'public-read' };
                await s3.send(new PutObjectCommand(params));
                imageKeys.push(imageKey);
            }
        }

        const matrimony = await Matrimony.create({
            fullName, fathersName, gender, images: imageKeys, ...otherFields, createdBy,
        });

        let populatedMatrimony = await Matrimony.findById(matrimony._id).populate('createdBy');
        const selectedPackage = await Package.findById(user.selectedPackage);
        
        populatedMatrimony = await formatMatrimonyResponse(populatedMatrimony);

        res.status(201).json({ success: true, data: { matrimony: populatedMatrimony, selectedPackage } });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.updateOwnMatrimony = async (req, res) => {
    try {
        const createdBy = req.user._id;
        const { packageId, ...updateFields } = req.body;

        const user = await User.findById(createdBy).populate('selectedPackage');
        if (!user || !user.selectedPackage) return res.status(403).json({ success: false, error: 'User has not selected a package' });
        
        const existingMatrimony = await Matrimony.findOne({ createdBy });
        if (!existingMatrimony) return res.status(404).json({ success: false, error: 'Matrimony not found or unauthorized' });

        if (req.files && req.files.length > 0) {
            const BUCKET_NAME = process.env.UPLOADSIMAGEBUCKET;
            const imageKeys = [];
            for (const file of req.files) {
                const imageKey = `matrimony/images/${uuidv4()}_${file.originalname}`;
                const params = { Bucket: BUCKET_NAME, Key: imageKey, Body: file.buffer, ContentType: file.mimetype, ACL: 'public-read' };
                await s3.send(new PutObjectCommand(params));
                imageKeys.push(imageKey);
            }
            updateFields.images = imageKeys;
        }

        let updatedMatrimony = await Matrimony.findOneAndUpdate({ _id: existingMatrimony._id }, updateFields, { new: true }).populate('createdBy');

        if (packageId) {
            const newPackage = await Package.findById(packageId);
            if (!newPackage) return res.status(404).json({ success: false, error: 'Package not found' });
            user.selectedPackage = packageId;
            await user.save();
        }
        
        const fullPackage = await Package.findById(user.selectedPackage);
        updatedMatrimony = await formatMatrimonyResponse(updatedMatrimony);

        res.status(200).json({ success: true, data: { matrimony: updatedMatrimony, package: fullPackage } });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.getOwnMatrimony = async (req, res) => {
    try {
        const createdBy = req.user._id;
        let ownMatrimony = await Matrimony.findOne({ createdBy }).populate('createdBy');
        if (!ownMatrimony) return res.status(404).json({ success: false, error: 'No matrimony entry found for this user' });
        
        const userWithPackage = await User.findById(createdBy).populate({ path: 'selectedPackage', model: 'packageMatrimony' });
        const selectedPackage = userWithPackage.selectedPackage;

        ownMatrimony = await formatMatrimonyResponse(ownMatrimony);

        res.status(200).json({ success: true, data: { matrimony: ownMatrimony, package: selectedPackage } });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getAllMatrimonysUser = async (req, res) => {
    const { page = 1, limit = 10, subcaste, city, manglik, dateOfBirth } = req.query;
    const skip = (page - 1) * limit;

    try {
        let query = {};
        if (subcaste) query.subcaste = subcaste;
        if (city) query.city = city;
        if (manglik !== undefined) query.manglik = manglik === "true";
        if (dateOfBirth) {
            const yearOfBirth = new Date(dateOfBirth).getFullYear();
            query.dateOfBirth = { $gte: new Date(yearOfBirth, 0, 1), $lt: new Date(yearOfBirth + 1, 0, 1) };
        }

        const createdBy = req.user._id;
        const user = await User.findById(createdBy).select('wishlist');

        const totalDocuments = await Matrimony.countDocuments({ ...query, createdBy: { $ne: createdBy } });
        const allMatrimonys = await Matrimony.find({ ...query, createdBy: { $ne: createdBy } }).populate('createdBy').sort({ createdAt: -1 }).skip(skip).limit(Number(limit));

        const matrimonysWithWishlistStatus = await Promise.all(allMatrimonys.map(async (matrimony) => {
            const formattedMatrimony = await formatMatrimonyResponse(matrimony);
            const isWishlisted = user.wishlist.includes(matrimony._id.toString());
            return { ...formattedMatrimony, isWishlisted };
        }));

        res.status(200).json({
            success: true,
            data: matrimonysWithWishlistStatus,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalDocuments / limit)
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getMatrimonyById = async (req, res) => {
    try {
        let matrimony = await Matrimony.findById(req.params.id).populate('createdBy');
        if (!matrimony) return res.status(404).json({ success: false, error: 'Matrimony not found' });

        const user = await User.findById(req.user.id);
        const isWishlisted = user ? user.wishlist.includes(matrimony._id.toString()) : false;
        
        matrimony = await formatMatrimonyResponse(matrimony);
        
        res.status(200).json({ success: true, data: matrimony, isWishlisted });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.addToWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { matrimonyId } = req.body;
        if (!matrimonyId || !mongoose.Types.ObjectId.isValid(matrimonyId)) {
            return res.status(400).json({ success: false, error: 'Valid Matrimony ID is required' });
        }
        
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        if (user.wishlist.includes(matrimonyId)) return res.status(400).json({ success: false, error: 'Matrimony profile is already in wishlist' });
        
        user.wishlist.push(matrimonyId);
        await user.save();
        res.status(200).json({ success: true, message: 'Matrimony profile added to wishlist' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { matrimonyId } = req.params; // Changed from req.body to req.params
        
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        
        user.wishlist = user.wishlist.filter(id => id?.toString() !== matrimonyId);
        await user.save();
        res.status(200).json({ success: true, message: 'Matrimony removed from wishlist' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.generateRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const matrimony = await Matrimony.findById(id);
        if (!matrimony) return res.status(404).json({ success: false, error: 'Matrimony not found' });
        
        const request = await Request.create({ matrimonyUser: id, requester: req.user._id });
        const populatedRequest = await Request.findById(request._id).populate('requester', '-password -__v').populate('matrimonyUser');
        
        res.status(201).json({ success: true, data: populatedRequest });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.deleteOwnMatrimony = async (req, res) => {
    try {
        const { id } = req.params; // Changed to req.params.id
        const deletedMatrimony = await Matrimony.findOneAndDelete({ _id: id, createdBy: req.user._id });
        if (!deletedMatrimony) return res.status(404).json({ success: false, error: 'Matrimony not found or unauthorized' });
        res.status(200).json({ success: true, message: 'Matrimony deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// No need for module.exports = exports;