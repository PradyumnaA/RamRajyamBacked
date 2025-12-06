// const Classified = require('../models/classifiedModels');
// const { v4: uuidv4 } = require('uuid');
// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
// const Counter = require('../models/classifiedCounter');
// const Category = require('../models/classifiedCategoryModels');

// // Helper function to get the next sequence value
// const getNextClassifiedSequenceValue = async (sequenceName) => {
//   const counter = await Counter.findOneAndUpdate(
//     { name: sequenceName },
//     { $inc: { seq: 1 } },
//     { new: true, upsert: true }
//   );
//   return counter.seq;
// };
// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });
// // Create a new classified ad
// exports.createUserClassified = async (req, res) => {
//   const { title, category, description, price, pincode, address } = req.body;
//   const files = req.files;

//   if (!files || files.length === 0) {
//     return res.status(400).json({ error: 'Images are required' });
//   }

//   try {
//     const id = await getNextClassifiedSequenceValue('classifiedId');
//     const status = 'pending'; // Newly created classifieds are pending approval

//     // Upload images to S3
//     const imageKeys = await Promise.all(
//       files.map(async (file) => {
//         const imageKey = `${uuidv4()}_${file.originalname}`;
//         const params = {
//           Bucket: process.env.UPLOADSIMAGEBUCKET,
//           Key: imageKey,
//           Body: file.buffer,
//           ContentType: file.mimetype,
//         };
//         await s3.send(new PutObjectCommand(params));
//         return imageKey;
//       })
//     );

//     let newClassified = new Classified({
//       id,
//       title,
//       images: imageKeys,
//       category,
//       description,
//       price,
//       pincode,
//       address,
//       status,
//     });

//     newClassified.createdBy = req.user._id; // Admin is creating the classified

//     newClassified = await newClassified.save();

//     // Manually lookup category details
//     const categoryDetails = await Category.findOne({ id: newClassified.category });
//     const response = {
//       ...newClassified.toObject(),
//       category: {
//         id: categoryDetails.id,
//         name: categoryDetails.name,
//         image: categoryDetails.image,
//       },
//       createdBy: req.user, // Include createdBy information
//       isApproved: false, // Classified is pending approval
//       createdAt: newClassified.createdAt,
//     };

//     res.status(201).json(response);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// // Get all approved classified ads created by the authenticated user
// exports.getUserClassifieds = async (req, res) => {
//   try {
//     const userClassifieds = await Classified.find({ createdBy: req.user._id, status: 'approved' });

//     const response = await Promise.all(userClassifieds.map(async (classified) => {
//       const category = await Category.findOne({ id: classified.category });

//       return {
//         ...classified.toObject(),
//         category: {
//           id: category.id,
//           name: category.name,
//           images: category.images,
//         },
//         createdBy: req.user,
//         isApproved: true, // These classifieds are approved
//       };
//     }));

//     res.status(200).json(response);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };




// // Get a classified ad by ID created by the authenticated user
// exports.getUserClassifiedById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const classified = await Classified.findOne({ id });
    
//     if (!classified) {
//         return res.status(404).json({ error: 'Classified ad not found' });
//     }

//     const categoryDetails = await Category.findOne({ id: classified.category });



//     const response = {
//         id: classified.id,
//         title: classified.title,
//         description: classified.description,
//         images: classified.images,
//         price: classified.price,
//         address: classified.address,
//         pincode: classified.pincode,
//         category: categoryDetails,
//         createdAt: classified.createdAt,
//         updatedAt: classified.updatedAt,
//         createdBy: classified.createdBy,
//         status: classified.status,
//         isApproved: classified.isApproved,
//     };

//     res.status(200).json(response);
// } catch (error) {
//     res.status(400).json({ error: error.message });
// }
// };

// // Update a classified ad by ID created by the authenticated user
// exports.updateUserClassifiedById = async (req, res) => {
//   const { title, category, description, price, pincode, address, status } = req.body;
//   const files = req.files;

//   try {
//     const classified = await Classified.findOne({ id: req.params.id });

//     if (!classified) {
//       return res.status(404).json({ error: 'Classified not found' });
//     }

//     const updatedFields = {};
//     if (title) updatedFields.title = title;
//     if (category) updatedFields.category = category;
//     if (description) updatedFields.description = description;
//     if (price) updatedFields.price = price;
//     if (pincode) updatedFields.pincode = pincode;
//     if (address) updatedFields.address = address;
//     if (status) updatedFields.status = status;

//     // Handle image uploads
//     if (files && files.length > 0) {
//       const imageKeys = await Promise.all(
//         files.map(async (file) => {
//           const imageKey = `${uuidv4()}_${file.originalname}`;
//           const params = {
//             Bucket: process.env.UPLOADSIMAGEBUCKET,
//             Key: imageKey,
//             Body: file.buffer,
//             ContentType: file.mimetype,
//           };
//           await s3.send(new PutObjectCommand(params));
//           return imageKey;
//         })
//       );
//       updatedFields.images = imageKeys;
//     } else if (req.body.images) {
//       updatedFields.images = req.body.images;
//     }

