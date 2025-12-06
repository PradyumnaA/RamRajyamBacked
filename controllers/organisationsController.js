// const Organisation = require('../models/organisationsModel');
// const { v4: uuidv4 } = require('uuid');
// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
// const OrganisationCounter = require('../models/organisationsCounter');
// const s3 = new S3Client({
//     region: process.env.AWS_REGION,
//     credentials: {
//       accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     },
//   });
// // Create a new organisation
// exports.createOrganisation = async (req, res) => {
//     try {
//         const files = req.files;

//         if (!files || files.length === 0) {
//           return res.status(400).json({ error: 'Images are required' });
//         }
//          // Upload images to S3
//     const imageKeys = await Promise.all(
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
//         // Get the current sequence number and increment it
//         const counter = await OrganisationCounter.findOneAndUpdate(
//             { name: 'organisations' },
//             { $inc: { seq: 1 } },
//             { new: true, upsert: true }
//         );

//         // Create a new organisation with the incremented ID
//         const newOrganisation = new Organisation({
//             id: counter.seq,
//             title: req.body.title,
//             description: req.body.description,
//             images: imageKeys,
//             city: req.body.city
//         });

//         const savedOrganisation = await newOrganisation.save();
//         res.status(201).json(savedOrganisation);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Get all organisations with search and pagination
// exports.getAllOrganisations = async (req, res) => {
//     try {
//         const { title, city, page = 1, limit = 10 } = req.query;

//         // Build search query
//         let query = {};
//         if (title) {
//             query.title = { $regex: title, $options: 'i' }; // Case-insensitive search
//         }
//         if (city) {
//             query.city = { $regex: city, $options: 'i' }; // Case-insensitive search
//         }

//         const organisations = await Organisation.find(query)
//             .skip((page - 1) * limit)
//             .limit(parseInt(limit));

//         // Get total count for pagination
//         const count = await Organisation.countDocuments(query);

//         res.status(200).json({
//             organisations,
//             totalPages: Math.ceil(count / limit),
//             currentPage: parseInt(page)
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Get a specific organisation by ID
// exports.getOrganisationById = async (req, res) => {
//     try {
//         const organisation = await Organisation.findOne({ id: req.params.id });
//         if (!organisation) return res.status(404).json({ message: 'Organisation not found' });
//         res.status(200).json(organisation);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Update a specific organisation by ID
// // Update a specific organisation by ID
// exports.updateOrganisationById = async (req, res) => {
//     try {
//       // Check if files are uploaded
//       const files = req.files;
//       let images;
  
//       // Build the update object
//       let updateFields = {
//         title: req.body.title,
//         description: req.body.description,
//         city: req.body.city,
//       };
  
//       // Remove undefined fields from the update object
//       Object.keys(updateFields).forEach((key) => {
//         if (updateFields[key] === undefined) {
//           delete updateFields[key];
//         }
//       });
  
//       // Only add images field if new images are uploaded
//       if (files && files.length > 0) {
//         const imageKeys = await Promise.all(
//           files.map(async (file) => {
//             const imageKey = `${uuidv4()}_${file.originalname}`;
//             const params = {
//               Bucket: process.env.UPLOADSIMAGEBUCKET,
//               Key: imageKey,
//               Body: file.buffer,
//               ContentType: file.mimetype,
//             };
//             await s3.send(new PutObjectCommand(params));
//             return imageKey;
//           })
//         );
//         images = imageKeys;
//         updateFields.images = images;
//       } else if (req.body.images) {
//         images = req.body.images;
//         updateFields.images = images;
//       }
  
//       const updatedOrganisation = await Organisation.findOneAndUpdate(
//         { id: req.params.id },
//         { $set: updateFields },
//         { new: true }
//       );
  
//       if (!updatedOrganisation) return res.status(404).json({ message: 'Organisation not found' });
  
//       res.status(200).json(updatedOrganisation);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };
  


// // Delete a specific organisation by ID
// exports.deleteOrganisationById = async (req, res) => {
//     try {
//         const deletedOrganisation = await Organisation.findOneAndDelete({ id: req.params.id });
//         if (!deletedOrganisation) return res.status(404).json({ message: 'Organisation not found' });
//         res.status(200).json({ message: 'Organisation deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


// controllers/organisationsController.js

const Organisation = require('../models/organisationsModel');
const { v4: uuidv4 } = require('uuid');
const OrganisationCounter = require('../models/organisationsCounter');
const { PutObjectCommand } = require('@aws-sdk/client-s3');

