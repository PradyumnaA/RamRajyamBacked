// const Events = require('../models/eventsModels');
// const EventsCounter = require('../models/eventsCounter');
// const Category = require('../models/eventsCategoryModels');
// const { v4: uuidv4 } = require('uuid');
// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
// const EventsLike = require('../models/EventsLikesModel'); // Import Like model
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
// exports.createUserEvents = async (req, res) => {
//   const { title, category, description, city } = req.body;
//   const imageKey = req.file ? `${uuidv4()}_${req.file.originalname}` : null; 

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
//     const newEvents = new Events({ id, title, image: imageKey, category, description, city });

//     newEvents.createdBy = req.user._id; // User is creating the events

//     await newEvents.save();

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
//       isApproved: false, // User-created events are not approved by default
//     };

//     res.status(201).json(response);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getUserEvents = async (req, res) => {
//   try {
//     // Fetch events where createdBy matches the current user's _id and status is 'approved'
//     const userEventsList = await Events.find({ createdBy: req.user._id, status: 'approved' });

//     // Map the fetched events to the desired response format
//     const response = userEventsList.map((eventsItem) => ({
//       ...eventsItem.toObject(),
//       createdBy: req.user, // Assuming you want to include details of the user who created the event
//       isApproved: true, // Since we're filtering by 'approved' status
//       createdAt: eventsItem.createdAt,
//     }));

//     res.status(200).json(response);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };



// exports.getUserEventsById = async (req, res) => {
//   try {
//     const events = await Events.findOne({ id: req.params.id, createdBy: req.user._id });

//     if (!events) {
//       return res.status(404).json({ error: 'Events not found or unauthorized' });
//     }

//     const response = {
//       ...events.toObject(),
//       createdBy: req.user,
//       isApproved: false, // User-created events are not approved by default
//     };

//     res.status(200).json(response);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.updateUserEventsById = async (req, res) => {
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
//     const events = await Events.findOne({ id: req.params.id, createdBy: req.user._id });

//     if (!events) {
//       return res.status(404).json({ error: 'Events not found or unauthorized' });
//     }

//     const updatedFields = {};
//     if (title) updatedFields.title = title;
//     if (image) updatedFields.image = image;
//     if (category) updatedFields.category = category;
//     if (description) updatedFields.description = description;
//     if (city) updatedFields.city = city;

//     const updatedEvents = await Events.findOneAndUpdate(
//       { id: req.params.id, createdBy: req.user._id },
//       { $set: updatedFields },
//       { new: true }
//     );

//     const response = {
//       ...updatedEvents.toObject(),
//       createdBy: req.user,
//       isApproved: false, // User-created events are not approved by default
//     };

//     res.status(200).json(response);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.deleteUserEventsById = async (req, res) => {
//   try {
//     const events = await Events.findOneAndDelete({ id: req.params.id, createdBy: req.user._id });

//     if (!events) {
//       return res.status(404).json({ error: 'Events not found or unauthorized' });
//     }

//     res.status(200).json({ message: 'Events deleted' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
// exports.getAllEvents = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search = '' } = req.query;

//     const searchFilter = search
//       ? { title: { $regex: search, $options: 'i' } }
//       : {};

//     const eventsList = await Events.find({
//       ...searchFilter,
//       status: 'approved'
//     })
//     .skip((page - 1) * limit)
//     .limit(parseInt(limit));

//     const totalEvents = await Events.countDocuments({
//       ...searchFilter,
//       status: 'approved'
//     });

//     const response = [];
//     for (const eventsItem of eventsList) {
//       const categoryDetails = await Category.findOne({ id: eventsItem.category });

//       const totalLikes = await EventsLike.countDocuments({ eventId: eventsItem.id });

//       const isLiked = await EventsLike.exists({ eventId: eventsItem.id, userId: req.user._id });

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
//         totalLikes,
//         isLiked,
//       };

//       response.push(eventsResponse);
//     }

