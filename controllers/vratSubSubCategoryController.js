// const Varat = require('../models/vratSubSubCategoryModel');
// const { v4: uuidv4 } = require('uuid');
// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
// const VaratCounter = require('../models/vratSubSubCategoryCounter');
// const Category = require('../models/vratSubCategoryModel');
// const User = require('../models/userModels');
// // Helper function to get the next sequence value
// const getNextVaratSequenceValue = async (sequenceName) => {
//     const counter = await VaratCounter.findByIdAndUpdate(
//       sequenceName,
//       { $inc: { seq: 1 } },
//       { new: true, upsert: true }
//     );
//     return counter.seq;
//   };
//   const s3 = new S3Client({
//     region: process.env.AWS_REGION,
//     credentials: {
//       accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     },
//   });
//   exports.createVarat = async (req, res) => {
//     const { name, category } = req.body;
//     const imageKey = req.file ? `${uuidv4()}_${req.file.originalname}` : null; // Generate a unique key for the image

//     if (!imageKey) {
//       return res.status(400).json({ error: 'Image is required' });
//     }
  
//     try {
//       const params = {
//         Bucket: process.env.UPLOADSIMAGEBUCKET,
//         Key: imageKey,
//         Body: req.file.buffer,
//         ContentType: req.file.mimetype,
//       };
//       const data = await s3.send(new PutObjectCommand(params)); // Ensure correct usage of PutObjectCommand
//       console.log('Successfully uploaded file:', data);
//       const id = await getNextVaratSequenceValue('VaratId');
  
//       let categoryDetails = null;
//       if (category) {
//         categoryDetails = await Category.findOne({ id: category });
  
//         if (!categoryDetails) {
//           return res.status(400).json({ error: 'Category not found' });
//         }
//       }
  
//       const newVarat = new Varat({
//         id,
//         name,
//         image: imageKey,
//         category: categoryDetails ? categoryDetails.id : null,
//       });
  
//       const savedVarat = await newVarat.save();
  
//       const response = {
//         id: savedVarat.id,
//         name: savedVarat.name,
//         image: savedVarat.image,
//         category: categoryDetails ? {
//           id: categoryDetails.id,
//           name: categoryDetails.name,
//           image: categoryDetails.image,
//         } : null,
//       };
  
//       res.status(201).json(response);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   };
  
  
  
  
  
//   exports.getVarat = async (req, res) => {
//     try {
//       const { page = 1, limit = 10, search = '' } = req.query;
//       const filter = search ? { name: { $regex: search, $options: 'i' } } : {};
//       const skip = (page - 1) * limit;
  
//       const VaratList = await Varat.find(filter).skip(skip).limit(Number(limit));
//       const totalVarat = await Varat.countDocuments(filter);
  
//       // Manually lookup category details for each event item
//       const populatedVaratList = await Promise.all(VaratList.map(async (VaratItem) => {
//         const categoryDetails = await Category.findOne({ id: VaratItem.category });
  
//         // Fetch registered user details
//         const registeredUser = await User.findOne({ id: VaratItem.registeredUserId });
  
//         return {
//           ...VaratItem.toObject(),
//           category: categoryDetails ? {
//             id: categoryDetails.id,
//             name: categoryDetails.name,
//             image: categoryDetails.image,
//           } : null,
//           registeredUser: registeredUser ? registeredUser.toObject() : null,
//         };
//       }));
  
//       res.status(200).json({
//         Varat: populatedVaratList,
//         currentPage: Number(page),
//         totalPages: Math.ceil(totalVarat / limit),
//         totalVarat,
//       });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   };
  
//   exports.getVaratById = async (req, res) => {
//     try {
//       const varat = await Varat.findOne({ id: req.params.id });
  
//       if (!varat) {
//         return res.status(404).json({ error: 'Varat not found' });
//       }
  
//       // Manually lookup category details
//       const categoryDetails = await Category.findOne({ id: varat.category });
//       const response = {
//         ...varat.toObject(),
//         category: {
//           id: categoryDetails.id,
//           name: categoryDetails.name,
//           image: categoryDetails.image,
//         },
//       };
  
//       res.status(200).json(response);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   };
  
//   exports.updateVaratById = async (req, res) => {
//     const { name, category } = req.body;
//     let image = req.body.image; 
  
//     try {
//       if (req.file) {
//         const imageKey = `${uuidv4()}_${req.file.originalname}`;
//         const params = {
//             Bucket: process.env.UPLOADSIMAGEBUCKET,
//             Key: imageKey,
//             Body: req.file.buffer,
//             ContentType: req.file.mimetype,
//         };
//         const data = await s3.send(new PutObjectCommand(params));
//         console.log('Successfully uploaded file:', data);
//         image = imageKey; // Update image to new key or URL
//     }
//       const varat = await Varat.findOne({ id: req.params.id });
  
//       if (!varat) {
//         return res.status(404).json({ error: 'Varat not found' });
//       }
  
//       const updatedFields = {};
//       if (name) updatedFields.name = name;
//       if (image) updatedFields.image = image;
  
//       if (category) {
//         const categoryDetails = await Category.findOne({ id: category });
  
//         if (!categoryDetails) {
//           return res.status(400).json({ error: 'Category not found' });
//         }
  
//         updatedFields.category = categoryDetails.id;
//       } else {
//         updatedFields.category = varat.category;
//       }
  
//       const updatedVarat = await Varat.findOneAndUpdate(
//         { id: req.params.id },
//         updatedFields,
//         { new: true }
//       );
  
//       const categoryDetails = updatedFields.category ? await Category.findOne({ id: updatedFields.category }) : null;
  
