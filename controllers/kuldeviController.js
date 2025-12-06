// const Kuldevi = require('../models/kuldeviModels');
// const { v4: uuidv4 } = require('uuid');
// const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
// const Category = require('../models/kuldeviCategoryModels');
// const path = require('path');
// const fs = require('fs');

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// // Create new kuldevi
// exports.createKuldevi = async (req, res) => {
//   const { title, description, city, state, category: categoryName } = req.body;
//   const imageKey = req.file ? `${uuidv4()}_${req.file.originalname}` : null; // Generate a unique key for the image

//   if (!imageKey) {
//     return res.status(400).json({ error: 'Image is required' });
//   }

//   try {
//     // Upload image to S3
//     const params = {
//       Bucket: process.env.UPLOADSIMAGEBUCKET,
//       Key: imageKey,
//       Body: req.file.buffer,
//       ContentType: req.file.mimetype,
//     };
//     const data = await s3.send(new PutObjectCommand(params));
//     console.log('Successfully uploaded file:', data);

//     // Check if category exists
//     const category = await Category.findOne({ name: categoryName });
//     if (!category) {
//       // Clean up the S3 bucket if the category is not valid
//       await s3.send(new DeleteObjectCommand({
//         Bucket: process.env.UPLOADSIMAGEBUCKET,
//         Key: imageKey,
//       }));
//       return res.status(400).json({ message: 'Invalid category' });
//     }

//     // Create and save new Kuldevi
//     const kuldevi = new Kuldevi({
//       title,
//       description,
//       image: imageKey,
//       city,
//       state,
//       category: category._id // Use ObjectId for category
//     });

//     const newKuldevi = await kuldevi.save();
//     res.status(201).json(newKuldevi);
//   } catch (err) {
//     // Delete the image from S3 if saving fails
//     if (imageKey) {
//       await s3.send(new DeleteObjectCommand({
//         Bucket: process.env.UPLOADSIMAGEBUCKET,
//         Key: imageKey,
//       }));
//     }
//     res.status(400).json({ message: err.message });
//   }
// };





// // Get all kuldevis with pagination and search
// exports.getAllKuldevis = async (req, res) => {
//   const { page = 1, limit = 10, search = '' } = req.query;

//   try {
//     const query = search ? { title: new RegExp(search, 'i') } : {};

//     const kuldevis = await Kuldevi.find(query)
//       .populate('category')
//       .skip((page - 1) * limit)
//       .limit(Number(limit));

//     const total = await Kuldevi.countDocuments(query);

//     res.json({
//       kuldevis,
//       total,
//       page: Number(page),
//       pages: Math.ceil(total / limit)
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };;

// // Get kuldevi by ID
// // Get kuldevi by ID
// exports.getKuldeviById = async (req, res) => {
//   try {
//     const kuldevi = await Kuldevi.findById(req.params.id).populate('category'); // Populate the category field
//     if (!kuldevi) return res.status(404).json({ message: 'Kuldevi not found' });

//     // Format the response to include the category details
//     const response = {
//       id: kuldevi.id,
//       title: kuldevi.title,
//       description: kuldevi.description,
//       image: kuldevi.image,
//       city: kuldevi.city,
//       state: kuldevi.state,
//       category: {
//         id: kuldevi.category.id,
//         name: kuldevi.category.name,
//         image: kuldevi.category.image,
//       },
//       createdAt: kuldevi.createdAt,
//     };

//     res.json(response);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };





// // Update kuldevi by ID
// // Update kuldevi by ID
// exports.updateKuldevi = async (req, res) => {
//   try {
//     const { title, description, city, state, category } = req.body;
//     let image = req.body.image;

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
//       image = imageKey;
//     }

//     const updatedFields = {
//       title,
//       description,
//       city,
//       state,
//       ...(image && { image }),
//     };

//     if (category) {
//       const categoryExists = await Category.findOne({ name: category });
//       if (!categoryExists) return res.status(400).json({ message: 'Invalid category' });
//       updatedFields.category = categoryExists._id;
//     }

//     const updatedKuldevi = await Kuldevi.findByIdAndUpdate(
//       req.params.id, // Use _id instead of custom id
//       { $set: updatedFields },
//       { new: true }
//     );

//     if (!updatedKuldevi) {
//       if (image) fs.unlinkSync(image);
//       return res.status(404).json({ message: 'Kuldevi not found' });
//     }

//     res.json(updatedKuldevi);
//   } catch (err) {
//     if (req.file) fs.unlinkSync(req.file.path);
//     res.status(400).json({ message: err.message });
//   }
// };

  

// // Delete kuldevi by ID
// // Delete kuldevi by ID
// exports.deleteKuldevi = async (req, res) => {
//   try {
//     const kuldevi = await Kuldevi.findByIdAndDelete(req.params.id); // Use findByIdAndDelete
//     if (!kuldevi) return res.status(404).json({ message: 'Kuldevi not found' });

//     // Delete the image from S3 if it exists
//     if (kuldevi.image) {
//       await s3.send(new DeleteObjectCommand({
//         Bucket: process.env.UPLOADSIMAGEBUCKET,
//         Key: kuldevi.image,
//       }));
//     }

