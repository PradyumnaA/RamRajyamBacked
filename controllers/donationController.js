// const Donation = require('../models/donationModel');
// const { v4: uuidv4 } = require('uuid');
// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
// const DonationCounter = require('../models/donationCounter');
// const fs = require('fs');
// const path = require('path');

// // Helper function to get the next sequence value for donations
// const getNextSequenceValue = async (sequenceName) => {
//   const sequenceDocument = await DonationCounter.findOneAndUpdate(
//     { _id: sequenceName },
//     { $inc: { seq: 1 } },
//     { new: true, upsert: true }
//   );
//   return sequenceDocument.seq;
// };
// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// // Create a new donation
// exports.createDonation = async (req, res) => {
//   try {
//     const imageKey = req.file ? `${uuidv4()}_${req.file.originalname}` : null;

//     if (!imageKey) {
//       return res.status(400).json({ error: 'Image is required' });
//     }

//     const params = {
//       Bucket: process.env.UPLOADSIMAGEBUCKET,
//       Key: imageKey,
//       Body: req.file.buffer,
//       ContentType: req.file.mimetype,
//     };

//     const data = await s3.send(new PutObjectCommand(params));
//     console.log('Successfully uploaded file:', data);

//     // Construct the URL of the uploaded image
//     const imageUrl = `https://${process.env.UPLOADSIMAGEBUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageKey}`;

//     const id = await getNextSequenceValue('donationId');
//     const donation = new Donation({
//       id,
//       title: req.body.title,
//       image: imageKey,
//       url: imageUrl, // Set the URL field
//       description: req.body.description,
//     });
//     await donation.save();
//     res.status(201).json(donation);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };


// // Get all donations with pagination and search by title
// exports.getDonations = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, title } = req.query;
//     const query = title ? { title: { $regex: title, $options: 'i' } } : {};
//     const donations = await Donation.find(query)
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));
//     const count = await Donation.countDocuments(query);
//     res.status(200).json({
//       donations,
//       totalPages: Math.ceil(count / limit),
//       currentPage: parseInt(page)
//     });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Get a donation by ID
// exports.getDonationById = async (req, res) => {
//   try {
//     const donation = await Donation.findOne({ id: req.params.id });
//     if (!donation) {
//       return res.status(404).json({ error: 'Donation not found' });
//     }
//     res.status(200).json(donation);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Update a donation by ID
// // controllers/donationController.js

// // Update a donation by ID
// exports.updateDonationById = async (req, res) => {
//   try {
//     const donation = await Donation.findOne({ id: req.params.id });
//     if (!donation) {
//       return res.status(404).json({ error: 'Donation not found' });
//     }

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

//       // Construct the new URL
//       const imageUrl = `https://${process.env.UPLOADSIMAGEBUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageKey}`;
//       donation.image = imageKey;
//       donation.url = imageUrl; // Update the URL field
//     }

//     donation.title = req.body.title || donation.title;
//     donation.description = req.body.description || donation.description;

//     await donation.save();
//     res.status(200).json(donation);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Delete a donation by ID
// // controllers/donationController.js

// // Delete a donation by ID
// exports.deleteDonationById = async (req, res) => {
//   try {
//     const donation = await Donation.findOne({ id: req.params.id });
//     if (!donation) {
//       return res.status(404).json({ error: 'Donation not found' });
//     }

//     if (donation.image) {
//       // Optionally delete the image from S3 if needed
//     }

//     await donation.deleteOne();
//     res.status(200).json({ message: 'Donation deleted successfully' });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };


// controllers/donationController.js

const Donation = require('../models/donationModel');
const { v4: uuidv4 } = require('uuid');
const DonationCounter = require('../models/donationCounter');
const { PutObjectCommand } = require('@aws-sdk/client-s3');

// --- CHANGE 1: SAHI S3 CLIENT KO IMPORT KAREIN ---
// Path check karein. Agar s3.js file controllers ke bahar hai to '../s3' path aayega.
const { s3 } = require('../s3');