//     await Classified.findOneAndUpdate(
//       { id: req.params.id },
//       { $set: updatedFields },
//       { new: true }
//     );

//     const updatedClassified = await Classified.findOne({ id: req.params.id });
//     const categoryDetails = await Category.findOne({ id: updatedClassified.category });

//     const response = {
//       id: updatedClassified.id,
//       title: updatedClassified.title,
//       images: updatedClassified.images,
//       category: {
//         id: categoryDetails.id,
//         name: categoryDetails.name,
//         image: categoryDetails.image,
//       },
//       createdBy: req.user,
//       description: updatedClassified.description,
//       address: updatedClassified.address,
//       pincode: updatedClassified.pincode,
//       price: updatedClassified.price,
//       createdBy: updatedClassified.createdBy,
//       status: updatedClassified.status,
//       isApproved: true, // Admin-created classified are approved by default
//     };

//     res.status(200).json(response);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// // Delete a classified ad by ID created by the authenticated user
// exports.deleteUserClassifiedById = async (req, res) => {
//   try {
//     const classified = await Classified.findOneAndDelete({ id: req.params.id, createdBy: req.user._id });

//     if (!classified) {
//       return res.status(404).json({ error: 'Classified not found or unauthorized' });
//     }

//     res.status(200).json({ message: 'Classified deleted' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
// //getall approved classified
// exports.getAllClassifieds = async (req, res) => {
//   try {
//     const { address, pincode, page = 1, limit = 10 } = req.query;

//     // Create a query object with the approved status
//     const query = { status: 'approved' }; // Assuming 'approved' is the status value for approved classifieds

//     // Add additional filters if provided
//     if (address) query.address = new RegExp(address, 'i');
//     if (pincode) query.pincode = new RegExp(pincode, 'i');

//     // Fetch the classifieds with the updated query
//     const classifieds = await Classified.find(query)
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit))
//       .populate('createdBy'); // Populate the createdBy field with user details

//     // Count the total number of classifieds matching the query
//     const totalClassifieds = await Classified.countDocuments(query);

//     // Fetch category details for each classified
//     const classifiedsWithCategories = await Promise.all(
//       classifieds.map(async (classified) => {
//         const categoryDetails = await Category.findOne({ id: classified.category });

//         return {
//           id: classified.id,
//           title: classified.title,
//           description: classified.description,
//           images: classified.images,
//           price: classified.price,
//           address: classified.address,
//           pincode: classified.pincode,
//           category: categoryDetails,
//           createdAt: classified.createdAt,
//           updatedAt: classified.updatedAt,
//           createdBy: classified.createdBy, // Include the populated createdBy details
//           status: classified.status,
//           isApproved: classified.status === 'approved', // Set isApproved based on status
//         };
//       })
//     );

//     // Respond with the data
//     res.status(200).json({
//       classifieds: classifiedsWithCategories,
//       totalPages: Math.ceil(totalClassifieds / limit),
//       currentPage: parseInt(page),
//     });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// controllers/classifiedController.js

const Classified = require('../models/classifiedModels');
const { v4: uuidv4 } = require('uuid');
const Counter = require('../models/classifiedCounter');
const Category = require('../models/classifiedCategoryModels');
const { PutObjectCommand } = require('@aws-sdk/client-s3');

// --- CHANGE 1: SAHI S3 CLIENT KO IMPORT KAREIN ---
// Path check karein. Agar s3.js file controllers ke bahar hai to '../s3' path aayega.
const { s3 } = require('../s3');

// --- CHANGE 2: PURANA, GALAT S3 CLIENT HATA DIYA GAYA HAI ---
// const s3 = new S3Client({ ... }); // <-- Yeh line ab yahan nahi hai.

const getNextClassifiedSequenceValue = async (sequenceName) => {
    const counter = await Counter.findOneAndUpdate({ name: sequenceName }, { $inc: { seq: 1 } }, { new: true, upsert: true });
    return counter.seq;
};

// Helper function to format response with full URLs
const formatClassifiedResponse = async (classified, user = null) => {
    const classifiedObject = classified.toObject();
    
    // Convert image keys to full URLs
    if (classifiedObject.images && classifiedObject.images.length > 0) {
        classifiedObject.images = classifiedObject.images.map(img => `${process.env.DO_SPACES_URL}/${img}`);
    }

    // Populate and format category details
    const categoryDetails = await Category.findOne({ id: classifiedObject.category });
    if (categoryDetails) {
        classifiedObject.category = categoryDetails.toObject();
        if (classifiedObject.category.image) {
            classifiedObject.category.image = `${process.env.DO_SPACES_URL}/${classifiedObject.category.image}`;
        }
    } else {
        classifiedObject.category = null;
    }
    
    if (user) classifiedObject.createdBy = user;
    return classifiedObject;
};