//     res.status(200).json({
//       currentPage: parseInt(page),
//       totalPages: Math.ceil(totalEvents / limit),
//       totalItems: totalEvents,
//       items: response,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
// exports.likeEvents = async (req, res) => {
//   const { eventId } = req.body;
//   const userId = req.user._id;

//   try {
//     const event = await Events.findOne({ id: eventId });
//     if (!event) {
//       return res.status(404).json({ error: 'Event not found' });
//     }

//     const existingLike = await EventsLike.findOne({ eventId, userId });
//     if (existingLike) {
//       return res.status(400).json({ error: 'You have already liked this event' });
//     }

//     const newLike = new EventsLike({ eventId, userId });
//     await newLike.save();

//     res.status(201).json({ message: 'Event liked successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.unlikeEvents = async (req, res) => {
//   const { eventId } = req.body;
//   const userId = req.user._id;

//   try {
//     const event = await Events.findOne({ id: eventId });
//     if (!event) {
//       return res.status(404).json({ error: 'Event not found' });
//     }

//     const existingLike = await EventsLike.findOne({ eventId, userId });
//     if (!existingLike) {
//       return res.status(400).json({ error: 'You have not liked this event' });
//     }

//     await EventsLike.deleteOne({ eventId, userId });

//     res.status(200).json({ message: 'Event unliked successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
// exports.getAllEventsWeb = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search = '' } = req.query;

//     const searchFilter = search
//       ? { title: { $regex: search, $options: 'i' } }
//       : {};

//     const eventsList = await Events.find({
//       ...searchFilter,
//       status: 'approved'
//     })
//     .skip((page - 1) * limit)
//     .limit(parseInt(limit));

//     const totalEvents = await Events.countDocuments({
//       ...searchFilter,
//       status: 'approved'
//     });

//     const response = [];
//     for (const eventsItem of eventsList) {
//       const categoryDetails = await Category.findOne({ id: eventsItem.category });

//       const totalLikes = await EventsLike.countDocuments({ eventId: eventsItem.id });

//       // Note: isLiked will not be included since authentication is not required

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
//         totalLikes,
//         // isLiked is omitted
//       };

//       response.push(eventsResponse);
//     }

//     res.status(200).json({
//       currentPage: parseInt(page),
//       totalPages: Math.ceil(totalEvents / limit),
//       totalItems: totalEvents,
//       items: response,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// controllers/eventsController.js

const Events = require('../models/eventsModels');
const EventsCounter = require('../models/eventsCounter');
const Category = require('../models/eventsCategoryModels');
const { v4: uuidv4 } = require('uuid');
const EventsLike = require('../models/EventsLikesModel');
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
const formatEventResponse = async (event, userId = null) => {
    if (!event) return null;
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
    
    eventObject.totalLikes = await EventsLike.countDocuments({ eventId: eventObject.id });
    if (userId) {
        eventObject.isLiked = !!await EventsLike.exists({ eventId: eventObject.id, userId });
    }
    
    return eventObject;
};