//     res.json({ message: 'Kuldevi deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// controllers/kuldeviController.js

const Kuldevi = require('../models/kuldeviModels');
const { v4: uuidv4 } = require('uuid');
const Category = require('../models/kuldeviCategoryModels');
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

// --- CHANGE 1: SAHI S3 CLIENT KO IMPORT KAREIN ---
// Path check karein. Agar s3.js file controllers ke bahar hai to '../s3' path aayega.
const { s3 } = require('../s3');

// --- CHANGE 2: PURANA, GALAT S3 CLIENT HATA DIYA GAYA HAI ---
// const s3 = new S3Client({ ... }); // <-- Yeh line ab yahan nahi hai.

// Helper function to format response with full URLs
const formatKuldeviResponse = async (kuldevi) => {
    if (!kuldevi) return null;
    
    // Ensure category is populated before converting to object
    if (!kuldevi.populated('category')) {
      await kuldevi.populate('category');
    }

    const kuldeviObject = kuldevi.toObject();
    
    // Convert Kuldevi image key to full URL
    if (kuldeviObject.image) {
        kuldeviObject.image = `${process.env.DO_SPACES_URL}/${kuldeviObject.image}`;
    }

    // Format category details
    if (kuldeviObject.category) {
        if (kuldeviObject.category.image) {
            kuldeviObject.category.image = `${process.env.DO_SPACES_URL}/${kuldeviObject.category.image}`;
        }
    }
    
    return kuldeviObject;
};

// Create new kuldevi
exports.createKuldevi = async (req, res) => {
    const { title, description, city, state, category: categoryId } = req.body;
    
    if (!req.file) return res.status(400).json({ error: 'Image is required' });

    let imageKey;
    try {
        const category = await Category.findOne({ id: categoryId });
        if (!category) return res.status(400).json({ message: 'Invalid category ID' });

        imageKey = `kuldevis/${uuidv4()}_${req.file.originalname}`;
        const params = { Bucket: process.env.UPLOADSIMAGEBUCKET, Key: imageKey, Body: req.file.buffer, ContentType: req.file.mimetype, ACL: 'public-read' };
        await s3.send(new PutObjectCommand(params));

        const kuldevi = new Kuldevi({
            title, description, image: imageKey, city, state,
            category: category._id 
        });

        const newKuldevi = await kuldevi.save();
        const response = await formatKuldeviResponse(newKuldevi);
        res.status(201).json(response);
    } catch (err) {
        if (imageKey) {
            await s3.send(new DeleteObjectCommand({ Bucket: process.env.UPLOADSIMAGEBUCKET, Key: imageKey }));
        }
        res.status(400).json({ message: err.message });
    }
};

// Get all kuldevis with pagination and search
exports.getAllKuldevis = async (req, res) => {
    const { page = 1, limit = 10, search = '' } = req.query;

    try {
        const query = search ? { title: new RegExp(search, 'i') } : {};
        const kuldevis = await Kuldevi.find(query).populate('category').skip((page - 1) * limit).limit(Number(limit));
        const total = await Kuldevi.countDocuments(query);
        
        const response = await Promise.all(kuldevis.map(kuldevi => formatKuldeviResponse(kuldevi)));

        res.json({
            kuldevis: response,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get kuldevi by ID
exports.getKuldeviById = async (req, res) => {
    try {
        const kuldevi = await Kuldevi.findById(req.params.id).populate('category');
        if (!kuldevi) return res.status(404).json({ message: 'Kuldevi not found' });
        
        const response = await formatKuldeviResponse(kuldevi);
        res.json(response);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update kuldevi by ID
exports.updateKuldevi = async (req, res) => {
    try {
        const { title, description, city, state, category: categoryId } = req.body;
        
        const kuldevi = await Kuldevi.findById(req.params.id);
        if (!kuldevi) return res.status(404).json({ message: 'Kuldevi not found' });

        const updatedFields = { title, description, city, state };

        if (req.file) {
            const imageKey = `kuldevis/${uuidv4()}_${req.file.originalname}`;
            const params = { Bucket: process.env.UPLOADSIMAGEBUCKET, Key: imageKey, Body: req.file.buffer, ContentType: req.file.mimetype, ACL: 'public-read' };
            await s3.send(new PutObjectCommand(params));
            updatedFields.image = imageKey;
        }

        if (categoryId) {
            const categoryExists = await Category.findOne({ id: categoryId });
            if (!categoryExists) return res.status(400).json({ message: 'Invalid category' });
            updatedFields.category = categoryExists._id;
        }

        const updatedKuldevi = await Kuldevi.findByIdAndUpdate(req.params.id, { $set: updatedFields }, { new: true });

        const response = await formatKuldeviResponse(updatedKuldevi);
        res.json(response);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete kuldevi by ID
exports.deleteKuldevi = async (req, res) => {
    try {
        const kuldevi = await Kuldevi.findByIdAndDelete(req.params.id);
        if (!kuldevi) return res.status(404).json({ message: 'Kuldevi not found' });

        if (kuldevi.image) {
            await s3.send(new DeleteObjectCommand({ Bucket: process.env.UPLOADSIMAGEBUCKET, Key: kuldevi.image }));
        }

        res.json({ message: 'Kuldevi deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};