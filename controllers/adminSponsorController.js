// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
// const Sponsor = require('../models/sponsorModel');
// const { v4: uuidv4 } = require('uuid');
// const User = require('../models/userModels');
// const Package = require('../models/packagesModel');
// // Initialize S3 client
// const s3 = new S3Client({
//   region: process.env.AAWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// // Admin Create Sponsor Controller
// exports.addSponsorByAdmin = async (req, res) => {
//     const { pincode, city, title, packageId, startDate, expiryDate, url } = req.body;
//     const imageKey = req.file ? `${uuidv4()}_${req.file.originalname}` : null;

//     if (!imageKey) {
//         return res.status(400).json({ success: false, error: 'Image is required' });
//     }
//     if (!pincode || !city || !title || !packageId || !startDate || !expiryDate || !url) {
//         return res.status(400).json({ success: false, error: 'All fields (pincode, city, title, packageId, startDate, expiryDate, url) are required.' });
//     }

//     try {
//         const params = {
//             Bucket: process.env.UPLOADSIMAGEBUCKET,
//             Key: imageKey,
//             Body: req.file.buffer,
//             ContentType: req.file.mimetype,
//         };
//         await s3.send(new PutObjectCommand(params));

//         const sponsor = await Sponsor.create({
//             image: imageKey,
//             pincode,
//             city,
//             title,
//             package: packageId,
//             createdBy: req.user._id,
//             status: 'approved',
//             startDate,
//             expiryDate,
//             url,
//         });

//         res.status(201).json({ success: true, data: sponsor });
//     } catch (err) {
//         res.status(400).json({ success: false, error: err.message });
//     }
// };


  


// // Get All Sponsors (Admin)
// exports.getAllSponsors = async (req, res) => {
//     try {
//         const { page = 1, limit = 10, search = '' } = req.query;
//         const skip = (parseInt(page) - 1) * parseInt(limit);

//         const query = {};
//         if (search) {
//             query.$or = [
//                 { title: { $regex: search, $options: 'i' } },
//                 { city: { $regex: search, $options: 'i' } },
//                 { pincode: { $regex: search, $options: 'i' } }
//             ];
//         }

//         const sponsorsList = await Sponsor.find(query)
//             .skip(skip)
//             .limit(parseInt(limit))
//             .sort({ createdAt: -1 })
//             .exec();

//         const count = await Sponsor.countDocuments(query);

//         const response = [];
//         for (const sponsorItem of sponsorsList) {
//             const packageDetails = sponsorItem.package ? await Package.findById(sponsorItem.package) : null;
//             const createdByUser = sponsorItem.createdBy ? await User.findById(sponsorItem.createdBy) : null;

//             const sponsorResponse = {
//                 id: sponsorItem.id,
//                 title: sponsorItem.title,
//                 image: sponsorItem.image,
//                 pincode: sponsorItem.pincode,
//                 city: sponsorItem.city,
//                 status: sponsorItem.status,
//                 isApproved: sponsorItem.status === 'approved',
//                 createdAt: sponsorItem.createdAt,
//                 url: sponsorItem.url,  // Include URL in the response
//                 package: packageDetails ? {
//                     id: packageDetails.id,
//                     title: packageDetails.title,
//                     amount: packageDetails.amount,
//                 } : null,
//                 createdBy: createdByUser ? {
//                     id: createdByUser.id,
//                     name: createdByUser.fullName,
//                     role: createdByUser.role,
//                     email: createdByUser.email,
//                 } : null,
//             };

//             response.push(sponsorResponse);
//         }

//         res.status(200).json({
//             sponsors: response,
//             totalPages: Math.ceil(count / parseInt(limit)),
//             currentPage: parseInt(page),
//         });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// // Get Sponsor by ID (Admin)
// exports.getSponsorById = async (req, res) => {
//     try {
//         const sponsor = await Sponsor.findById(req.params.id)
//             .populate('package', 'title amount')
//             .populate('createdBy', 'name role');
//         if (!sponsor) {
//             return res.status(404).json({ success: false, error: 'Sponsor not found' });
//         }
//         res.status(200).json({ success: true, data: sponsor });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// };


// // Update Sponsor by Admin
// exports.updateSponsorByAdmin = async (req, res) => {
//     try {
//         const { startDate, expiryDate, url } = req.body;

//         const sponsor = await Sponsor.findByIdAndUpdate(req.params.id, {
//             ...req.body,
//             startDate,
//             expiryDate,
//             url,  // Include URL in the update
//         }, { new: true });

//         if (!sponsor) {
//             return res.status(404).json({ success: false, error: 'Sponsor not found' });
//         }
//         res.status(200).json({ success: true, data: sponsor });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// };



// // Delete Sponsor by Admin
// exports.deleteSponsorByAdmin = async (req, res) => {
//     try {
//         const sponsor = await Sponsor.findByIdAndDelete(req.params.id);
//         if (!sponsor) {
//             return res.status(404).json({ success: false, error: 'Sponsor not found' });
//         }
//         res.status(200).json({ success: true, message: 'Deleted successfully' });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// };


// controllers/adminSponsorController.js

const Sponsor = require('../models/sponsorModel');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/userModels');
const Package = require('../models/packagesModel');
const { PutObjectCommand } = require('@aws-sdk/client-s3');

