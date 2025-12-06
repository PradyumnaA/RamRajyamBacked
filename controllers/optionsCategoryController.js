// const Category = require('../models/optionsCategory');
// const { v4: uuidv4 } = require('uuid');
// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
// const mongoose = require('mongoose');
// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });
// // Create a new category
// exports.createCategory = async (req, res) => {
//   const { name } = req.body;
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
//     const _id = new mongoose.Types.ObjectId();
//     const newCategory = new Category({ _id, name, image: imageKey });
//     await newCategory.save();
//     res.status(201).json(newCategory);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Get all categories
// exports.getCategories = async (req, res) => {
//     try {
//       const { page = 1, limit = 10, search = '' } = req.query;
  
//       // Create a filter object for searching by category name
//       const filter = search ? { name: { $regex: search, $options: 'i' } } : {};
  
//       // Calculate the number of documents to skip
//       const skip = (page - 1) * limit;
  
//       // Fetch categories with pagination and search
//       const categories = await Category.find(filter)
//         .skip(skip)
//         .limit(Number(limit));
  
//       // Fetch the total count of categories for pagination info
//       const totalCategories = await Category.countDocuments(filter);
  
//       res.status(200).json({
//         categories,
//         currentPage: Number(page),
//         totalPages: Math.ceil(totalCategories / limit),
//         totalCategories
//       });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   };
  

// // Get a category by ID
// exports.getCategoryById = async (req, res) => {
//   try {
//     const category = await Category.findById(req.params.id);
//     if (!category) {
//       return res.status(404).json({ error: 'Category not found' });
//     }
//     res.status(200).json(category);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Update a category by ID
// exports.updateCategoryById = async (req, res) => {
//   const { name } = req.body;
//   let image = req.body.image;

//   try {
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
//       image = imageKey; // Update image to new key or URL
//     }

//     const updateData = { name };
//     if (image) {
//       updateData.image = image;
//     }

//     const category = await Category.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true }
//     );

//     if (!category) {
//       return res.status(404).json({ error: 'Category not found' });
//     }

//     res.status(200).json(category);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Delete a category by ID
// exports.deleteCategoryById = async (req, res) => {
//   try {
//     const category = await Category.findByIdAndDelete(req.params.id);
//     if (!category) {
//       return res.status(404).json({ error: 'Category not found' });
//     }
//     res.status(200).json({ message: 'Category deleted' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// controllers/optionsCategoryController.js

const Category = require('../models/optionsCategory');
const { v4: uuidv4 } = require('uuid');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const mongoose = require('mongoose');

// --- CHANGE 1: SAHI S3 CLIENT KO IMPORT KAREIN ---
// Path check karein. Agar s3.js file controllers ke bahar hai to '../s3' path aayega.
const { s3 } = require('../s3');

// --- CHANGE 2: PURANA, GALAT S3 CLIENT HATA DIYA GAYA HAI ---
// const s3 = new S3Client({ ... }); // <-- Yeh line ab yahan nahi hai.

// Helper function to format response with full URL
const formatCategoryResponse = (category) => {
    if (!category) return null;
    const categoryObject = category.toObject();
    if (categoryObject.image) {
        categoryObject.image = `${process.env.DO_SPACES_URL}/${categoryObject.image}`;
    }
    return categoryObject;
};

// Create a new category
exports.createCategory = async (req, res) => {
    const { name } = req.body;
    
    if (!req.file) return res.status(400).json({ error: 'Image is required' });

    try {
        const imageKey = `options-categories/${uuidv4()}_${req.file.originalname}`;
        const params = { Bucket: process.env.UPLOADSIMAGEBUCKET, Key: imageKey, Body: req.file.buffer, ContentType: req.file.mimetype, ACL: 'public-read' };
        await s3.send(new PutObjectCommand(params));
        
        const _id = new mongoose.Types.ObjectId();
        const newCategory = new Category({ _id, name, image: imageKey });
        await newCategory.save();
        
        const responseCategory = formatCategoryResponse(newCategory);
        res.status(201).json(responseCategory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all categories
exports.getCategories = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const filter = search ? { name: { $regex: search, $options: 'i' } } : {};
        const skip = (page - 1) * limit;

        const categories = await Category.find(filter).skip(skip).limit(Number(limit));
        const totalCategories = await Category.countDocuments(filter);
        
        const categoriesWithUrls = categories.map(cat => formatCategoryResponse(cat));

        res.status(200).json({
            categories: categoriesWithUrls,
            currentPage: Number(page),
            totalPages: Math.ceil(totalCategories / limit),
            totalCategories
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ error: 'Category not found' });
        
        const responseCategory = formatCategoryResponse(category);
        res.status(200).json(responseCategory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a category by ID
exports.updateCategoryById = async (req, res) => {
    const { name } = req.body;

    try {
        const updateData = { name };
        
        if (req.file) {
            const imageKey = `options-categories/${uuidv4()}_${req.file.originalname}`;
            const params = { Bucket: process.env.UPLOADSIMAGEBUCKET, Key: imageKey, Body: req.file.buffer, ContentType: req.file.mimetype, ACL: 'public-read' };
            await s3.send(new PutObjectCommand(params));
            updateData.image = imageKey;
        } else if (req.body.image) {
            updateData.image = req.body.image.startsWith('http') ? req.body.image.split(process.env.DO_SPACES_URL + '/')[1] : req.body.image;
        }

        const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!category) return res.status(404).json({ error: 'Category not found' });
        
        const responseCategory = formatCategoryResponse(category);
        res.status(200).json(responseCategory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a category by ID
exports.deleteCategoryById = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ error: 'Category not found' });
        res.status(200).json({ message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};