// const News = require('../models/newsModels');
// const { v4: uuidv4 } = require('uuid');
// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
// const NewsCounter = require('../models/newsCounter');
// const Category = require('../models/newsCategoryModels');
// const Like = require('../models/newsLikedModel'); // Import Like model

// // Helper function to get the next sequence value
// const getNextNewsSequenceValue = async (sequenceName) => {
//   const counter = await NewsCounter.findByIdAndUpdate(
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

// exports.createUserNews = async (req, res) => {
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
//     const id = await getNextNewsSequenceValue('newsId');
//     const newNews = new News({ id, title, image: imageKey, category, description, city });

//     newNews.createdBy = req.user._id; // User is creating the news

//     await newNews.save();

//     // Manually lookup category details
//     const categoryDetails = await Category.findOne({ id: newNews.category });
//     const response = {
//       ...newNews.toObject(),
//       category: {
//         id: categoryDetails.id,
//         name: categoryDetails.name,
//         image: categoryDetails.image,
//       },
//       createdBy: req.user, // Include createdBy information
//       isApproved: false, // User-created news are not approved by default
//     };

//     res.status(201).json(response);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getUserNews = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search = '' } = req.query;

//     // Create a search filter if a search term is provided
//     const searchFilter = search
//       ? { title: { $regex: search, $options: 'i' } }
//       : {};

//     // Apply search filter and pagination
//     const newsList = await News.find({
//       ...searchFilter,
//       status: 'approved' // Filter by 'approved' status
//     })
//     .skip((page - 1) * limit)
//     .limit(parseInt(limit));

//     // Get total count for pagination
//     const totalNews = await News.countDocuments({
//       ...searchFilter,
//       status: 'approved' // Count documents with 'approved' status
//     });

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
//         isApproved: true, // Since we're fetching 'approved' news
//         createdAt: newsItem.createdAt,
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

// exports.getUserNewsById = async (req, res) => {
//   try {
//     const news = await News.findOne({ id: req.params.id, createdBy: req.user._id });

//     if (!news) {
//       return res.status(404).json({ error: 'News not found or unauthorized' });
//     }

//     const response = {
//       ...news.toObject(),
//       createdBy: req.user,
//       isApproved: false, // User-created news are not approved by default
//     };

//     res.status(200).json(response);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.updateUserNewsById = async (req, res) => {
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
//     const news = await News.findOne({ id: req.params.id, createdBy: req.user._id });

//     if (!news) {
//       return res.status(404).json({ error: 'News not found or unauthorized' });
//     }

//     const updatedFields = {};
//     if (title) updatedFields.title = title;
//     if (image) updatedFields.image = image;
//     if (category) updatedFields.category = category;
//     if (description) updatedFields.description = description;
//     if (city) updatedFields.city = city;

//     const updatedNews = await News.findOneAndUpdate(
//       { id: req.params.id, createdBy: req.user._id },
//       { $set: updatedFields },
//       { new: true }
//     );

//     const response = {
//       ...updatedNews.toObject(),
//       createdBy: req.user,
//       isApproved: false, // User-created news are not approved by default
//     };

//     res.status(200).json(response);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.deleteUserNewsById = async (req, res) => {
//   try {
//     const news = await News.findOneAndDelete({ id: req.params.id, createdBy: req.user._id });

//     if (!news) {
//       return res.status(404).json({ error: 'News not found or unauthorized' });
//     }

//     res.status(200).json({ message: 'News deleted' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
// exports.getAllNews = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search = '' } = req.query;

//     const searchFilter = search
//       ? { title: { $regex: search, $options: 'i' } }
//       : {};

//     const newsList = await News.find({
//       ...searchFilter,
//       status: 'approved'
//     })
//     .skip((page - 1) * limit)
//     .limit(parseInt(limit));

//     const totalNews = await News.countDocuments({
//       ...searchFilter,
//       status: 'approved'
//     });

