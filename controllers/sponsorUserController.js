// const Sponsor = require('../models/sponsorModel');
// const { S3Client, PutObjectCommand , DeleteObjectCommand} = require('@aws-sdk/client-s3');

// const { v4: uuidv4 } = require('uuid');

// // Initialize S3 client
// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });
// // Add Sponsor by User
// exports.createUserSponsor = async (req, res) => {
//     const { pincode, city, title, package, startDate, expiryDate, url } = req.body;
//     const imageKey = req.file ? `${uuidv4()}_${req.file.originalname}` : null;

//     if (!imageKey) {
//         return res.status(400).json({ error: 'Image is required' });
//     }
//     if (!pincode || !city || !title || !package || !startDate || !expiryDate || !url) {
//         return res.status(400).json({ error: 'All fields (pincode, city, title, package, startDate, expiryDate, url) are required.' });
//     }

//     try {
//         const params = {
//             Bucket: process.env.UPLOADSIMAGEBUCKET,
//             Key: imageKey,
//             Body: req.file.buffer,
//             ContentType: req.file.mimetype,
//         };
//         const data = await s3.send(new PutObjectCommand(params));
//         console.log('Successfully uploaded file:', data);

//         const newSponsor = new Sponsor({
//             pincode,
//             city,
//             title,
//             package,
//             image: imageKey,
//             status: 'pending',
//             createdBy: req.user._id,
//             startDate,
//             expiryDate,
//             url, // Add the url field
//         });

//         await newSponsor.save();

//         res.status(201).json({
//             success: true,
//             data: newSponsor,
//         });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };



// // Get All Approved Sponsors for User
// exports.getAllApprovedSponsors = async (req, res) => {
//     try {
//         const sponsors = await Sponsor.find({ status: 'approved' })
//             .populate('package', 'title amount') // Populate package details
//             .populate('createdBy', 'fullName') // Populate createdBy details
//             .exec(); // Make sure to use exec() for better query handling
//         res.status(200).json({ success: true, data: sponsors });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// };

// // Get All Own Sponsors
// exports.getAllOwnSponsors = async (req, res) => {
//     try {
//         const sponsors = await Sponsor.find({ createdBy: req.user._id })
//             .populate('package', 'title amount') // Populate package details
//             .exec(); // Use exec() for better query handling
//         res.status(200).json({ success: true, data: sponsors });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// };
// // Get Own Sponsor by ID
// exports.getOwnSponsorById = async (req, res) => {
//     const { id } = req.params;
    
//     try {
//         const sponsor = await Sponsor.findOne({ _id: id, createdBy: req.user._id })
//             .populate('package', 'title amount') // Populate package details
//             .exec(); // Use exec() for better query handling
        
//         if (!sponsor) {
//             return res.status(404).json({ success: false, error: 'Sponsor not found' });
//         }
        
//         res.status(200).json({ success: true, data: sponsor });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// };
// // Update Own Sponsor
// exports.updateOwnSponsor = async (req, res) => {
//     const { id } = req.params;
//     const { pincode, city, title, package, startDate, expiryDate, url } = req.body;
//     const imageKey = req.file ? `${uuidv4()}_${req.file.originalname}` : null;

//     try {
//         const sponsor = await Sponsor.findOne({ _id: id, createdBy: req.user._id });

//         if (!sponsor) {
//             return res.status(404).json({ success: false, error: 'Sponsor not found' });
//         }

//         if (imageKey) {
//             const params = {
//                 Bucket: process.env.UPLOADSIMAGEBUCKET,
//                 Key: imageKey,
//                 Body: req.file.buffer,
//                 ContentType: req.file.mimetype,
//             };
//             await s3.send(new PutObjectCommand(params));
//             sponsor.image = imageKey;
//         }

//         sponsor.pincode = pincode || sponsor.pincode;
//         sponsor.city = city || sponsor.city;
//         sponsor.title = title || sponsor.title;
//         sponsor.package = package || sponsor.package;
//         sponsor.startDate = startDate || sponsor.startDate;
//         sponsor.expiryDate = expiryDate || sponsor.expiryDate;
//         sponsor.url = url || sponsor.url; // Update the url field

//         await sponsor.save();

//         res.status(200).json({ success: true, data: sponsor });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// };


// // Delete Own Sponsor
// exports.deleteOwnSponsor = async (req, res) => {
//     const { id } = req.params;
//     const userId = req.user._id;

//     console.log(`Deleting sponsor with ID: ${id} created by user ID: ${userId}`);

//     try {
//         // Check if the sponsor belongs to the user
//         const sponsor = await Sponsor.findOneAndDelete({ _id: id, createdBy: userId });

//         console.log(`Sponsor found: ${JSON.stringify(sponsor)}`);

//         if (!sponsor) {
//             return res.status(404).json({ success: false, error: 'Sponsor not found or not owned by this user' });
//         }

//         // Optionally, delete the image from S3
//         if (sponsor.image) {
//             const params = {
//                 Bucket: process.env.UPLOADSIMAGEBUCKET,
//                 Key: sponsor.image,
//             };
//             await s3.send(new DeleteObjectCommand(params));
//         }