exports.createUserEvents = async (req, res) => {
    const { title, category, description, city } = req.body;
    
    if (!req.file) return res.status(400).json({ error: 'Image is required' });

    try {
        const imageKey = `events/${uuidv4()}_${req.file.originalname}`;
        const params = { Bucket: process.env.UPLOADSIMAGEBUCKET, Key: imageKey, Body: req.file.buffer, ContentType: req.file.mimetype, ACL: 'public-read' };
        await s3.send(new PutObjectCommand(params));
        
        const id = await getNextEventsSequenceValue('eventsId');
        let newEvents = new Events({ 
            id, title, image: imageKey, category, description, city, 
            status: 'pending', createdBy: req.user._id 
        });
        
        await newEvents.save();
        
        const response = await formatEventResponse(newEvents, req.user._id);
        res.status(201).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserEvents = async (req, res) => {
    try {
        const userEventsList = await Events.find({ createdBy: req.user._id });
        const response = await Promise.all(userEventsList.map(event => formatEventResponse(event, req.user._id)));
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserEventsById = async (req, res) => {
    try {
        const event = await Events.findOne({ id: req.params.id, createdBy: req.user._id });
        if (!event) return res.status(404).json({ error: 'Event not found or unauthorized' });
        
        const response = await formatEventResponse(event, req.user._id);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateUserEventsById = async (req, res) => {
    const { title, category, description, city } = req.body;

    try {
        const event = await Events.findOne({ id: req.params.id, createdBy: req.user._id });
        if (!event) return res.status(404).json({ error: 'Event not found or unauthorized' });

        const updatedFields = {};
        if (title) updatedFields.title = title;
        if (category) updatedFields.category = category;
        if (description) updatedFields.description = description;
        if (city) updatedFields.city = city;
        updatedFields.status = 'pending';

        if (req.file) {
            const imageKey = `events/${uuidv4()}_${req.file.originalname}`;
            const params = { Bucket: process.env.UPLOADSIMAGEBUCKET, Key: imageKey, Body: req.file.buffer, ContentType: req.file.mimetype, ACL: 'public-read' };
            await s3.send(new PutObjectCommand(params));
            updatedFields.image = imageKey;
        } else if (req.body.image) {
            updatedFields.image = req.body.image.startsWith('http') ? req.body.image.split(process.env.DO_SPACES_URL + '/')[1] : req.body.image;
        }

        const updatedEvent = await Events.findOneAndUpdate({ id: req.params.id }, { $set: updatedFields }, { new: true });
        
        const response = await formatEventResponse(updatedEvent, req.user._id);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteUserEventsById = async (req, res) => {
    try {
        const event = await Events.findOneAndDelete({ id: req.params.id, createdBy: req.user._id });
        if (!event) return res.status(404).json({ error: 'Event not found or unauthorized' });
        res.status(200).json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const searchFilter = search ? { title: { $regex: search, $options: 'i' } } : {};
        const query = { ...searchFilter, status: 'approved' };
        
        const eventsList = await Events.find(query).skip((page - 1) * limit).limit(parseInt(limit));
        const totalEvents = await Events.countDocuments(query);
        
        const response = await Promise.all(eventsList.map(event => formatEventResponse(event, req.user?._id)));

        res.status(200).json({
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalEvents / limit),
            totalItems: totalEvents,
            items: response,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.likeEvents = async (req, res) => {
    const { eventId } = req.body;
    const userId = req.user._id;

    try {
        const event = await Events.findOne({ id: eventId });
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const existingLike = await EventsLike.findOne({ eventId, userId });
        if (existingLike) {
            return res.status(400).json({ error: 'You have already liked this event' });
        }

        const newLike = new EventsLike({ eventId, userId });
        await newLike.save();

        res.status(201).json({ message: 'Event liked successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.unlikeEvents = async (req, res) => {
    const { eventId } = req.body;
    const userId = req.user._id;

    try {
        const event = await Events.findOne({ id: eventId });
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const existingLike = await EventsLike.findOne({ eventId, userId });
        if (!existingLike) {
            return res.status(400).json({ error: 'You have not liked this event' });
        }

        await EventsLike.deleteOne({ eventId, userId });

        res.status(200).json({ message: 'Event unliked successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllEventsWeb = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const searchFilter = search ? { title: { $regex: search, $options: 'i' } } : {};
        const query = { ...searchFilter, status: 'approved' };

        const eventsList = await Events.find(query).skip((page - 1) * limit).limit(parseInt(limit));
        const totalEvents = await Events.countDocuments(query);
        
        // Passing null for userId as this is a public endpoint
        const response = await Promise.all(eventsList.map(event => formatEventResponse(event, null)));

        res.status(200).json({
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalEvents / limit),
            totalItems: totalEvents,
            items: response,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};