//       const response = {
//         ...updatedVarat.toObject(),
//         category: categoryDetails ? {
//           id: categoryDetails.id,
//           name: categoryDetails.name,
//           image: categoryDetails.image,
//         } : null,
//       };
  
//       res.status(200).json(response);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   };
  
  
//   exports.deleteVaratById = async (req, res) => {
//     try {
//       const varat = await Varat.findOneAndDelete({ id: req.params.id });
  
//       if (!varat) {
//         return res.status(404).json({ error: 'Varat not found' });
//       }
  
//       res.status(200).json({ message: 'Varat deleted' });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   };
  

// controllers/vratSubSubCategoryController.js

const Varat = require('../models/vratSubSubCategoryModel');
const { v4: uuidv4 } = require('uuid');
const VaratCounter = require('../models/vratSubSubCategoryCounter');
const Category = require('../models/vratSubCategoryModel');
const { PutObjectCommand } = require('@aws-sdk/client-s3');

// --- CHANGE 1: SAHI S3 CLIENT KO IMPORT KAREIN ---
// Path check karein. Agar s3.js file controllers ke bahar hai to '../s3' path aayega.
const { s3 } = require('../s3');

// --- CHANGE 2: PURANA, GALAT S3 CLIENT HATA DIYA GAYA HAI ---
// const s3 = new S3Client({ ... }); // <-- Yeh line ab yahan nahi hai.

const getNextVaratSequenceValue = async (sequenceName) => {
    const counter = await VaratCounter.findByIdAndUpdate(sequenceName, { $inc: { seq: 1 } }, { new: true, upsert: true });
    return counter.seq;
};

// Helper function to format response with full URLs
const formatVaratResponse = async (varat) => {
    if (!varat) return null;
    const varatObject = varat.toObject();
    
    // Convert Varat SubSubCategory image to full URL
    if (varatObject.image) {
        varatObject.image = `${process.env.DO_SPACES_URL}/${varatObject.image}`;
    }

    // Format category (which is a SubCategory) details with full URL
    if (varat.category) {
        const categoryDetails = await Category.findOne({ id: varat.category });
        if (categoryDetails) {
            varatObject.category = categoryDetails.toObject();
            if (varatObject.category.image) {
                varatObject.category.image = `${process.env.DO_SPACES_URL}/${varatObject.category.image}`;
            }
        }
    }
    
    return varatObject;
};

exports.createVarat = async (req, res) => {
    const { name, category } = req.body;
    
    if (!req.file) return res.status(400).json({ error: 'Image is required' });

    try {
        let categoryDetails = null;
        if (category) {
            categoryDetails = await Category.findOne({ id: category });
            if (!categoryDetails) return res.status(400).json({ error: 'Parent SubCategory not found' });
        }

        const imageKey = `vrat-subsubcategories/${uuidv4()}_${req.file.originalname}`;
        const params = { Bucket: process.env.UPLOADSIMAGEBUCKET, Key: imageKey, Body: req.file.buffer, ContentType: req.file.mimetype, ACL: 'public-read' };
        await s3.send(new PutObjectCommand(params));
        
        const id = await getNextVaratSequenceValue('VaratId');
        
        const newVarat = new Varat({
            id, name, image: imageKey,
            category: categoryDetails ? categoryDetails.id : null,
        });

        const savedVarat = await newVarat.save();
        
        const response = await formatVaratResponse(savedVarat);
        res.status(201).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getVarat = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const filter = search ? { name: { $regex: search, $options: 'i' } } : {};
        const skip = (page - 1) * limit;

        const varatList = await Varat.find(filter).skip(skip).limit(Number(limit));
        const totalVarat = await Varat.countDocuments(filter);
        
        const populatedVaratList = await Promise.all(varatList.map(varatItem => formatVaratResponse(varatItem)));

        res.status(200).json({
            varat: populatedVaratList,
            currentPage: Number(page),
            totalPages: Math.ceil(totalVarat / limit),
            totalVarat,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getVaratById = async (req, res) => {
    try {
        const varat = await Varat.findOne({ id: req.params.id });
        if (!varat) return res.status(404).json({ error: 'Varat not found' });
        
        const response = await formatVaratResponse(varat);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateVaratById = async (req, res) => {
    const { name, category } = req.body;
    
    try {
        const varat = await Varat.findOne({ id: req.params.id });
        if (!varat) return res.status(404).json({ error: 'Varat not found' });

        const updatedFields = {};
        if (name) updatedFields.name = name;

        if (category) {
            const categoryDetails = await Category.findOne({ id: category });
            if (!categoryDetails) return res.status(400).json({ error: 'Parent SubCategory not found' });
            updatedFields.category = categoryDetails.id;
        }

        if (req.file) {
            const imageKey = `vrat-subsubcategories/${uuidv4()}_${req.file.originalname}`;
            const params = { Bucket: process.env.UPLOADSIMAGEBUCKET, Key: imageKey, Body: req.file.buffer, ContentType: req.file.mimetype, ACL: 'public-read' };
            await s3.send(new PutObjectCommand(params));
            updatedFields.image = imageKey;
        }

        const updatedVarat = await Varat.findOneAndUpdate({ id: req.params.id }, updatedFields, { new: true });
        
        const response = await formatVaratResponse(updatedVarat);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteVaratById = async (req, res) => {
    try {
        const varat = await Varat.findOneAndDelete({ id: req.params.id });
        if (!varat) return res.status(404).json({ error: 'Varat not found' });
        res.status(200).json({ message: 'Varat deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};