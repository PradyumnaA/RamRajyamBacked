// const News = require('../models/newsModels');
// const { v4: uuidv4 } = require('uuid');
// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
// const Category = require('../models/newsCategoryModels');
// const NewsCounter = require('../models/newsCounter');


// // Helper function to get the next sequence value
// const getNextNewsSequenceValue = async (sequenceName) => {
//   const counter = await NewsCounter.findByIdAndUpdate(
//     sequenceName,
//     { $inc: { seq: 1 } },
//     { new: true, upsert: true }
//   );
//   return counter.seq;
// }
// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// // Handle news creation and image upload
// exports.createAdminNews = async (req, res) => {
//   const { title, category, description, city } = req.body;
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

//     const data = await s3.send(new PutObjectCommand(params)); // Ensure correct usage of PutObjectCommand
//     console.log('Successfully uploaded file:', data);

//     // Create a new News object
//     const id = await getNextNewsSequenceValue('newsId');
//     const status = 'approved'; // Admin-created news are automatically approved
//     let newNews = new News({ id, title, image: imageKey, category, description, city, status });

//     // Set createdBy and role explicitly as admin
//     newNews.createdBy = req.user._id; // Assuming req.user._id identifies the admin
//     newNews.role = 'admin'; // Set role explicitly as 'admin'

//     // Save the new news item
//     newNews = await newNews.save();

//     // Manually lookup category details
//     const categoryDetails = await Category.findOne({ id: newNews.category });

//     // Prepare response with enriched data
//     const response = {
//       ...newNews.toObject(),
//       category: {
//         id: categoryDetails.id,
//         name: categoryDetails.name,
//         image: categoryDetails.image,
//       },
//       createdBy: {
//         _id: req.user._id,
//         name: req.user.name,
//         role: 'admin' // Set role in response explicitly as 'admin'
//       },
//       isApproved: true, // Admin-created news are approved by default
//     };

//     res.status(201).json(response);
//   } catch (err) {
//     console.error('Error uploading to S3:', err);
//     res.status(500).json({ error: 'Failed to upload image and create news' });
//   }
// };

// exports.getAllNews = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search = '' } = req.query;

//     // Create a search filter if a search term is provided
//     const searchFilter = search
//       ? { title: { $regex: search, $options: 'i' } }
//       : {};

//     // Apply search filter and pagination
//     const newsList = await News.find(searchFilter)
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));

//     // Get total count for pagination
//     const totalNews = await News.countDocuments(searchFilter);

//     const response = [];
//     for (const newsItem of newsList) {
//       const categoryDetails = await Category.findOne({ id: newsItem.category });

//       const newsResponse = {
//         id: newsItem.id,
//         title: newsItem.title,
//         image: newsItem.image,
//         category: {
//           id: categoryDetails.id,
//           name: categoryDetails.name,
//           image: categoryDetails.image,
//         },
//         description: newsItem.description,
//         city: newsItem.city,
//         createdBy: newsItem.createdBy,
//         status: newsItem.status,
//         isApproved: true,
//         createdAt: newsItem.createdAt, // Admin-created news are approved by default
//       };

//       response.push(newsResponse);
//     }

//     res.status(200).json({
//       currentPage: parseInt(page),
//       totalPages: Math.ceil(totalNews / limit),
//       totalItems: totalNews,
//       items: response,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// exports.getAdminNewsById = async (req, res) => {
//   try {
//     const news = await News.findOne({ id: req.params.id });
  
//     if (!news) {
//       return res.status(404).json({ error: 'News not found' });
//     }
  
//     const categoryDetails = await Category.findOne({ id: news.category });

//     const response = {
//       id: news.id,
//       title: news.title,
//       image: news.image,
//       category: {
//         id: categoryDetails.id,
//         name: categoryDetails.name,
//         image: categoryDetails.image,
//       },
//       description: news.description,
//       city: news.city,
//       createdBy: news.createdBy,
//       status: news.status,
//       isApproved: true, // Admin-created news are approved by default
//     };
  
//     res.status(200).json(response);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.updateAdminNewsById = async (req, res) => {
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
//     const news = await News.findOne({ id: req.params.id });

//     if (!news) {
//       return res.status(404).json({ error: 'News not found' });
//     }

//     const updatedFields = {};
//     if (title) updatedFields.title = title;
//     if (image) updatedFields.image = image;
//     if (category) updatedFields.category = category;
//     if (description) updatedFields.description = description;
//     if (city) updatedFields.city = city;
//     if (status) updatedFields.status = status;

//     await News.findOneAndUpdate(
//       { id: req.params.id },
//       { $set: updatedFields },
//       { new: true }
//     );

//     const updatedNews = await News.findOne({ id: req.params.id });
//     const categoryDetails = await Category.findOne({ id: updatedNews.category });

//     const response = {
//       id: updatedNews.id,
//       title: updatedNews.title,
//       image: updatedNews.image,
//       category: {
//         id: categoryDetails.id,
//         name: categoryDetails.name,
//         image: categoryDetails.image,
//       },
//       description: updatedNews.description,
//       city: updatedNews.city,
//       createdBy: updatedNews.createdBy,
//       status: updatedNews.status,
//       isApproved: true, // Admin-created news are approved by default
//     };

