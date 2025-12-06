// const Achivers = require('../models/achiversModel');
// const { v4: uuidv4 } = require('uuid');
// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
// const achiversCounter = require('../models/achiversCounter');
// const Category = require('../models/achiversCategoryModels');

// // Helper function to get the next sequence value
// const getNextAchiversSequenceValue = async (sequenceName) => {
//   const counter = await achiversCounter.findByIdAndUpdate(
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

// exports.createAchivers = async (req, res) => {
//   const { title, category, description, city } = req.body;
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
//     const id = await getNextAchiversSequenceValue('achiversId');
//     const date = new Date(); // Get current date
  

//     let newachivers = new Achivers({ id, title, image: imageKey, category, description, date, city });
//     newachivers = await newachivers.save();

//     // Manually lookup category details
//     const categoryDetails = await Category.findOne({ id: newachivers.category });
//     const response = {
//       ...newachivers.toObject(),
//       category: {
//         id: categoryDetails.id,
//         name: categoryDetails.name,
//         image: categoryDetails.image,
//       },
//     };

//     res.status(201).json(response);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// exports.getAchivers = async (req, res) => {
//     try {
//       const { page = 1, limit = 10, search = '' } = req.query;
//       const filter = search ? { title: { $regex: search, $options: 'i' } } : {};
//       const skip = (page - 1) * limit;
  
//       const achiversList = await Achivers.find(filter).skip(skip).limit(Number(limit));
//       const totalachivers = await Achivers.countDocuments(filter);
  
//       // Manually lookup category details for each achivers item
//       const populatedachiversList = await Promise.all(achiversList.map(async (achiversItem) => {
//         const categoryDetails = await Category.findOne({ id: achiversItem.category });
//         return {
//           ...achiversItem.toObject(),
//           category: {
//             id: categoryDetails.id,
//             name: categoryDetails.name,
//             image: categoryDetails.image,
//           },
//         };
//       }));
  
//       res.status(200).json({
//         achivers: populatedachiversList,
//         currentPage: Number(page),
//         totalPages: Math.ceil(totalachivers / limit),
//         totalachivers,
//       });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   };
  

//   exports.getAchiversById = async (req, res) => {
//     try {
//       const achivers = await Achivers.findOne({ id: req.params.id });
  
//       if (!achivers) {
//         return res.status(404).json({ error: 'achivers not found' });
//       }
  
//       // Manually lookup category details
//       const categoryDetails = await Category.findOne({ id: achivers.category });
//       const response = {
//         ...achivers.toObject(),
//         category: {
//           id: categoryDetails.id,
//           name: categoryDetails.name,
//           image: categoryDetails.image,
//         },
//       };
  
//       res.status(200).json(response);
//     } catch (err) {
//       res.status (500).json({ error: err.message });
//     }
//   };

// // Update achivers by ID
// exports.updateAchiversById = async (req, res) => {
//   const { title, category, description, city } = req.body;
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
//     const achivers = await Achivers.findOne({ id: req.params.id });

//     if (!achivers) {
//       return res.status(404).json({ error: 'achivers not found' });
//     }

//     // If category is not provided in the request body, use the existing category
//     const categoryId = category ? Number(category) : achivers.category;

//     if (isNaN(categoryId)) {
//       return res.status(400).json({ error: 'Invalid category ID' });
//     }

//     const updatedFields = {};
//     if (title) updatedFields.title = title;
//     if (image) updatedFields.image = image;
//     if (description) updatedFields.description = description;
//     if (city) updatedFields.city = city;
//     updatedFields.category = categoryId;

//     const updatedachivers = await Achivers.findOneAndUpdate(
//       { id: req.params.id },
//       updatedFields,
//       { new: true }
//     );

//     // Manually lookup category details
//     const categoryDetails = await Category.findOne({ id: updatedachivers.category });
//     if (!categoryDetails) {
//       return res.status(400).json({ error: 'Invalid category ID' });
//     }

//     const response = {
//       ...updatedachivers.toObject(),
//       category: {
//         id: categoryDetails.id,
//         name: categoryDetails.name,
//         image: categoryDetails.image,
//       },
//     };

//     res.status(200).json(response);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
  
  
//   exports.deleteAchiversById = async (req, res) => {
//     try {
//       const achivers = await Achivers.findOneAndDelete({ id: req.params.id });
  
//       if (!achivers) {
//         return res.status(404).json({ error: 'achivers not found' });
//       }
  
//       res.status(200).json({ message: 'achivers deleted' });
//     } catch (err) {
//       res.status (500).json({ error: err.message });
//     }
//   };
    

// controllers/achiversController.js

const Achivers = require('../models/achiversModel');
const { v4: uuidv4 } = require('uuid');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const achiversCounter = require('../models/achiversCounter');
const Category = require('../models/achiversCategoryModels');

// --- CHANGE 1: SAHI S3 CLIENT KO IMPORT KAREIN ---
// Path check karein. Agar s3.js file controllers ke bahar hai to '../s3' path aayega.
const { s3 } = require('../s3');

