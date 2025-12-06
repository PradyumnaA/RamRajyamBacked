// const Volunteer = require('../models/volunteersModel');
// const Counter = require('../models/volunteersCounter');
// const { v4: uuidv4 } = require('uuid');
// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// // Helper function to get the next sequence value
// const getNextSequenceValue = async (sequenceName) => {
//   const counter = await Counter.findByIdAndUpdate(
//     sequenceName,
//     { $inc: { seq: 1 } },
//     { new: true, upsert: true }
//   );
//   return counter.seq;
// };

// // Create a new volunteer
// exports.createVolunteer = async (req, res) => {
//   const { city, name, contactNo, designation } = req.body;
//   const imageKey = req.file ? `${uuidv4()}_${req.file.originalname}` : null;

//   if (req.file && imageKey) {
//     try {
//       const params = {
//         Bucket: process.env.UPLOADSIMAGEBUCKET,
//         Key: imageKey,
//         Body: req.file.buffer,
//         ContentType: req.file.mimetype,
//       };
//       await s3.send(new PutObjectCommand(params));
//     } catch (err) {
//       return res.status(500).json({ error: 'Failed to upload image' });
//     }
//   } else {
//     return res.status(400).json({ error: 'Image is required' });
//   }

//   try {
//     const id = await getNextSequenceValue('volunteerId');
//     const newVolunteer = new Volunteer({ id, city, name, contactNo, designation, image: imageKey });
//     await newVolunteer.save();
//     res.status(201).json(newVolunteer);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Update a volunteer by ID
// exports.updateVolunteerById = async (req, res) => {
//   const { city, name, contactNo, designation } = req.body;
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
//       await s3.send(new PutObjectCommand(params));
//       image = imageKey; // Update image to new key or URL
//     }
//     const volunteer = await Volunteer.findOneAndUpdate(
//       { id: req.params.id },
//       { city, name, contactNo, designation, image },
//       { new: true }
//     );
//     if (!volunteer) {
//       return res.status(404).json({ error: 'Volunteer not found' });
//     }
//     res.status(200).json(volunteer);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Get all volunteers (search by name with pagination)
// exports.getAllVolunteers = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, name } = req.query;
//     const query = name ? { name: new RegExp(name, 'i') } : {};
//     const volunteers = await Volunteer.find(query)
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));
//     const total = await Volunteer.countDocuments(query);
//     res.status(200).json({
//       volunteers,
//       total,
//       page: parseInt(page),
//       pages: Math.ceil(total / limit)
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Get a volunteer by ID
// exports.getVolunteerById = async (req, res) => {
//   try {
//     const volunteer = await Volunteer.findOne({ id: req.params.id });
//     if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
//     res.status(200).json(volunteer);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Delete a volunteer by ID
// exports.deleteVolunteerById = async (req, res) => {
//   try {
//     const volunteer = await Volunteer.findOneAndDelete({ id: req.params.id });
//     if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
//     res.status(200).json({ message: 'Volunteer deleted successfully' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };


// controllers/volunteersController.js

const Volunteer = require('../models/volunteersModel');
const Counter = require('../models/volunteersCounter');
const { v4: uuidv4 } = require('uuid');
const { PutObjectCommand } = require('@aws-sdk/client-s3');

// --- CHANGE 1: SAHI S3 CLIENT KO IMPORT KAREIN ---
// Path check karein. Agar s3.js file controllers ke bahar hai to '../s3' path aayega.
const { s3 } = require('../s3');

// --- CHANGE 2: PURANA, GALAT S3 CLIENT HATA DIYA GAYA HAI ---
// const s3 = new S3Client({ ... }); // <-- Yeh line ab yahan nahi hai.

const getNextSequenceValue = async (sequenceName) => {
    const counter = await Counter.findByIdAndUpdate(sequenceName, { $inc: { seq: 1 } }, { new: true, upsert: true });
    return counter.seq;
};

// Helper function to format response with full URL
const formatVolunteerResponse = (volunteer) => {
    if (!volunteer) return null;
    const volunteerObject = volunteer.toObject();
    if (volunteerObject.image) {
        volunteerObject.image = `${process.env.DO_SPACES_URL}/${volunteerObject.image}`;
    }
    return volunteerObject;
};

// Create a new volunteer
exports.createVolunteer = async (req, res) => {
    const { city, name, contactNo, designation } = req.body;
    
    if (!req.file) return res.status(400).json({ error: 'Image is required' });

    try {
        const imageKey = `volunteers/${uuidv4()}_${req.file.originalname}`;
        const params = { Bucket: process.env.UPLOADSIMAGEBUCKET, Key: imageKey, Body: req.file.buffer, ContentType: req.file.mimetype, ACL: 'public-read' };
        await s3.send(new PutObjectCommand(params));
        
        const id = await getNextSequenceValue('volunteerId');
        const newVolunteer = new Volunteer({ id, city, name, contactNo, designation, image: imageKey });
        await newVolunteer.save();
        
        const responseVolunteer = formatVolunteerResponse(newVolunteer);
        res.status(201).json(responseVolunteer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a volunteer by ID
exports.updateVolunteerById = async (req, res) => {
    const { city, name, contactNo, designation } = req.body;
    
    try {
        const updateData = { city, name, contactNo, designation };
        
        if (req.file) {
            const imageKey = `volunteers/${uuidv4()}_${req.file.originalname}`;
            const params = { Bucket: process.env.UPLOADSIMAGEBUCKET, Key: imageKey, Body: req.file.buffer, ContentType: req.file.mimetype, ACL: 'public-read' };
            await s3.send(new PutObjectCommand(params));
            updateData.image = imageKey;
        } else if (req.body.image) {
            updateData.image = req.body.image.startsWith('http') ? req.body.image.split(process.env.DO_SPACES_URL + '/')[1] : req.body.image;
        }

        const volunteer = await Volunteer.findOneAndUpdate({ id: req.params.id }, updateData, { new: true });
        if (!volunteer) return res.status(404).json({ error: 'Volunteer not found' });
        
        const responseVolunteer = formatVolunteerResponse(volunteer);
        res.status(200).json(responseVolunteer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all volunteers
exports.getAllVolunteers = async (req, res) => {
    try {
        const { page = 1, limit = 10, name } = req.query;
        const query = name ? { name: new RegExp(name, 'i') } : {};
        
        const volunteers = await Volunteer.find(query).skip((page - 1) * limit).limit(parseInt(limit));
        const total = await Volunteer.countDocuments(query);
        
        const volunteersWithUrls = volunteers.map(vol => formatVolunteerResponse(vol));
        
        res.status(200).json({
            volunteers: volunteersWithUrls,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a volunteer by ID
exports.getVolunteerById = async (req, res) => {
    try {
        const volunteer = await Volunteer.findOne({ id: req.params.id });
        if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
        
        const responseVolunteer = formatVolunteerResponse(volunteer);
        res.status(200).json(responseVolunteer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a volunteer by ID
exports.deleteVolunteerById = async (req, res) => {
    try {
        const volunteer = await Volunteer.findOneAndDelete({ id: req.params.id });
        if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
        // Optionally, delete image from S3 here
        res.status(200).json({ message: 'Volunteer deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};