// Create a new classified ad by user
exports.createUserClassified = async (req, res) => {
    const { title, category, description, price, pincode, address } = req.body;
    const files = req.files;

    if (!files || files.length === 0) return res.status(400).json({ error: 'Images are required' });

    try {
        const BUCKET_NAME = process.env.UPLOADSIMAGEBUCKET;
        const imageKeys = await Promise.all(
            files.map(async (file) => {
                const imageKey = `classifieds/${uuidv4()}_${file.originalname}`;
                const params = { Bucket: BUCKET_NAME, Key: imageKey, Body: file.buffer, ContentType: file.mimetype, ACL: 'public-read' };
                await s3.send(new PutObjectCommand(params));
                return imageKey;
            })
        );

        const id = await getNextClassifiedSequenceValue('classifiedId');
        let newClassified = new Classified({
            id, title, images: imageKeys, category, description, price, pincode, address,
            status: 'pending', createdBy: req.user._id,
        });
        
        await newClassified.save();
        
        const response = await formatClassifiedResponse(newClassified, req.user);
        res.status(201).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all classifieds created by the authenticated user
exports.getUserClassifieds = async (req, res) => {
    try {
        const userClassifieds = await Classified.find({ createdBy: req.user._id });
        const response = await Promise.all(userClassifieds.map(classified => formatClassifiedResponse(classified, req.user)));
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a classified ad by ID created by the authenticated user
exports.getUserClassifiedById = async (req, res) => {
    try {
        const { id } = req.params;
        const classified = await Classified.findOne({ id, createdBy: req.user._id });
        if (!classified) return res.status(404).json({ error: 'Classified ad not found' });
        
        const response = await formatClassifiedResponse(classified, req.user);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a classified ad by ID created by the authenticated user
exports.updateUserClassifiedById = async (req, res) => {
    const { title, category, description, price, pincode, address } = req.body;
    const files = req.files;

    try {
        const classified = await Classified.findOne({ id: req.params.id, createdBy: req.user._id });
        if (!classified) return res.status(404).json({ error: 'Classified not found or unauthorized' });

        const updatedFields = {};
        if (title) updatedFields.title = title;
        if (category) updatedFields.category = category;
        if (description) updatedFields.description = description;
        if (price) updatedFields.price = price;
        if (pincode) updatedFields.pincode = pincode;
        if (address) updatedFields.address = address;
        updatedFields.status = 'pending'; // Re-submit for approval

        if (files && files.length > 0) {
            const BUCKET_NAME = process.env.UPLOADSIMAGEBUCKET;
            const imageKeys = await Promise.all(
                files.map(async (file) => {
                    const imageKey = `classifieds/${uuidv4()}_${file.originalname}`;
                    const params = { Bucket: BUCKET_NAME, Key: imageKey, Body: file.buffer, ContentType: file.mimetype, ACL: 'public-read' };
                    await s3.send(new PutObjectCommand(params));
                    return imageKey;
                })
            );
            updatedFields.images = imageKeys;
        } else if (req.body.images) {
            updatedFields.images = req.body.images.map(img => img.startsWith('http') ? img.split(process.env.DO_SPACES_URL + '/')[1] : img);
        }

        const updatedClassified = await Classified.findOneAndUpdate({ id: req.params.id }, { $set: updatedFields }, { new: true });
        
        const response = await formatClassifiedResponse(updatedClassified, req.user);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a classified ad by ID created by the authenticated user
exports.deleteUserClassifiedById = async (req, res) => {
    try {
        const classified = await Classified.findOneAndDelete({ id: req.params.id, createdBy: req.user._id });
        if (!classified) return res.status(404).json({ error: 'Classified not found or unauthorized' });
        res.status(200).json({ message: 'Classified deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all APPROVED classifieds for public view
exports.getAllClassifieds = async (req, res) => {
    try {
        const { address, pincode, page = 1, limit = 10 } = req.query;
        const query = { status: 'approved' };
        if (address) query.address = new RegExp(address, 'i');
        if (pincode) query.pincode = new RegExp(pincode, 'i');

        const classifieds = await Classified.find(query).skip((page - 1) * limit).limit(parseInt(limit)).populate('createdBy', 'fullName');
        const totalClassifieds = await Classified.countDocuments(query);
        
        const classifiedsWithDetails = await Promise.all(
            classifieds.map(classified => formatClassifiedResponse(classified))
        );

        res.status(200).json({
            classifieds: classifiedsWithDetails,
            totalPages: Math.ceil(totalClassifieds / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};