// --- CHANGE 1: SAHI S3 CLIENT KO IMPORT KAREIN ---
// Path check karein. Agar s3.js file controllers ke bahar hai to '../s3' path aayega.
const { s3 } = require('../s3');

// --- CHANGE 2: PURANA, GALAT S3 CLIENT HATA DIYA GAYA HAI ---
// const s3 = new S3Client({ ... }); // <-- Yeh line ab yahan nahi hai.

// Helper function to format response with full URLs
const formatOrganisationResponse = (organisation) => {
    if (!organisation) return null;
    const orgObject = organisation.toObject();
    if (orgObject.images && orgObject.images.length > 0) {
        orgObject.images = orgObject.images.map(img => `${process.env.DO_SPACES_URL}/${img}`);
    }
    return orgObject;
};

// Create a new organisation
exports.createOrganisation = async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) return res.status(400).json({ error: 'Images are required' });
        
        const BUCKET_NAME = process.env.UPLOADSIMAGEBUCKET;
        const imageKeys = await Promise.all(
            files.map(async (file) => {
                const imageKey = `organisations/${uuidv4()}_${file.originalname}`;
                const params = { Bucket: BUCKET_NAME, Key: imageKey, Body: file.buffer, ContentType: file.mimetype, ACL: 'public-read' };
                await s3.send(new PutObjectCommand(params));
                return imageKey;
            })
        );
        
        const counter = await OrganisationCounter.findOneAndUpdate({ name: 'organisations' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        
        const newOrganisation = new Organisation({
            id: counter.seq,
            title: req.body.title,
            description: req.body.description,
            images: imageKeys,
            city: req.body.city
        });

        const savedOrganisation = await newOrganisation.save();
        
        const responseOrganisation = formatOrganisationResponse(savedOrganisation);
        res.status(201).json(responseOrganisation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all organisations with search and pagination
exports.getAllOrganisations = async (req, res) => {
    try {
        const { title, city, page = 1, limit = 10 } = req.query;
        let query = {};
        if (title) query.title = { $regex: title, $options: 'i' };
        if (city) query.city = { $regex: city, $options: 'i' };

        const organisations = await Organisation.find(query).skip((page - 1) * limit).limit(parseInt(limit));
        const count = await Organisation.countDocuments(query);
        
        const organisationsWithUrls = organisations.map(org => formatOrganisationResponse(org));

        res.status(200).json({
            organisations: organisationsWithUrls,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a specific organisation by ID
exports.getOrganisationById = async (req, res) => {
    try {
        const organisation = await Organisation.findOne({ id: req.params.id });
        if (!organisation) return res.status(404).json({ message: 'Organisation not found' });
        
        const responseOrganisation = formatOrganisationResponse(organisation);
        res.status(200).json(responseOrganisation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a specific organisation by ID
exports.updateOrganisationById = async (req, res) => {
    try {
        const files = req.files;
        let updateFields = {
            title: req.body.title,
            description: req.body.description,
            city: req.body.city,
        };
        Object.keys(updateFields).forEach((key) => { if (updateFields[key] === undefined) delete updateFields[key]; });

        if (files && files.length > 0) {
            const BUCKET_NAME = process.env.UPLOADSIMAGEBUCKET;
            const imageKeys = await Promise.all(
                files.map(async (file) => {
                    const imageKey = `organisations/${uuidv4()}_${file.originalname}`;
                    const params = { Bucket: BUCKET_NAME, Key: imageKey, Body: file.buffer, ContentType: file.mimetype, ACL: 'public-read' };
                    await s3.send(new PutObjectCommand(params));
                    return imageKey;
                })
            );
            updateFields.images = imageKeys;
        } else if (req.body.images) {
            updateFields.images = req.body.images.map(img => img.startsWith('http') ? img.split(process.env.DO_SPACES_URL + '/')[1] : img);
        }

        const updatedOrganisation = await Organisation.findOneAndUpdate({ id: req.params.id }, { $set: updateFields }, { new: true });
        if (!updatedOrganisation) return res.status(404).json({ message: 'Organisation not found' });
        
        const responseOrganisation = formatOrganisationResponse(updatedOrganisation);
        res.status(200).json(responseOrganisation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a specific organisation by ID
exports.deleteOrganisationById = async (req, res) => {
    try {
        const deletedOrganisation = await Organisation.findOneAndDelete({ id: req.params.id });
        if (!deletedOrganisation) return res.status(404).json({ message: 'Organisation not found' });
        // Optionally, delete images from S3 here
        res.status(200).json({ message: 'Organisation deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};