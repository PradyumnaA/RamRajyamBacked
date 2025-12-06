// const Category = require('../models/classifiedCategoryModels');
// const Counter = require('../models/classifiedCategoryCounter');
// const { v4: uuidv4 } = require('uuid');
// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// // Function to get the next sequence value for a given name
// const getNextSequence = async (name) => {
//   const counter = await Counter.findOneAndUpdate(
//     { name },
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
//   try {
//     const { name } = req.body;
//     const file = req.file;

//     if (!file) {
//       return res.status(400).json({ error: 'Image is required' });
//     }

//     const imageKey = `${uuidv4()}_${file.originalname}`;
//     const params = {
//       Bucket: process.env.UPLOADSIMAGEBUCKET,
//       Key: imageKey,
//       Body: file.buffer,
//       ContentType: file.mimetype,
//     };
//     await s3.send(new PutObjectCommand(params));

//     const id = await getNextSequence('categoryId');
//     const newCategory = new Category({ id, name, image: imageKey });
//     await newCategory.save();
//     res.status(201).json(newCategory);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Get all categories with optional search by name
// exports.getAllCategories = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search = '' } = req.query;

//     // Build the query object
//     let query = {};
//     if (search) {
//       query.name = { $regex: search, $options: 'i' };
//     }

//     // Get filtered and paginated categories
//     const categories = await Category.find(query)
//       .skip((page - 1) * limit)
//       .limit(limit);

//     // Get the total count of matched categories for pagination
//     const totalCategories = await Category.countDocuments(query);

//     res.status(200).json({
//       categories: categories,
//       currentPage: page,
//       totalPages: Math.ceil(totalCategories / limit),
//       totalCategories: totalCategories,
//     });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Get category by ID
// exports.getCategoryById = async (req, res) => {
//   try {
//     const category = await Category.findOne({ id: req.params.id });
//     if (!category) return res.status(404).json({ message: 'Category not found' });
//     res.status(200).json(category);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Update a category by ID
// exports.updateCategory = async (req, res) => {
//   try {
//     const { name } = req.body;
//     const file = req.file;
//     const updateData = { name };

//     if (file) {
//       const imageKey = `${uuidv4()}_${file.originalname}`;
//       const params = {
//         Bucket: process.env.UPLOADSIMAGEBUCKET,
//         Key: imageKey,
//         Body: file.buffer,
//         ContentType: file.mimetype,
//       };
//       await s3.send(new PutObjectCommand(params));
//       updateData.image = imageKey;
//     } else if (req.body.image) {
//       updateData.image = req.body.image;
//     }

//     const updatedCategory = await Category.findOneAndUpdate({ id: req.params.id }, updateData, { new: true });
//     if (!updatedCategory) return res.status(404).json({ message: 'Category not found' });
//     res.status(200).json(updatedCategory);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Delete a category by ID
// exports.deleteCategory = async (req, res) => {
//   try {
//     const deletedCategory = await Category.findOneAndDelete({ id: req.params.id });
//     if (!deletedCategory) return res.status(404).json({ message: 'Category not found' });
//     res.status(200).json({ message: 'Category deleted' });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };


// controllers/classifiedcategoryController.js

const Category = require('../models/classifiedCategoryModels');
const Counter = require('../models/classifiedCategoryCounter');
const { v4: uuidv4 } = require('uuid');
const { PutObjectCommand } = require('@aws-sdk/client-s3');

// --- CHANGE 1: SAHI S3 CLIENT KO IMPORT KAREIN ---
// Path check karein. Agar s3.js file controllers ke bahar hai to '../s3' path aayega.
const { s3 } = require('../s3');

// --- CHANGE 2: PURANA, GALAT S3 CLIENT HATA DIYA GAYA HAI ---
// const s3 = new S3Client({ ... }); // <-- Yeh line ab yahan nahi hai.

const getNextSequence = async (name) => {
    const counter = await Counter.findOneAndUpdate({ name }, { $inc: { seq: 1 } }, { new: true, upsert: true });
    return counter.seq;
};

// Helper function to format response with full URL
const formatCategoryResponse = (category) => {
    const categoryObject = category.toObject();
    if (categoryObject.image) {
        categoryObject.image = `${process.env.DO_SPACES_URL}/${categoryObject.image}`;
    }
    return categoryObject;
};

// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const file = req.file;
        if (!file) return res.status(400).json({ error: 'Image is required' });

        const imageKey = `classified-categories/${uuidv4()}_${file.originalname}`;
        const params = { Bucket: process.env.UPLOADSIMAGEBUCKET, Key: imageKey, Body: file.buffer, ContentType: file.mimetype, ACL: 'public-read' };
        await s3.send(new PutObjectCommand(params));

        const id = await getNextSequence('categoryId');
        const newCategory = new Category({ id, name, image: imageKey });
        await newCategory.save();
        
        const responseCategory = formatCategoryResponse(newCategory);
        res.status(201).json(responseCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all categories with optional search by name
exports.getAllCategories = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        let query = search ? { name: { $regex: search, $options: 'i' } } : {};
        
        const categories = await Category.find(query).skip((page - 1) * limit).limit(parseInt(limit));
        const totalCategories = await Category.countDocuments(query);
        
        const categoriesWithUrls = categories.map(cat => formatCategoryResponse(cat));

        res.status(200).json({
            categories: categoriesWithUrls,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalCategories / parseInt(limit)),
            totalCategories: totalCategories,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findOne({ id: req.params.id });
        if (!category) return res.status(404).json({ message: 'Category not found' });
        
        const responseCategory = formatCategoryResponse(category);
        res.status(200).json(responseCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a category by ID
exports.updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const file = req.file;
        const updateData = { name };

        if (file) {
            const imageKey = `classified-categories/${uuidv4()}_${file.originalname}`;
            const params = { Bucket: process.env.UPLOADSIMAGEBUCKET, Key: imageKey, Body: file.buffer, ContentType: file.mimetype, ACL: 'public-read' };
            await s3.send(new PutObjectCommand(params));
            updateData.image = imageKey;
        } else if (req.body.image) {
            updateData.image = req.body.image.startsWith('http') ? req.body.image.split(process.env.DO_SPACES_URL + '/')[1] : req.body.image;
        }

        const updatedCategory = await Category.findOneAndUpdate({ id: req.params.id }, updateData, { new: true });
        if (!updatedCategory) return res.status(404).json({ message: 'Category not found' });
        
        const responseCategory = formatCategoryResponse(updatedCategory);
        res.status(200).json(responseCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a category by ID
exports.deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await Category.findOneAndDelete({ id: req.params.id });
        if (!deletedCategory) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json({ message: 'Category deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};