//     const response = [];
//     for (const newsItem of newsList) {
//       const categoryDetails = await Category.findOne({ id: newsItem.category });

//       const totalLikes = await Like.countDocuments({ newsId: newsItem.id });

//       const isLiked = await Like.exists({ newsId: newsItem.id, userId: req.user._id });

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
//         createdAt: newsItem.createdAt,
//         totalLikes,
//         isLiked,
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

// exports.likeNews = async (req, res) => {
//   const { newsId } = req.body;
//   const userId = req.user._id;

//   try {
//     // Check if the news item exists
//     const news = await News.findOne({ id: newsId });
//     if (!news) {
//       return res.status(404).json({ error: 'News not found' });
//     }

//     // Check if the user has already liked this news item
//     const existingLike = await Like.findOne({ newsId, userId });
//     if (existingLike) {
//       return res.status(400).json({ error: 'You have already liked this news' });
//     }

//     // Create a new like entry
//     const newLike = new Like({ newsId, userId });
//     await newLike.save();

//     res.status(201).json({ message: 'News liked successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.unlikeNews = async (req, res) => {
//   const { newsId } = req.body;
//   const userId = req.user._id;

//   try {
//     // Check if the news item exists
//     const news = await News.findOne({ id: newsId });
//     if (!news) {
//       return res.status(404).json({ error: 'News not found' });
//     }

//     // Check if the user has liked this news item
//     const existingLike = await Like.findOne({ newsId, userId });
//     if (!existingLike) {
//       return res.status(400).json({ error: 'You have not liked this news' });
//     }

//     // Remove the like entry
//     await Like.deleteOne({ newsId, userId });

//     res.status(200).json({ message: 'News unliked successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// exports.getAllNewsWeb = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search = '' } = req.query;

//     // Create a search filter if a search term is provided
//     const searchFilter = search
//       ? { title: { $regex: search, $options: 'i' } }
//       : {};

//     // Apply search filter and pagination
//     const newsList = await News.find({
//       ...searchFilter,
//       status: 'approved' // Filter by 'approved' status
//     })
//     .skip((page - 1) * limit)
//     .limit(parseInt(limit));

//     // Get total count for pagination
//     const totalNews = await News.countDocuments({
//       ...searchFilter,
//       status: 'approved' // Count documents with 'approved' status
//     });

//     const response = [];
//     for (const newsItem of newsList) {
//       const categoryDetails = await Category.findOne({ id: newsItem.category });

//       const totalLikes = await Like.countDocuments({ newsId: newsItem.id });

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
//         isApproved: true, // Since we're fetching 'approved' news
//         createdAt: newsItem.createdAt,
//         totalLikes,
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



// controllers/newsController.js

const News = require('../models/newsModels');
const { v4: uuidv4 } = require('uuid');
const NewsCounter = require('../models/newsCounter');
const Category = require('../models/newsCategoryModels');
const Like = require('../models/newsLikedModel');
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
const formatNewsResponse = async (news, userId = null) => {
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
    
    newsObject.totalLikes = await Like.countDocuments({ newsId: newsObject.id });
    if (userId) {
        newsObject.isLiked = !!await Like.exists({ newsId: newsObject.id, userId });
    }
    
    return newsObject;
};