// --- CHANGE 2: PURANA, GALAT S3 CLIENT HATA DIYA GAYA HAI ---
// const s3 = new S3Client({ ... }); // <-- Yeh line ab yahan nahi hai.

const getNextSequenceValue = async (sequenceName) => {
    const sequenceDocument = await DonationCounter.findOneAndUpdate(
        { _id: sequenceName }, { $inc: { seq: 1 } }, { new: true, upsert: true }
    );
    return sequenceDocument.seq;
};

// Helper function to format response with full URL
const formatDonationResponse = (donation) => {
    const donationObject = donation.toObject();
    if (donationObject.image) {
        // 'url' field ko hamesha sahi URL se update karein
        donationObject.url = `${process.env.DO_SPACES_URL}/${donationObject.image}`;
    }
    return donationObject;
};

// Create a new donation
exports.createDonation = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Image is required' });
        }
        
        // Files ko ek 'donations' folder mein organize karein
        const imageKey = `donations/${uuidv4()}_${req.file.originalname}`;
        const params = {
            Bucket: process.env.UPLOADSIMAGEBUCKET,
            Key: imageKey,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
            ACL: 'public-read'
        };
        await s3.send(new PutObjectCommand(params));
        
        const id = await getNextSequenceValue('donationId');
        // Sahi DigitalOcean URL construct karein
        const imageUrl = `${process.env.DO_SPACES_URL}/${imageKey}`;
        
        // Database mein abhi bhi key aur URL dono save ho rahe hain (functionality same)
        const donation = new Donation({
            id,
            title: req.body.title,
            image: imageKey,
            url: imageUrl, 
            description: req.body.description,
        });
        await donation.save();
        
        const responseDonation = formatDonationResponse(donation);
        res.status(201).json(responseDonation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all donations with pagination and search by title
exports.getDonations = async (req, res) => {
    try {
        const { page = 1, limit = 10, title } = req.query;
        const query = title ? { title: { $regex: title, $options: 'i' } } : {};
        
        const donations = await Donation.find(query).skip((page - 1) * limit).limit(parseInt(limit));
        const count = await Donation.countDocuments(query);

        const donationsWithUrls = donations.map(donation => formatDonationResponse(donation));
        
        res.status(200).json({
            donations: donationsWithUrls,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a donation by ID
exports.getDonationById = async (req, res) => {
    try {
        const donation = await Donation.findOne({ id: req.params.id });
        if (!donation) return res.status(404).json({ error: 'Donation not found' });
        
        const responseDonation = formatDonationResponse(donation);
        res.status(200).json(responseDonation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a donation by ID
exports.updateDonationById = async (req, res) => {
    try {
        const donation = await Donation.findOne({ id: req.params.id });
        if (!donation) return res.status(404).json({ error: 'Donation not found' });

        if (req.file) {
            const imageKey = `donations/${uuidv4()}_${req.file.originalname}`;
            const params = { Bucket: process.env.UPLOADSIMAGEBUCKET, Key: imageKey, Body: req.file.buffer, ContentType: req.file.mimetype, ACL: 'public-read' };
            await s3.send(new PutObjectCommand(params));

            donation.image = imageKey;
            // Sahi DigitalOcean URL construct karein
            donation.url = `${process.env.DO_SPACES_URL}/${imageKey}`;
        }

        donation.title = req.body.title || donation.title;
        donation.description = req.body.description || donation.description;

        const updatedDonation = await donation.save();
        
        const responseDonation = formatDonationResponse(updatedDonation);
        res.status(200).json(responseDonation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a donation by ID
exports.deleteDonationById = async (req, res) => {
    try {
        const donation = await Donation.findOneAndDelete({ id: req.params.id });
        if (!donation) return res.status(404).json({ error: 'Donation not found' });
        
        // Optionally delete the image from S3
        // if (donation.image) {
        //   await s3.send(new DeleteObjectCommand({ Bucket: process.env.UPLOADSIMAGEBUCKET, Key: donation.image }));
        // }

        res.status(200).json({ message: 'Donation deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};