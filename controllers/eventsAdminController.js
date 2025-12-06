// const Events = require('../models/eventsModels');
// const { v4: uuidv4 } = require('uuid');
// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
// const EventsCounter = require("../models/eventsCounter")
// const Category = require('../models/eventsCategoryModels');

// // Helper function to get the next sequence value
// const getNextEventsSequenceValue = async (sequenceName) => {
//   const counter = await EventsCounter.findByIdAndUpdate(
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
// exports.createAdminEvents = async (req, res) => {
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
//     const id = await getNextEventsSequenceValue('eventsId');
//     const status = 'approved'; // Admin-created events are automatically approved

//     let newEvents = new Events({ id, title,  image: imageKey, category, description, city, status });

//     newEvents.createdBy = req.user._id; // Admin is creating the events

//     newEvents = await newEvents.save();

//     // Manually lookup category details
//     const categoryDetails = await Category.findOne({ id: newEvents.category });
//     const response = {
//       ...newEvents.toObject(),
//       category: {
//         id: categoryDetails.id,
//         name: categoryDetails.name,
//         image: categoryDetails.image,
//       },
//       createdBy: req.user, // Include createdBy information
//       isApproved: true, 
//       createdAt: newEvents.createdAt,// Admin-created events are approved by default
//     };

//     res.status(201).json(response);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getAllEvents = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search = '' } = req.query;
//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     // Building query conditions for search
//     const query = {};
//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: 'i' } }, // Case-insensitive search for title
//         { description: { $regex: search, $options: 'i' } }, // Case-insensitive search for description
//       ];
//     }

//     // Fetch events with pagination and search conditions
//     const eventsList = await Events.find(query)
//       .skip(skip)
//       .limit(parseInt(limit))
//       .sort({ createdAt: -1 }) // Sort by createdAt descending
//       .exec();

//     const count = await Events.countDocuments(query);

//     const response = [];
//     for (const eventsItem of eventsList) {
//       const categoryDetails = await Category.findOne({ id: eventsItem.category });

//       const eventsResponse = {
//         id: eventsItem.id,
//         title: eventsItem.title,
//         image: eventsItem.image,
//         category: {
//           id: categoryDetails.id,
//           name: categoryDetails.name,
//           image: categoryDetails.image,
//         },
//         description: eventsItem.description,
//         city: eventsItem.city,
//         createdBy: eventsItem.createdBy,
//         status: eventsItem.status,
//         isApproved: true,
//         createdAt: eventsItem.createdAt,
//       };

//       response.push(eventsResponse);
//     }