//     res.status(200).json(response);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.deleteAdminNewsById = async (req, res) => {
//   try {
//     const news = await News.findOneAndDelete({ id: req.params.id });

//     if (!news) {
//       return res.status(404).json({ error: 'News not found' });
//     }

//     // Return only success message upon successful deletion
//     res.status(200).json({ message: 'News deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// controllers/newsAdminController.js

const News = require('../models/newsModels');
const { v4: uuidv4 } = require('uuid');
const Category = require('../models/newsCategoryModels');
const NewsCounter = require('../models/newsCounter');
const { PutObjectCommand } = require('@aws-sdk/client-s3');

// --- CHANGE 1: SAHI S3 CLIENT KO IMPORT KAREIN ---
// Path check karein. Agar s3.js file controllers ke bahar hai to '../s3' path aayega.
const { s3 } = require('../s3');

// --- CHANGE 2: PURANA, GALAT S3 CLIENT HATA DIYA GAYA HAI ---
// const s3 = new S3Client({ ... }); // <-- Yeh line ab yahan nahi hai.

const getNextNewsSequenceValue = async (sequenceName) => {
    const counter = await NewsCounter.findByIdAndUpdate(sequenceName, { $inc: { seq: 1 } }, { new: true, upsert: true });
    return counter.seq;
};

// Helper function to format response with full URLs
const formatNewsResponse = async (news) => {
    if (!news) return null;
    const newsObject = news.toObject();
    
    // Convert news image key to full URL
    if (newsObject.image) {
        newsObject.image = `${process.env.DO_SPACES_URL}/${newsObject.image}`;
    }

    // Populate and format category details
    const categoryDetails = await Category.findOne({ id: newsObject.category });
    if (categoryDetails) {
        newsObject.category = categoryDetails.toObject();
        if (newsObject.category.image) {
            newsObject.category.image = `${process.env.DO_SPACES_URL}/${newsObject.category.image}`;
        }
    } else {
        newsObject.category = null;
    }
    
    return newsObject;
};

// Handle news creation and image upload
exports.createAdminNews = async (req, res) => {
    const { title, category, description, city } = req.body;
    
    if (!req.file) return res.status(400).json({ error: 'Image is required' });

    try {
        const imageKey = `news/${uuidv4()}_${req.file.originalname}`;
        const params = { Bucket: process.env.UPLOADSIMAGEBUCKET, Key: imageKey, Body: req.file.buffer, ContentType: req.file.mimetype, ACL: 'public-read' };
        await s3.send(new PutObjectCommand(params));

        const id = await getNextNewsSequenceValue('newsId');
        let newNews = new News({ 
            id, title, image: imageKey, category, description, city, 
            status: 'approved', createdBy: req.user._id, role: 'admin' 
        });
        
        await newNews.save();
        
        const response = await formatNewsResponse(newNews);
        res.status(201).json(response);
    } catch (err) {
        console.error('Error creating news:', err);
        res.status(500).json({ error: 'Failed to create news' });
    }
};

exports.getAllNews = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const searchFilter = search ? { title: { $regex: search, $options: 'i' } } : {};
        
        const newsList = await News.find(searchFilter).skip((page - 1) * limit).limit(parseInt(limit));
        const totalNews = await News.countDocuments(searchFilter);
        
        const response = await Promise.all(newsList.map(newsItem => formatNewsResponse(newsItem)));

        res.status(200).json({
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalNews / limit),
            totalItems: totalNews,
            items: response,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAdminNewsById = async (req, res) => {
    try {
        const news = await News.findOne({ id: req.params.id });
        if (!news) return res.status(404).json({ error: 'News not found' });
        
        const response = await formatNewsResponse(news);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateAdminNewsById = async (req, res) => {
    const { title, category, description, city, status } = req.body;
    
    try {
        const news = await News.findOne({ id: req.params.id });
        if (!news) return res.status(404).json({ error: 'News not found' });

        const updatedFields = {};
        if (title) updatedFields.title = title;
        if (category) updatedFields.category = category;
        if (description) updatedFields.description = description;
        if (city) updatedFields.city = city;
        if (status) updatedFields.status = status;

        if (req.file) {
            const imageKey = `news/${uuidv4()}_${req.file.originalname}`;
            const params = { Bucket: process.env.UPLOADSIMAGEBUCKET, Key: imageKey, Body: req.file.buffer, ContentType: req.file.mimetype, ACL: 'public-read' };
            await s3.send(new PutObjectCommand(params));
            updatedFields.image = imageKey;
        } else if (req.body.image) {
            updatedFields.image = req.body.image.startsWith('http') ? req.body.image.split(process.env.DO_SPACES_URL + '/')[1] : req.body.image;
        }

        const updatedNews = await News.findOneAndUpdate({ id: req.params.id }, { $set: updatedFields }, { new: true });
        
        const response = await formatNewsResponse(updatedNews);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteAdminNewsById = async (req, res) => {
    try {
        const news = await News.findOneAndDelete({ id: req.params.id });
        if (!news) return res.status(404).json({ error: 'News not found' });
        res.status(200).json({ message: 'News deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};