//         res.status(200).json({ success: true, message: 'Sponsor deleted successfully' });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// };



// controllers/sponsorUserController.js

const Sponsor = require('../models/sponsorModel');
const { v4: uuidv4 } = require('uuid');
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

// --- CHANGE 1: SAHI S3 CLIENT KO IMPORT KAREIN ---
// Path check karein. Agar s3.js file controllers ke bahar hai to '../s3' path aayega.
const { s3 } = require('../s3');

// --- CHANGE 2: PURANA, GALAT S3 CLIENT HATA DIYA GAYA HAI ---
// const s3 = new S3Client({ ... }); // <-- Yeh line ab yahan nahi hai.

// Helper function to format response with full URL
const formatSponsorResponse = (sponsor) => {
    if (!sponsor) return null;
    const sponsorObject = sponsor.toObject();
    if (sponsorObject.image) {
        sponsorObject.image = `${process.env.DO_SPACES_URL}/${sponsorObject.image}`;
    }
    return sponsorObject;
};

// Add Sponsor by User
exports.createUserSponsor = async (req, res) => {
    const { pincode, city, title, package, startDate, expiryDate, url } = req.body;
    
    if (!req.file) return res.status(400).json({ error: 'Image is required' });
    if (!pincode || !city || !title || !package || !startDate || !expiryDate || !url) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const imageKey = `sponsors/${uuidv4()}_${req.file.originalname}`;
        const params = { Bucket: process.env.UPLOADSIMAGEBUCKET, Key: imageKey, Body: req.file.buffer, ContentType: req.file.mimetype, ACL: 'public-read' };
        await s3.send(new PutObjectCommand(params));

        const newSponsor = new Sponsor({
            pincode, city, title, package, image: imageKey,
            status: 'pending', createdBy: req.user._id,
            startDate, expiryDate, url,
        });
        await newSponsor.save();
        
        const responseSponsor = formatSponsorResponse(newSponsor);
        res.status(201).json({ success: true, data: responseSponsor });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get All Approved Sponsors for User
exports.getAllApprovedSponsors = async (req, res) => {
    try {
        const sponsors = await Sponsor.find({ status: 'approved' }).populate('package', 'title amount').populate('createdBy', 'fullName');
        const sponsorsWithUrls = sponsors.map(sponsor => formatSponsorResponse(sponsor));
        res.status(200).json({ success: true, data: sponsorsWithUrls });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get All Own Sponsors
exports.getAllOwnSponsors = async (req, res) => {
    try {
        const sponsors = await Sponsor.find({ createdBy: req.user._id }).populate('package', 'title amount');
        const sponsorsWithUrls = sponsors.map(sponsor => formatSponsorResponse(sponsor));
        res.status(200).json({ success: true, data: sponsorsWithUrls });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get Own Sponsor by ID
exports.getOwnSponsorById = async (req, res) => {
    const { id } = req.params;
    try {
        const sponsor = await Sponsor.findOne({ _id: id, createdBy: req.user._id }).populate('package', 'title amount');
        if (!sponsor) return res.status(404).json({ success: false, error: 'Sponsor not found' });
        
        const responseSponsor = formatSponsorResponse(sponsor);
        res.status(200).json({ success: true, data: responseSponsor });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Update Own Sponsor
exports.updateOwnSponsor = async (req, res) => {
    const { id } = req.params;
    const { pincode, city, title, package, startDate, expiryDate, url } = req.body;
    
    try {
        const sponsor = await Sponsor.findOne({ _id: id, createdBy: req.user._id });
        if (!sponsor) return res.status(404).json({ success: false, error: 'Sponsor not found' });

        const updateData = {
            pincode, city, title, package, startDate, expiryDate, url,
            status: 'pending' // Resubmit for approval after update
        };
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        if (req.file) {
            const imageKey = `sponsors/${uuidv4()}_${req.file.originalname}`;
            const params = { Bucket: process.env.UPLOADSIMAGEBUCKET, Key: imageKey, Body: req.file.buffer, ContentType: req.file.mimetype, ACL: 'public-read' };
            await s3.send(new PutObjectCommand(params));
            updateData.image = imageKey;
        }

        const updatedSponsor = await Sponsor.findByIdAndUpdate(id, updateData, { new: true });

        const responseSponsor = formatSponsorResponse(updatedSponsor);
        res.status(200).json({ success: true, data: responseSponsor });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Delete Own Sponsor
exports.deleteOwnSponsor = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    try {
        const sponsor = await Sponsor.findOneAndDelete({ _id: id, createdBy: userId });
        if (!sponsor) return res.status(404).json({ success: false, error: 'Sponsor not found or not owned by this user' });

        if (sponsor.image) {
            const params = { Bucket: process.env.UPLOADSIMAGEBUCKET, Key: sponsor.image };
            await s3.send(new DeleteObjectCommand(params));
        }

        res.status(200).json({ success: true, message: 'Sponsor deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};