//     res.status(200).json({
//       events: response,
//       totalPages: Math.ceil(count / parseInt(limit)),
//       currentPage: parseInt(page),
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getAdminEventsById = async (req, res) => {
//   try {
//     const events = await Events.findOne({ id: req.params.id });
  
//     if (!events) {
//       return res.status(404).json({ error: 'Events not found' });
//     }
  
//     const categoryDetails = await Category.findOne({ id: events.category });

//     const response = {
//       id: events.id,
//       title: events.title,
//       image: events.image,
//       category: {
//         id: categoryDetails.id,
//         name: categoryDetails.name,
//         image: categoryDetails.image,
//       },
//       description: events.description,
//       city: events.city,
//       createdBy: events.createdBy,
//       status: events.status,
//       isApproved: true, // Admin-created events are approved by default
//     };
  
//     res.status(200).json(response);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.updateAdminEventsById = async (req, res) => {
//   const { title, category, description, city, status } = req.body;
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
//     const events = await Events.findOne({ id: req.params.id });

//     if (!events) {
//       return res.status(404).json({ error: 'Events not found' });
//     }

//     const updatedFields = {};
//     if (title) updatedFields.title = title;
//     if (image) updatedFields.image = image;
//     if (category) updatedFields.category = category;
//     if (description) updatedFields.description = description;
//     if (city) updatedFields.city = city;
//     if (status) updatedFields.status = status;

//     await Events.findOneAndUpdate(
//       { id: req.params.id },
//       { $set: updatedFields },
//       { new: true }
//     );

//     const updatedEvents = await Events.findOne({ id: req.params.id });
//     const categoryDetails = await Category.findOne({ id: updatedEvents.category });

//     const response = {
//       id: updatedEvents.id,
//       title: updatedEvents.title,
//       image: updatedEvents.image,
//       category: {
//         id: categoryDetails.id,
//         name: categoryDetails.name,
//         image: categoryDetails.image,
//       },
//       description: updatedEvents.description,
//       city: updatedEvents.city,
//       createdBy: updatedEvents.createdBy,
//       status: updatedEvents.status,
//       isApproved: true, // Admin-created events are approved by default
//     };

//     res.status(200).json(response);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.deleteAdminEventsById = async (req, res) => {
//   try {
//     const events = await Events.findOneAndDelete({ id: req.params.id });

//     if (!events) {
//       return res.status(404).json({ error: 'Events not found' });
//     }

//     // Return only success message upon successful deletion
//     res.status(200).json({ message: 'Events deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// controllers/eventsAdminController.js

const Events = require('../models/eventsModels');
const { v4: uuidv4 } = require('uuid');
const EventsCounter = require("../models/eventsCounter");
const Category = require('../models/eventsCategoryModels');
const { PutObjectCommand } = require('@aws-sdk/client-s3');

// --- CHANGE 1: SAHI S3 CLIENT KO IMPORT KAREIN ---
// Path check karein. Agar s3.js file controllers ke bahar hai to '../s3' path aayega.
const { s3 } = require('../s3');

// --- CHANGE 2: PURANA, GALAT S3 CLIENT HATA DIYA GAYA HAI ---
// const s3 = new S3Client({ ... }); // <-- Yeh line ab yahan nahi hai.

const getNextEventsSequenceValue = async (sequenceName) => {
    const counter = await EventsCounter.findByIdAndUpdate(sequenceName, { $inc: { seq: 1 } }, { new: true, upsert: true });
    return counter.seq;
};

// Helper function to format response with full URLs
const formatEventResponse = async (event, user = null) => {
    const eventObject = event.toObject();
    
    // Convert event image key to full URL
    if (eventObject.image) {
        eventObject.image = `${process.env.DO_SPACES_URL}/${eventObject.image}`;
    }

    // Populate and format category details
    const categoryDetails = await Category.findOne({ id: eventObject.category });
    if (categoryDetails) {
        eventObject.category = categoryDetails.toObject();
        if (eventObject.category.image) {
            eventObject.category.image = `${process.env.DO_SPACES_URL}/${eventObject.category.image}`;
        }
    } else {
        eventObject.category = null;
    }

    if (user) eventObject.createdBy = user;
    return eventObject;
};

exports.createAdminEvents = async (req, res) => {
    const { title, category, description, city } = req.body;
    
    if (!req.file) return res.status(400).json({ error: 'Image is required' });

    try {
        const imageKey = `events/${uuidv4()}_${req.file.originalname}`;
        const params = { Bucket: process.env.UPLOADSIMAGEBUCKET, Key: imageKey, Body: req.file.buffer, ContentType: req.file.mimetype, ACL: 'public-read' };
        await s3.send(new PutObjectCommand(params));
        
        const id = await getNextEventsSequenceValue('eventsId');
        let newEvents = new Events({ 
            id, title, image: imageKey, category, description, city, 
            status: 'approved', createdBy: req.user._id 
        });
        
        await newEvents.save();
        
        const response = await formatEventResponse(newEvents, req.user);
        res.status(201).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const query = search ? { $or: [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }] } : {};

        const eventsList = await Events.find(query).skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 });
        const count = await Events.countDocuments(query);
        
        const response = await Promise.all(eventsList.map(event => formatEventResponse(event)));

        res.status(200).json({
            events: response,
            totalPages: Math.ceil(count / parseInt(limit)),
            currentPage: parseInt(page),
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAdminEventsById = async (req, res) => {
    try {
        const event = await Events.findOne({ id: req.params.id });
        if (!event) return res.status(404).json({ error: 'Event not found' });
        
        const response = await formatEventResponse(event);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateAdminEventsById = async (req, res) => {
    const { title, category, description, city, status } = req.body;
    
    try {
        const event = await Events.findOne({ id: req.params.id });
        if (!event) return res.status(404).json({ error: 'Event not found' });

        const updatedFields = {};
        if (title) updatedFields.title = title;
        if (category) updatedFields.category = category;
        if (description) updatedFields.description = description;
        if (city) updatedFields.city = city;
        if (status) updatedFields.status = status;

        if (req.file) {
            const imageKey = `events/${uuidv4()}_${req.file.originalname}`;
            const params = { Bucket: process.env.UPLOADSIMAGEBUCKET, Key: imageKey, Body: req.file.buffer, ContentType: req.file.mimetype, ACL: 'public-read' };
            await s3.send(new PutObjectCommand(params));
            updatedFields.image = imageKey;
        } else if (req.body.image) {
            updatedFields.image = req.body.image.startsWith('http') ? req.body.image.split(process.env.DO_SPACES_URL + '/')[1] : req.body.image;
        }

        const updatedEvent = await Events.findOneAndUpdate({ id: req.params.id }, { $set: updatedFields }, { new: true });
        
        const response = await formatEventResponse(updatedEvent);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteAdminEventsById = async (req, res) => {
    try {
        const event = await Events.findOneAndDelete({ id: req.params.id });
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};