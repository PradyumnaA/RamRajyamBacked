// const Category = require('../models/achiversCategoryModels');
// const { v4: uuidv4 } = require('uuid');
// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
// const Counter = require('../models/achiversCategoryCounter');
// const path = require('path');

// // Helper function to get the next sequence value
// const getNextSequenceValue = async (sequenceName) => {
//   const counter = await Counter.findByIdAndUpdate(
//     sequenceName,
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
//     const id = await getNextSequenceValue('categoryId');
//     const newCategory = new Category({ id, name, image: imageKey });
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
//     const category = await Category.findOne({ id: req.params.id });
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
//           Bucket: process.env.UPLOADSIMAGEBUCKET,
//           Key: imageKey,
//           Body: req.file.buffer,
//           ContentType: req.file.mimetype,
//       };
//       const data = await s3.send(new PutObjectCommand(params));
//       console.log('Successfully uploaded file:', data);
//       image = imageKey; // Update image to new key or URL
//   }
//     const category = await Category.findOneAndUpdate(
//       { id: req.params.id },
//       { name, image },
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
//     const category = await Category.findOneAndDelete({ id: req.params.id });
//     if (!category) {
//       return res.status(404).json({ error: 'Category not found' });
//     }
//     res.status(200).json({ message: 'Category deleted' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// controllers/achieversCategoryController.js

const Category = require('../models/achiversCategoryModels');
const { v4: uuidv4 } = require('uuid');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const Counter = require('../models/achiversCategoryCounter');

// --- CHANGE 1: SAHI S3 CLIENT KO IMPORT KAREIN ---
// Path check karein. Agar s3.js file controllers ke bahar hai to '../s3' path aayega.
const { s3 } = require('../s3');

// Helper function to get the next sequence value
const getNextSequenceValue = async (sequenceName) => {
    const counter = await Counter.findByIdAndUpdate(
        sequenceName,
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return counter.seq;
};

// --- CHANGE 2: PURANA, GALAT S3 CLIENT HATA DIYA GAYA HAI ---
// const s3 = new S3Client({ ... }); // <-- Yeh line ab yahan nahi hai.

// Create a new category
exports.createCategory = async (req, res) => {
    const { name } = req.body;
    let imageKey = null;

    if (!req.file) {
        return res.status(400).json({ error: 'Image is required' });
    }

    try {
        // Files ko ek 'achievers-category' folder mein organize karein
        imageKey = `achievers-category/${uuidv4()}_${req.file.originalname}`;
        const params = {
            Bucket: process.env.UPLOADSIMAGEBUCKET,
            Key: imageKey,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
            ACL: 'public-read' // Public access ke liye
        };

        // Sahi S3 client ka istemal
        await s3.send(new PutObjectCommand(params));
        
        const id = await getNextSequenceValue('categoryId');
        // Database mein abhi bhi sirf key hi save ho rahi hai
        const newCategory = new Category({ id, name, image: imageKey });
        await newCategory.save();
        
        // --- RESPONSE MEIN URL BANANE KA LOGIC ---
        const responseCategory = newCategory.toObject();
        if (responseCategory.image) {
            responseCategory.image = `${process.env.DO_SPACES_URL}/${responseCategory.image}`;
        }

        res.status(201).json(responseCategory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all categories (Now returns full URLs)
exports.getCategories = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const filter = search ? { name: { $regex: search, $options: 'i' } } : {};
        const skip = (page - 1) * limit;

        const categories = await Category.find(filter).skip(skip).limit(Number(limit));
        const totalCategories = await Category.countDocuments(filter);
        
        // --- RESPONSE MEIN URL BANANE KA LOGIC ---
        const categoriesWithUrls = categories.map(cat => {
            const catObject = cat.toObject();
            if (catObject.image) {
                catObject.image = `${process.env.DO_SPACES_URL}/${catObject.image}`;
            }
            return catObject;
        });

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

// Get a category by ID (Now returns full URL)
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findOne({ id: req.params.id });
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        // --- RESPONSE MEIN URL BANANE KA LOGIC ---
        const responseCategory = category.toObject();
        if (responseCategory.image) {
            responseCategory.image = `${process.env.DO_SPACES_URL}/${responseCategory.image}`;
        }

        res.status(200).json(responseCategory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a category by ID (Now returns full URL)
exports.updateCategoryById = async (req, res) => {
    const { name } = req.body;
    let image = req.body.image;

    try {
        if (req.file) {
            const imageKey = `achievers-category/${uuidv4()}_${req.file.originalname}`;
            const params = {
                Bucket: process.env.UPLOADSIMAGEBUCKET,
                Key: imageKey,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
                ACL: 'public-read' // Public access ke liye
            };
            await s3.send(new PutObjectCommand(params));
            image = imageKey; // Nayi key ko update ke liye set karein
        }

        const category = await Category.findOneAndUpdate(
            { id: req.params.id },
            { name, image },
            { new: true }
        );
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        // --- RESPONSE MEIN URL BANANE KA LOGIC ---
        const responseCategory = category.toObject();
        if (responseCategory.image && !responseCategory.image.startsWith('http')) {
            responseCategory.image = `${process.env.DO_SPACES_URL}/${responseCategory.image}`;
        }

        res.status(200).json(responseCategory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a category by ID (Functionality is unchanged)
exports.deleteCategoryById = async (req, res) => {
    try {
        const category = await Category.findOneAndDelete({ id: req.params.id });
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};