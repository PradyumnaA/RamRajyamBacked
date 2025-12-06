// const Banner = require('../models/bannerBottomModel');
// const { v4: uuidv4 } = require('uuid');
// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// // Create a new banner
// exports.addBanner = async (req, res) => {
//   const { name, pincode } = req.body;
//   const imageKey = req.file ? `${uuidv4()}_${req.file.originalname}` : null;

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

//     const data = await s3.send(new PutObjectCommand(params));
//     console.log('Successfully uploaded file:', data);

//     // Create a new Banner object
//     const newBanner = new Banner({ image: imageKey, name, pincode });

//     // Save the new banner
//     await newBanner.save();

//     res.status(201).json(newBanner);
//   } catch (error) {
//     console.error('Error uploading to S3:', error);
//     res.status(500).json({ error: 'Failed to upload image and create banner' });
//   }
// };

// // Get all banners
// exports.getAllBanners = async (req, res) => {
//   try {
//     const banners = await Banner.find();
//     res.status(200).json(banners);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Get banner by ID
// exports.getBannerById = async (req, res) => {
//   try {
//     const banner = await Banner.findById(req.params.id);
//     if (!banner) return res.status(404).json({ message: 'Banner not found' });
//     res.status(200).json(banner);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Update a banner
// exports.updateBanner = async (req, res) => {
//   const { name, pincode } = req.body;
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

//       const data = await s3.send(new PutObjectCommand(params));
//       console.log('Successfully uploaded file:', data);
//       image = imageKey;
//     }

//     const banner = await Banner.findByIdAndUpdate(
//       req.params.id,
//       { image, name, pincode },
//       { new: true }
//     );

//     if (!banner) return res.status(404).json({ message: 'Banner not found' });

//     res.status(200).json(banner);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Delete a banner
// exports.deleteBanner = async (req, res) => {
//   try {
//     const banner = await Banner.findByIdAndDelete(req.params.id);
//     if (!banner) return res.status(404).json({ message: 'Banner not found' });
//     res.status(200).json({ message: 'Banner deleted successfully' });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };


// exports.getAllBannersForUser = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, pincode = '' } = req.query;

//     // Create a filter if pincode is provided
//     const filter = pincode ? { pincode } : {};

//     // Apply pagination
//     const banners = await Banner.find(filter)
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));

//     // Get total count for pagination
//     const totalBanners = await Banner.countDocuments(filter);

//     res.status(200).json({
//       currentPage: parseInt(page),
//       totalPages: Math.ceil(totalBanners / limit),
//       totalItems: totalBanners,
//       items: banners,
//     });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// controllers/bannerBottomController.js

const Banner = require('../models/bannerBottomModel');
const { v4: uuidv4 } = require('uuid');
const { PutObjectCommand } = require('@aws-sdk/client-s3');

// --- CHANGE 1: SAHI S3 CLIENT KO IMPORT KAREIN ---
// Path check karein. Agar s3.js file controllers ke bahar hai to '../s3' path aayega.
const { s3 } = require('../s3');

// --- CHANGE 2: PURANA, GALAT S3 CLIENT HATA DIYA GAYA HAI ---
// const s3 = new S3Client({ ... }); // <-- Yeh line ab yahan nahi hai.

// Helper function to format banner response with full URL
const formatBannerResponse = (banner) => {
    const bannerObject = banner.toObject();
    if (bannerObject.image) {
        bannerObject.image = `${process.env.DO_SPACES_URL}/${bannerObject.image}`;
    }
    return bannerObject;
};

// Create a new banner
exports.addBanner = async (req, res) => {
    const { name, pincode } = req.body;
    let imageKey = null;

    if (!req.file) {
        return res.status(400).json({ error: 'Image is required' });
    }

    try {
        // Files ko ek 'banners-bottom' folder mein organize karein
        imageKey = `banners-bottom/${uuidv4()}_${req.file.originalname}`;
        const params = {
            Bucket: process.env.UPLOADSIMAGEBUCKET,
            Key: imageKey,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
            ACL: 'public-read'
        };
        await s3.send(new PutObjectCommand(params));

        const newBanner = new Banner({ image: imageKey, name, pincode });
        await newBanner.save();
        
        const responseBanner = formatBannerResponse(newBanner);
        res.status(201).json(responseBanner);
    } catch (error) {
        console.error('Error uploading to S3:', error);
        res.status(500).json({ error: 'Failed to upload image and create banner' });
    }
};

// Get all banners
exports.getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find();
        const bannersWithUrls = banners.map(banner => formatBannerResponse(banner));
        res.status(200).json(bannersWithUrls);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get banner by ID
exports.getBannerById = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) return res.status(404).json({ message: 'Banner not found' });
        
        const responseBanner = formatBannerResponse(banner);
        res.status(200).json(responseBanner);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a banner
exports.updateBanner = async (req, res) => {
    const { name, pincode } = req.body;
    let image = req.body.image;

    try {
        if (req.file) {
            const imageKey = `banners-bottom/${uuidv4()}_${req.file.originalname}`;
            const params = { Bucket: process.env.UPLOADSIMAGEBUCKET, Key: imageKey, Body: req.file.buffer, ContentType: req.file.mimetype, ACL: 'public-read' };
            await s3.send(new PutObjectCommand(params));
            image = imageKey;
        }

        const banner = await Banner.findByIdAndUpdate(req.params.id, { image, name, pincode }, { new: true });
        if (!banner) return res.status(404).json({ message: 'Banner not found' });
        
        const responseBanner = formatBannerResponse(banner);
        res.status(200).json(responseBanner);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a banner
exports.deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndDelete(req.params.id);
        if (!banner) return res.status(404).json({ message: 'Banner not found' });
        res.status(200).json({ message: 'Banner deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all banners for users (with filter and pagination)
exports.getAllBannersForUser = async (req, res) => {
    try {
        const { page = 1, limit = 10, pincode = '' } = req.query;
        const filter = pincode ? { pincode } : {};
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const banners = await Banner.find(filter).skip(skip).limit(parseInt(limit));
        const totalBanners = await Banner.countDocuments(filter);
        
        const bannersWithUrls = banners.map(banner => formatBannerResponse(banner));

        res.status(200).json({
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalBanners / parseInt(limit)),
            totalItems: totalBanners,
            items: bannersWithUrls,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};