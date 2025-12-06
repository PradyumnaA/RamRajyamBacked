// // controllers/VaratController.js

// const Varat = require('../models/vratModel');
// const { v4: uuidv4 } = require('uuid');
// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
// const VaratCounter = require('../models/vratCounter');
// const Category = require('../models/vratSubCategoryModel');
// const SubCategory = require('../models/vratSubSubCategoryModel');
// const User = require('../models/userModels');

// // Helper function to get the next sequence value
// const getNextVaratSequenceValue = async (sequenceName) => {
//   const counter = await VaratCounter.findByIdAndUpdate(
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
// exports.createVarat = async (req, res) => {
//   const { title, category, subcategory, description } = req.body;
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
//     const id = await getNextVaratSequenceValue('VaratId');
//     let newVarat = new Varat({
//       id,
//       title,
//       image: imageKey,
//       category,
//       subcategory,
//       description,
//     });
//     newVarat = await newVarat.save();

//     // Manually lookup category and subcategory details if they exist
//     const categoryDetails = category ? await Category.findOne({ id: newVarat.category }) : null;
//     const subcategoryDetails = subcategory ? await SubCategory.findOne({ id: newVarat.subcategory }) : null;
    
//     const response = {
//       ...newVarat.toObject(),
//       category: categoryDetails ? {
//         id: categoryDetails.id,
//         name: categoryDetails.name,
//         image: categoryDetails.image,
//       } : null,
//       subcategory: subcategoryDetails ? {
//         id: subcategoryDetails.id,
//         name: subcategoryDetails.name,
//         image: subcategoryDetails.image,
//       } : null,
//     };

//     res.status(201).json(response);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getVarat = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search = '' } = req.query;
//     const filter = search ? { title: { $regex: search, $options: 'i' } } : {};
//     const skip = (page - 1) * limit;

//     const VaratList = await Varat.find(filter).skip(skip).limit(Number(limit));
//     const totalVarat = await Varat.countDocuments(filter);

//     // Manually lookup category and subcategory details for each event item
//     const populatedVaratList = await Promise.all(VaratList.map(async (VaratItem) => {
//       const categoryDetails = VaratItem.category ? await Category.findOne({ id: VaratItem.category }) : null;
//       const subcategoryDetails = VaratItem.subcategory ? await SubCategory.findOne({ id: VaratItem.subcategory }) : null;

//       // Fetch registered user details
//       const registeredUser = await User.findOne({ id: VaratItem.registeredUserId });

//       return {
//         ...VaratItem.toObject(),
//         category: categoryDetails ? {
//           id: categoryDetails.id,
//           name: categoryDetails.name,
//           image: categoryDetails.image,
//         } : null,
//         subcategory: subcategoryDetails ? {
//           id: subcategoryDetails.id,
//           name: subcategoryDetails.name,
//           image: subcategoryDetails.image,
//         } : null,
//         registeredUser: registeredUser ? registeredUser.toObject() : null,
//       };
//     }));

//     res.status(200).json({
//       Varat: populatedVaratList,
//       currentPage: Number(page),
//       totalPages: Math.ceil(totalVarat / limit),
//       totalVarat,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// exports.getVaratById = async (req, res) => {
//   try {
//     const varat = await Varat.findOne({ id: req.params.id });

//     if (!varat) {
//       return res.status(404).json({ error: 'Varat not found' });
//     }

//     // Manually lookup category and subcategory details if they exist
//     const categoryDetails = varat.category ? await Category.findOne({ id: varat.category }) : null;
//     const subcategoryDetails = varat.subcategory ? await SubCategory.findOne({ id: varat.subcategory }) : null;
    
//     const response = {
//       ...varat.toObject(),
//       category: categoryDetails ? {
//         id: categoryDetails.id,
//         name: categoryDetails.name,
//         image: categoryDetails.image,
//       } : null,
//       subcategory: subcategoryDetails ? {
//         id: subcategoryDetails.id,
//         name: subcategoryDetails.name,
//         image: subcategoryDetails.image,
//       } : null,
//     };

//     res.status(200).json(response);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// exports.updateVaratById = async (req, res) => {
//   const { title, category, subcategory, description } = req.body;
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
//     const varat = await Varat.findOne({ id: req.params.id });

//     if (!varat) {
//       return res.status(404).json({ error: 'Varat not found' });
//     }

