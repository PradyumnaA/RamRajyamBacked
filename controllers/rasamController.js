// const Rasam = require('../models/rasamModels');
// const { v4: uuidv4 } = require('uuid');
// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
// const Category = require('../models/rasamCategoryModels');
// const path = require('path');
// const fs = require('fs');
// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// // Get all rasams with pagination and search
// exports.getAllRasams = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search = '' } = req.query;

//     const searchFilter = search
//       ? { title: { $regex: search, $options: 'i' } }
//       : {};

//     const rasamList = await Rasam.find({
//       ...searchFilter,
//     })
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit))
//       .populate('category'); // Populate category

//     const totalRasams = await Rasam.countDocuments({
//       ...searchFilter,
//     });

//     const response = rasamList.map(rasamItem => {
//       return {
//         id: rasamItem.id,
//         title: rasamItem.title,
//         description: rasamItem.description,
//         image: rasamItem.image,
//         city: rasamItem.city,
//         category: {
//           id: rasamItem.category.id, // Access populated category fields
//           name: rasamItem.category.name,
//           image: rasamItem.category.image,
//         },
//         createdAt: rasamItem.createdAt,
//       };
//     });

//     res.status(200).json({
//       currentPage: parseInt(page),
//       totalPages: Math.ceil(totalRasams / limit),
//       totalItems: totalRasams,
//       items: response,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };



// // Get rasam by ID
// exports.getRasamById = async (req, res) => {
//   try {
//     const rasam = await Rasam.findOne({ id: req.params.id }).populate('category');
//     if (!rasam) return res.status(404).json({ message: 'Rasam not found' });
//     res.json(rasam);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// // Create new rasam
// exports.createRasam = async (req, res) => {
//   const { title, description, city, category: categoryName } = req.body;
//   const imageKey = req.file ? `${uuidv4()}_${req.file.originalname}` : null; // Generate a unique key for the image

//   if (!imageKey) {
//     return res.status(400).json({ error: 'Image is required' });
//   }

//   try {
//     const params = {
//       Bucket: process.env.UPLOADSIMAGEBUCKET,
//       Key: imageKey,
//       Body: req.file.buffer,
//       ContentType: req.file.mimetype,
//     };
//     const data = await s3.send(new PutObjectCommand(params)); // Ensure correct usage of PutObjectCommand
//     console.log('Successfully uploaded file:', data);

//     const category = await Category.findOne({ name: categoryName });
//     if (!category) return res.status(400).json({ message: 'Invalid category' });

//     const rasam = new Rasam({
//       title,
//       description,
//       image: imageKey,
//       city,
//       category: category._id // Use ObjectId for category
//     });

//     const newRasam = await rasam.save();
//     res.status(201).json(newRasam);
//   } catch (err) {
//     if (req.file) fs.unlinkSync(req.file.path); // Delete the uploaded image if save fails
//     res.status(400).json({ message: err.message });
//   }
// };


// // Update rasam by ID

// exports.updateRasam = async (req, res) => {
//   try {
//     const { title, description, city, category: categoryName } = req.body;
//     let image = req.body.image; // Existing image key from the request

//     // Handle image upload if a new file is provided
//     if (req.file) {
//       const imageKey = `${uuidv4()}_${req.file.originalname}`;
//       const params = {
//         Bucket: process.env.UPLOADSIMAGEBUCKET,
//         Key: imageKey,
//         Body: req.file.buffer,
//         ContentType: req.file.mimetype,
//       };
//       const data = await s3.send(new PutObjectCommand(params));
//       console.log('Successfully uploaded file:', data);
//       image = imageKey; // Update image to new key
//     }

//     // Prepare updated fields based on provided request
//     const updatedFields = {};
//     if (title) updatedFields.title = title;
//     if (description) updatedFields.description = description;
//     if (city) updatedFields.city = city;
//     if (image) updatedFields.image = image; // Include image only if provided

//     // Handle category update if provided
//     if (categoryName) {
//       const category = await Category.findOne({ name: categoryName });
//       if (!category) return res.status(400).json({ message: 'Invalid category' });
//       updatedFields.category = category._id; // Use ObjectId for category
//     }

//     // Perform the update
//     const updatedRasam = await Rasam.findOneAndUpdate(
//       { id: req.params.id },
//       { $set: updatedFields },
//       { new: true }
//     ).populate('category'); // Ensure category is populated in response

//     // Handle case where rasam is not found
//     if (!updatedRasam) {
//       if (req.file) fs.unlinkSync(req.file.path); // Delete the uploaded image if update fails
//       return res.status(404).json({ message: 'Rasam not found' });
//     }

//     // Respond with updated rasam
//     res.json({
//       id: updatedRasam.id,
//       title: updatedRasam.title,
//       description: updatedRasam.description,
//       image: updatedRasam.image,
//       city: updatedRasam.city,
//       category: {
//         id: updatedRasam.category._id, // Ensure category details are included
//         name: updatedRasam.category.name,
//         image: updatedRasam.category.image,
//       },
//       createdAt: updatedRasam.createdAt,
//     });
//   } catch (err) {
//     // Handle errors
//     if (req.file) fs.unlinkSync(req.file.path); // Clean up uploaded file on error
//     res.status(400).json({ message: err.message });
//   }
// };


  

