// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
// const Suggestion = require('../models/suggestionsModel');
// const User = require('../models/userModels');
// const uuidv4 = require('uuid').v4;

// // Initialize S3 client
// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// // Add a suggestion
// exports.addSuggestion = async (req, res) => {
//   const { text } = req.body;
//   const imageKey = req.file ? `${uuidv4()}_${req.file.originalname}` : null;

//   // Validate required fields
//   if (!text) {
//     return res.status(400).json({ error: 'Text is required' });
//   }

//   try {
//     // Upload image to S3
//     let imageUrl = '';
//     if (imageKey) {
//       const params = {
//         Bucket: process.env.UPLOADSIMAGEBUCKET,
//         Key: imageKey,
//         Body: req.file.buffer,
//         ContentType: req.file.mimetype,
//       };
//       const data = await s3.send(new PutObjectCommand(params));
//       console.log('Successfully uploaded file:', data);
//       imageUrl = `https://${process.env.UPLOADSIMAGEBUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageKey}`;
//     }

//     // Save suggestion data to the database
//     const newSuggestion = new Suggestion({
//       text,
//       image: imageUrl,
//       createdBy: req.user._id, // Assuming you have user authentication in place
//     });

//     await newSuggestion.save();

//     res.status(201).json({
//       success: true,
//       data: newSuggestion,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// controllers/userSuggestions.js

const Suggestion = require('../models/suggestionsModel');
const { v4: uuidv4 } = require('uuid');
const { PutObjectCommand } = require('@aws-sdk/client-s3');

// --- CHANGE 1: SAHI S3 CLIENT KO IMPORT KAREIN ---
// Path check karein. Agar s3.js file controllers ke bahar hai to '../s3' path aayega.
const { s3 } = require('../s3');

// --- CHANGE 2: PURANA, GALAT S3 CLIENT HATA DIYA GAYA HAI ---
// const s3 = new S3Client({ ... }); // <-- Yeh line ab yahan nahi hai.

// Add a suggestion
exports.addSuggestion = async (req, res) => {
    const { text } = req.body;
    let imageKey = null;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    try {
        if (req.file) {
            // Files ko ek 'suggestions' folder mein organize karein
            imageKey = `suggestions/${uuidv4()}_${req.file.originalname}`;
            const params = {
                Bucket: process.env.UPLOADSIMAGEBUCKET,
                Key: imageKey,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
                ACL: 'public-read'
            };
            await s3.send(new PutObjectCommand(params));
        }

        const newSuggestion = new Suggestion({
            text,
            image: imageKey, // Database mein sirf key save hogi
            createdBy: req.user._id,
        });

        await newSuggestion.save();
        
        // --- RESPONSE MEIN URL BANANE KA LOGIC ---
        const responseSuggestion = newSuggestion.toObject();
        if (responseSuggestion.image) {
            responseSuggestion.image = `${process.env.DO_SPACES_URL}/${responseSuggestion.image}`;
        }

        res.status(201).json({
            success: true,
            data: responseSuggestion,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};