// Helper function to get the next sequence value
const getNextAchiversSequenceValue = async (sequenceName) => {
    const counter = await achiversCounter.findByIdAndUpdate(
        sequenceName,
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return counter.seq;
};

// --- CHANGE 2: PURANA, GALAT S3 CLIENT HATA DIYA GAYA HAI ---
// const s3 = new S3Client({ ... }); // <-- Yeh line ab yahan nahi hai.

exports.createAchivers = async (req, res) => {
    const { title, category, description, city } = req.body;
    let imageKey = null;

    if (!req.file) {
        return res.status(400).json({ error: 'Image is required' });
    }

    try {
        // Files ko ek 'achievers' folder mein organize karein
        imageKey = `achievers/${uuidv4()}_${req.file.originalname}`;
        const params = {
            Bucket: process.env.UPLOADSIMAGEBUCKET,
            Key: imageKey,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
            ACL: 'public-read' // Public access ke liye
        };

        // Sahi S3 client ka istemal
        await s3.send(new PutObjectCommand(params));
        
        const id = await getNextAchiversSequenceValue('achiversId');
        const date = new Date(); // Get current date

        // Database mein abhi bhi sirf key hi save ho rahi hai
        let newachivers = new Achivers({ id, title, image: imageKey, category, description, date, city });
        newachivers = await newachivers.save();

        const categoryDetails = await Category.findOne({ id: newachivers.category });
        
        // --- RESPONSE MEIN URL BANANE KA LOGIC ---
        const responseAchiver = newachivers.toObject();
        if (responseAchiver.image) {
            responseAchiver.image = `${process.env.DO_SPACES_URL}/${responseAchiver.image}`;
        }
        if (categoryDetails && categoryDetails.image) {
            categoryDetails.image = `${process.env.DO_SPACES_URL}/${categoryDetails.image}`;
        }

        const response = {
            ...responseAchiver,
            category: categoryDetails ? {
                id: categoryDetails.id,
                name: categoryDetails.name,
                image: categoryDetails.image,
            } : null,
        };

        res.status(201).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAchivers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const filter = search ? { title: { $regex: search, $options: 'i' } } : {};
        const skip = (page - 1) * limit;

        const achiversList = await Achivers.find(filter).skip(skip).limit(Number(limit));
        const totalachivers = await Achivers.countDocuments(filter);

        // --- RESPONSE MEIN URL BANANE KA LOGIC ---
        const populatedachiversList = await Promise.all(achiversList.map(async (achiversItem) => {
            const categoryDetails = await Category.findOne({ id: achiversItem.category });
            
            const achiverObject = achiversItem.toObject();
            if (achiverObject.image) {
                achiverObject.image = `${process.env.DO_SPACES_URL}/${achiverObject.image}`;
            }
            if (categoryDetails && categoryDetails.image) {
                categoryDetails.image = `${process.env.DO_SPACES_URL}/${categoryDetails.image}`;
            }

            return {
                ...achiverObject,
                category: categoryDetails ? {
                    id: categoryDetails.id,
                    name: categoryDetails.name,
                    image: categoryDetails.image,
                } : null,
            };
        }));

        res.status(200).json({
            achivers: populatedachiversList,
            currentPage: Number(page),
            totalPages: Math.ceil(totalachivers / limit),
            totalachivers,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAchiversById = async (req, res) => {
    try {
        const achivers = await Achivers.findOne({ id: req.params.id });

        if (!achivers) {
            return res.status(404).json({ error: 'achivers not found' });
        }

        const categoryDetails = await Category.findOne({ id: achivers.category });
        
        // --- RESPONSE MEIN URL BANANE KA LOGIC ---
        const responseAchiver = achivers.toObject();
        if (responseAchiver.image) {
            responseAchiver.image = `${process.env.DO_SPACES_URL}/${responseAchiver.image}`;
        }
        if (categoryDetails && categoryDetails.image) {
            categoryDetails.image = `${process.env.DO_SPACES_URL}/${categoryDetails.image}`;
        }

        const response = {
            ...responseAchiver,
            category: categoryDetails ? {
                id: categoryDetails.id,
                name: categoryDetails.name,
                image: categoryDetails.image,
            } : null,
        };

        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateAchiversById = async (req, res) => {
    const { title, category, description, city } = req.body;
    let image = req.body.image;

    try {
        if (req.file) {
            const imageKey = `achievers/${uuidv4()}_${req.file.originalname}`;
            const params = {
                Bucket: process.env.UPLOADSIMAGEBUCKET,
                Key: imageKey,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
                ACL: 'public-read'
            };
            await s3.send(new PutObjectCommand(params));
            image = imageKey;
        }

        const achivers = await Achivers.findOne({ id: req.params.id });

        if (!achivers) {
            return res.status(404).json({ error: 'achivers not found' });
        }

        const categoryId = category ? Number(category) : achivers.category;

        if (isNaN(categoryId)) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }

        const updatedFields = {};
        if (title) updatedFields.title = title;
        if (image) updatedFields.image = image;
        if (description) updatedFields.description = description;
        if (city) updatedFields.city = city;
        updatedFields.category = categoryId;

        const updatedachivers = await Achivers.findOneAndUpdate(
            { id: req.params.id },
            updatedFields,
            { new: true }
        );

        const categoryDetails = await Category.findOne({ id: updatedachivers.category });
        if (!categoryDetails) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }

        // --- RESPONSE MEIN URL BANANE KA LOGIC ---
        const responseAchiver = updatedachivers.toObject();
        if (responseAchiver.image && !responseAchiver.image.startsWith('http')) {
             responseAchiver.image = `${process.env.DO_SPACES_URL}/${responseAchiver.image}`;
        }
        if (categoryDetails.image && !categoryDetails.image.startsWith('http')) {
            categoryDetails.image = `${process.env.DO_SPACES_URL}/${categoryDetails.image}`;
        }

        const response = {
            ...responseAchiver,
            category: {
                id: categoryDetails.id,
                name: categoryDetails.name,
                image: categoryDetails.image,
            },
        };

        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteAchiversById = async (req, res) => {
    try {
        const achivers = await Achivers.findOneAndDelete({ id: req.params.id });

        if (!achivers) {
            return res.status(404).json({ error: 'achivers not found' });
        }

        res.status(200).json({ message: 'achivers deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};