// --- CHANGE 1: SAHI S3 CLIENT KO IMPORT KAREIN ---
// Path check karein. Agar s3.js file controllers ke bahar hai to '../s3' path aayega.
const { s3 } = require('../s3');

// --- CHANGE 2: PURANA, GALAT S3 CLIENT HATA DIYA GAYA HAI ---
// const s3 = new S3Client({ ... }); // <-- Yeh line ab yahan nahi hai.

// Admin Create Sponsor Controller
exports.addSponsorByAdmin = async (req, res) => {
    const { pincode, city, title, packageId, startDate, expiryDate, url } = req.body;
    let imageKey = null;

    if (!req.file) {
        return res.status(400).json({ success: false, error: 'Image is required' });
    }
    if (!pincode || !city || !title || !packageId || !startDate || !expiryDate || !url) {
        return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    try {
        // Files ko ek 'sponsors' folder mein organize karein
        imageKey = `sponsors/${uuidv4()}_${req.file.originalname}`;
        const params = {
            Bucket: process.env.UPLOADSIMAGEBUCKET,
            Key: imageKey,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
            ACL: 'public-read'
        };
        await s3.send(new PutObjectCommand(params));

        const sponsor = await Sponsor.create({
            image: imageKey,
            pincode, city, title,
            package: packageId,
            createdBy: req.user._id,
            status: 'approved',
            startDate, expiryDate, url,
        });
        
        // --- RESPONSE MEIN URL BANANE KA LOGIC ---
        const responseSponsor = sponsor.toObject();
        responseSponsor.image = `${process.env.DO_SPACES_URL}/${responseSponsor.image}`;

        res.status(201).json({ success: true, data: responseSponsor });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Get All Sponsors (Admin)
exports.getAllSponsors = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const query = {};
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } },
                { pincode: { $regex: search, $options: 'i' } }
            ];
        }

        const sponsorsList = await Sponsor.find(query).skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 });
        const count = await Sponsor.countDocuments(query);
        
        // --- RESPONSE MEIN URL BANANE KA LOGIC ---
        const response = await Promise.all(sponsorsList.map(async (sponsorItem) => {
            const packageDetails = sponsorItem.package ? await Package.findById(sponsorItem.package) : null;
            const createdByUser = sponsorItem.createdBy ? await User.findById(sponsorItem.createdBy) : null;

            return {
                id: sponsorItem._id,
                title: sponsorItem.title,
                image: `${process.env.DO_SPACES_URL}/${sponsorItem.image}`,
                pincode: sponsorItem.pincode,
                city: sponsorItem.city,
                status: sponsorItem.status,
                isApproved: sponsorItem.status === 'approved',
                createdAt: sponsorItem.createdAt,
                url: sponsorItem.url,
                package: packageDetails ? { id: packageDetails._id, title: packageDetails.title, amount: packageDetails.amount } : null,
                createdBy: createdByUser ? { id: createdByUser._id, name: createdByUser.fullName, role: createdByUser.role, email: createdByUser.email } : null,
            };
        }));

        res.status(200).json({
            sponsors: response,
            totalPages: Math.ceil(count / parseInt(limit)),
            currentPage: parseInt(page),
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Sponsor by ID (Admin)
exports.getSponsorById = async (req, res) => {
    try {
        const sponsor = await Sponsor.findById(req.params.id)
            .populate('package', 'title amount')
            .populate('createdBy', 'fullName role');
        if (!sponsor) {
            return res.status(404).json({ success: false, error: 'Sponsor not found' });
        }
        
        // --- RESPONSE MEIN URL BANANE KA LOGIC ---
        const responseSponsor = sponsor.toObject();
        responseSponsor.image = `${process.env.DO_SPACES_URL}/${responseSponsor.image}`;

        res.status(200).json({ success: true, data: responseSponsor });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Update Sponsor by Admin
exports.updateSponsorByAdmin = async (req, res) => {
    try {
        const { startDate, expiryDate, url, ...otherFields } = req.body;
        const updateData = { ...otherFields, startDate, expiryDate, url };
        
        if (req.file) {
            const imageKey = `sponsors/${uuidv4()}_${req.file.originalname}`;
            const params = { Bucket: process.env.UPLOADSIMAGEBUCKET, Key: imageKey, Body: req.file.buffer, ContentType: req.file.mimetype, ACL: 'public-read' };
            await s3.send(new PutObjectCommand(params));
            updateData.image = imageKey;
        }

        const sponsor = await Sponsor.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!sponsor) {
            return res.status(404).json({ success: false, error: 'Sponsor not found' });
        }
        
        // --- RESPONSE MEIN URL BANANE KA LOGIC ---
        const responseSponsor = sponsor.toObject();
        if(responseSponsor.image && !responseSponsor.image.startsWith('http')){
            responseSponsor.image = `${process.env.DO_SPACES_URL}/${responseSponsor.image}`;
        }
        
        res.status(200).json({ success: true, data: responseSponsor });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Delete Sponsor by Admin
exports.deleteSponsorByAdmin = async (req, res) => {
    try {
        const sponsor = await Sponsor.findByIdAndDelete(req.params.id);
        if (!sponsor) {
            return res.status(404).json({ success: false, error: 'Sponsor not found' });
        }
        res.status(200).json({ success: true, message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};