exports.createUserNews = async (req, res) => {
    const { title, category, description, city } = req.body;
    
    if (!req.file) return res.status(400).json({ error: 'Image is required' });

    try {
        const imageKey = `news/${uuidv4()}_${req.file.originalname}`;
        const params = { Bucket: process.env.UPLOADSIMAGEBUCKET, Key: imageKey, Body: req.file.buffer, ContentType: req.file.mimetype, ACL: 'public-read' };
        await s3.send(new PutObjectCommand(params));
        
        const id = await getNextNewsSequenceValue('newsId');
        let newNews = new News({ 
            id, title, image: imageKey, category, description, city, 
            status: 'pending', createdBy: req.user._id 
        });
        
        await newNews.save();
        
        const response = await formatNewsResponse(newNews, req.user._id);
        res.status(201).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserNews = async (req, res) => {
    try {
        const userNewsList = await News.find({ createdBy: req.user._id });
        const response = await Promise.all(userNewsList.map(newsItem => formatNewsResponse(newsItem, req.user._id)));
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserNewsById = async (req, res) => {
    try {
        const news = await News.findOne({ id: req.params.id, createdBy: req.user._id });
        if (!news) return res.status(404).json({ error: 'News not found or unauthorized' });
        
        const response = await formatNewsResponse(news, req.user._id);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateUserNewsById = async (req, res) => {
    const { title, category, description, city } = req.body;

    try {
        const news = await News.findOne({ id: req.params.id, createdBy: req.user._id });
        if (!news) return res.status(404).json({ error: 'News not found or unauthorized' });

        const updatedFields = {};
        if (title) updatedFields.title = title;
        if (category) updatedFields.category = category;
        if (description) updatedFields.description = description;
        if (city) updatedFields.city = city;
        updatedFields.status = 'pending';

        if (req.file) {
            const imageKey = `news/${uuidv4()}_${req.file.originalname}`;
            const params = { Bucket: process.env.UPLOADSIMAGEBUCKET, Key: imageKey, Body: req.file.buffer, ContentType: req.file.mimetype, ACL: 'public-read' };
            await s3.send(new PutObjectCommand(params));
            updatedFields.image = imageKey;
        } else if (req.body.image) {
            updatedFields.image = req.body.image.startsWith('http') ? req.body.image.split(process.env.DO_SPACES_URL + '/')[1] : req.body.image;
        }

        const updatedNews = await News.findOneAndUpdate({ id: req.params.id }, { $set: updatedFields }, { new: true });
        
        const response = await formatNewsResponse(updatedNews, req.user._id);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteUserNewsById = async (req, res) => {
    try {
        const news = await News.findOneAndDelete({ id: req.params.id, createdBy: req.user._id });
        if (!news) return res.status(404).json({ error: 'News not found or unauthorized' });
        res.status(200).json({ message: 'News deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllNews = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const searchFilter = search ? { title: { $regex: search, $options: 'i' } } : {};
        const query = { ...searchFilter, status: 'approved' };
        
        const newsList = await News.find(query).skip((page - 1) * limit).limit(parseInt(limit));
        const totalNews = await News.countDocuments(query);
        
        const response = await Promise.all(newsList.map(newsItem => formatNewsResponse(newsItem, req.user?._id)));

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

exports.likeNews = async (req, res) => {
    const { newsId } = req.body;
    const userId = req.user._id;
    try {
        const news = await News.findOne({ id: newsId });
        if (!news) return res.status(404).json({ error: 'News not found' });
        const existingLike = await Like.findOne({ newsId, userId });
        if (existingLike) return res.status(400).json({ error: 'You have already liked this news' });
        const newLike = new Like({ newsId, userId });
        await newLike.save();
        res.status(201).json({ message: 'News liked successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.unlikeNews = async (req, res) => {
    const { newsId } = req.body;
    const userId = req.user._id;
    try {
        const news = await News.findOne({ id: newsId });
        if (!news) return res.status(404).json({ error: 'News not found' });
        const existingLike = await Like.findOne({ newsId, userId });
        if (!existingLike) return res.status(400).json({ error: 'You have not liked this news' });
        await Like.deleteOne({ newsId, userId });
        res.status(200).json({ message: 'News unliked successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllNewsWeb = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const searchFilter = search ? { title: { $regex: search, $options: 'i' } } : {};
        const query = { ...searchFilter, status: 'approved' };
        
        const newsList = await News.find(query).skip((page - 1) * limit).limit(parseInt(limit));
        const totalNews = await News.countDocuments(query);
        
        const response = await Promise.all(newsList.map(newsItem => formatNewsResponse(newsItem, null)));

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