// // Delete rasam by ID
// exports.deleteRasam = async (req, res) => {
//   try {
//     const rasam = await Rasam.findOneAndDelete({ id: req.params.id });
//     if (!rasam) return res.status(404).json({ message: 'Rasam not found' });
//     if (rasam.image) fs.unlinkSync(rasam.image); // Delete the associated image
//     res.json({ message: 'Rasam deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// controllers/rasamController.js

const Rasam = require('../models/rasamModels');
const { v4: uuidv4 } = require('uuid');
const Category = require('../models/rasamCategoryModels');
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

// --- CHANGE 1: SAHI S3 CLIENT KO IMPORT KAREIN ---
// Path check karein. Agar s3.js file controllers ke bahar hai to '../s3' path aayega.
const { s3 } = require('../s3');

// --- CHANGE 2: PURANA, GALAT S3 CLIENT HATA DIYA GAYA HAI ---
// const s3 = new S3Client({ ... }); // <-- Yeh line ab yahan nahi hai.

// Helper function to format response with full URLs
const formatRasamResponse = async (rasam) => {
    if (!rasam) return null;
    
    // Ensure category is populated before converting to object
    if (!rasam.populated('category')) {
      await rasam.populate('category');
    }

    const rasamObject = rasam.toObject();
    
    // Convert Rasam image key to full URL
    if (rasamObject.image) {
        rasamObject.image = `${process.env.DO_SPACES_URL}/${rasamObject.image}`;
    }

    // Format category details
    if (rasamObject.category && rasamObject.category.image) {
        rasamObject.category.image = `${process.env.DO_SPACES_URL}/${rasamObject.category.image}`;
    }
    
    return rasamObject;
};

// Get all rasams with pagination and search
exports.getAllRasams = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const searchFilter = search ? { title: { $regex: search, $options: 'i' } } : {};
        
        const rasamList = await Rasam.find(searchFilter).populate('category').skip((page - 1) * limit).limit(parseInt(limit));
        const totalRasams = await Rasam.countDocuments(searchFilter);
        
        const response = await Promise.all(rasamList.map(rasamItem => formatRasamResponse(rasamItem)));

        res.status(200).json({
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalRasams / limit),
            totalItems: totalRasams,
            items: response,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get rasam by ID
exports.getRasamById = async (req, res) => {
    try {
        const rasam = await Rasam.findById(req.params.id).populate('category');
        if (!rasam) return res.status(404).json({ message: 'Rasam not found' });
        
        const response = await formatRasamResponse(rasam);
        res.json(response);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create new rasam
exports.createRasam = async (req, res) => {
    const { title, description, city, category: categoryId } = req.body;
    
    if (!req.file) return res.status(400).json({ error: 'Image is required' });
    
    let imageKey;
    try {
        const category = await Category.findOne({ id: categoryId });
        if (!category) return res.status(400).json({ message: 'Invalid category' });

        imageKey = `rasams/${uuidv4()}_${req.file.originalname}`;
        const params = { Bucket: process.env.UPLOADSIMAGEBUCKET, Key: imageKey, Body: req.file.buffer, ContentType: req.file.mimetype, ACL: 'public-read' };
        await s3.send(new PutObjectCommand(params));

        const rasam = new Rasam({ title, description, image: imageKey, city, category: category._id });
        const newRasam = await rasam.save();
        
        const response = await formatRasamResponse(newRasam);
        res.status(201).json(response);
    } catch (err) {
        if (imageKey) {
            await s3.send(new DeleteObjectCommand({ Bucket: process.env.UPLOADSIMAGEBUCKET, Key: imageKey }));
        }
        res.status(400).json({ message: err.message });
    }
};

// Update rasam by ID
exports.updateRasam = async (req, res) => {
    try {
        const { title, description, city, category: categoryId } = req.body;
        
        const rasam = await Rasam.findById(req.params.id);
        if (!rasam) return res.status(404).json({ message: 'Rasam not found' });

        const updatedFields = {};
        if (title) updatedFields.title = title;
        if (description) updatedFields.description = description;
        if (city) updatedFields.city = city;

        if (req.file) {
            const imageKey = `rasams/${uuidv4()}_${req.file.originalname}`;
            const params = { Bucket: process.env.UPLOADSIMAGEBUCKET, Key: imageKey, Body: req.file.buffer, ContentType: req.file.mimetype, ACL: 'public-read' };
            await s3.send(new PutObjectCommand(params));
            updatedFields.image = imageKey;
        }

        if (categoryId) {
            const category = await Category.findOne({ id: categoryId });
            if (!category) return res.status(400).json({ message: 'Invalid category' });
            updatedFields.category = category._id;
        }

        const updatedRasam = await Rasam.findByIdAndUpdate(req.params.id, { $set: updatedFields }, { new: true });
        
        const response = await formatRasamResponse(updatedRasam);
        res.json(response);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete rasam by ID
exports.deleteRasam = async (req, res) => {
    try {
        const rasam = await Rasam.findByIdAndDelete(req.params.id);
        if (!rasam) return res.status(404).json({ message: 'Rasam not found' });
        
        if (rasam.image) {
            await s3.send(new DeleteObjectCommand({ Bucket: process.env.UPLOADSIMAGEBUCKET, Key: rasam.image }));
        }
        
        res.json({ message: 'Rasam deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};