//     // If category or subcategory is not provided in the request body, use the existing ones
//     const categoryId = category ? Number(category) : varat.category;
//     const subcategoryId = subcategory ? Number(subcategory) : varat.subcategory;

//     const updatedFields = {};
//     if (title) updatedFields.title = title;
//     if (image) updatedFields.image = image;
//     if (description) updatedFields.description = description;
//     if (category) updatedFields.category = categoryId;
//     if (subcategory) updatedFields.subcategory = subcategoryId;

//     const updatedVarat = await Varat.findOneAndUpdate(
//       { id: req.params.id },
//       updatedFields,
//       { new: true }
//     );

//     // Manually lookup category and subcategory details if they exist
//     const categoryDetails = updatedVarat.category ? await Category.findOne({ id: updatedVarat.category }) : null;
//     const subcategoryDetails = updatedVarat.subcategory ? await SubCategory.findOne({ id: updatedVarat.subcategory }) : null;
    
//     const response = {
//       ...updatedVarat.toObject(),
//       category: categoryDetails ? {
//         id: categoryDetails.id,
//         name: categoryDetails.name,
//         image: categoryDetails.image,
//       } : null,
//       subcategory: subcategoryDetails ? {
//         id: subcategoryDetails.id,
//         name: subcategoryDetails.name,
//         image: subcategoryDetails.image,
//       } : null,
//     };

//     res.status(200).json(response);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// exports.deleteVaratById = async (req, res) => {
//   try {
//     const varat = await Varat.findOneAndDelete({ id: req.params.id });

//     if (!varat) {
//       return res.status(404).json({ error: 'Varat not found' });
//     }

//     res.status(200).json({ message: 'Varat deleted' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };



// controllers/vratController.js

const Varat = require('../models/vratModel');
const { v4: uuidv4 } = require('uuid');
const VaratCounter = require('../models/vratCounter');
const Category = require('../models/vratSubCategoryModel');
const SubCategory = require('../models/vratSubSubCategoryModel');
const User = require('../models/userModels');
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
    
    // Convert Varat image to full URL
    if (varatObject.image) {
        varatObject.image = `${process.env.DO_SPACES_URL}/${varatObject.image}`;
    }

    // Format category details with full URL
    if (varat.category) {
        const categoryDetails = await Category.findOne({ id: varat.category });
        if (categoryDetails) {
            varatObject.category = categoryDetails.toObject();
            if (varatObject.category.image) {
                varatObject.category.image = `${process.env.DO_SPACES_URL}/${varatObject.category.image}`;
            }
        }
    }

    // Format subcategory details with full URL
    if (varat.subcategory) {
        const subcategoryDetails = await SubCategory.findOne({ id: varat.subcategory });
        if (subcategoryDetails) {
            varatObject.subcategory = subcategoryDetails.toObject();
            if (varatObject.subcategory.image) {
                varatObject.subcategory.image = `${process.env.DO_SPACES_URL}/${varatObject.subcategory.image}`;
            }
        }
    }
    
    return varatObject;
};

exports.createVarat = async (req, res) => {
    const { title, category, subcategory, description } = req.body;
    
    if (!req.file) return res.status(400).json({ error: 'Image is required' });

    try {
        const imageKey = `vrats/${uuidv4()}_${req.file.originalname}`;
        const params = { Bucket: process.env.UPLOADSIMAGEBUCKET, Key: imageKey, Body: req.file.buffer, ContentType: req.file.mimetype, ACL: 'public-read' };
        await s3.send(new PutObjectCommand(params));

        const id = await getNextVaratSequenceValue('VaratId');
        let newVarat = new Varat({
            id, title, image: imageKey, category, subcategory, description,
        });
        
        await newVarat.save();
        
        const response = await formatVaratResponse(newVarat);
        res.status(201).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getVarat = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const filter = search ? { title: { $regex: search, $options: 'i' } } : {};
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
    const { title, category, subcategory, description } = req.body;
    
    try {
        const varat = await Varat.findOne({ id: req.params.id });
        if (!varat) return res.status(404).json({ error: 'Varat not found' });

        const updatedFields = {};
        if (title) updatedFields.title = title;
        if (description) updatedFields.description = description;
        if (category) updatedFields.category = Number(category);
        if (subcategory) updatedFields.subcategory = Number(subcategory);

        if (req.file) {
            const imageKey = `vrats/${uuidv4()}_${req.file.originalname}`;
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