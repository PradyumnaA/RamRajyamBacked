// const Matrimony = require('../models/matrimonyModel');
// const { v4: uuidv4 } = require('uuid');
// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
// const Package = require('../models/packagesMatrimonyModel');
// const User = require('../models/userModels')
// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// exports.createMatrimony = async (req, res) => {
//   try {
//     // Ensure at least one image is provided
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ error: 'At least one image is required' });
//     }

//     // Upload all images to S3
//     const imageKeys = [];
//     for (const file of req.files) {
//       const imageKey = `${uuidv4()}_${file.originalname}`;
//       const params = {
//         Bucket: process.env.UPLOADSIMAGEBUCKET,
//         Key: imageKey,
//         Body: file.buffer,
//         ContentType: file.mimetype,
//       };

//       await s3.send(new PutObjectCommand(params));
//       imageKeys.push(imageKey); // Store each image key
//     }

//     const {
//       userName,
//       fullName,
//       fathersName,
//       gender,
//       maritalStatus,
//       fatherMobile,
//       numOfBrothers,
//       numOfSisters,
//       manglik,
//       bodyColor,
//       height,
//       bloodGroup,
//       dateOfBirth,
//       birthTime,
//       address,
//       mobileNo,
//       education,
//       subcaste,
//       profession,
//       perAnnum,
//       gotra,
//       city,
//       state,
//       pincode,
//       about,
//       packageName,
//       status // New field
//     } = req.body;

//     const createdBy = req.user._id; // Assuming req.user is populated by authentication middleware

//     // Validate packageName
//     const package = await Package.findById(packageName);
//     if (!package) {
//       return res.status(400).json({ success: false, error: 'Invalid packageName' });
//     }

//     // Create the matrimony object with package details and image keys
//     const matrimony = new Matrimony({
//       userName,
//       fullName,
//       fathersName,
//       gender,
//       maritalStatus,
//       fatherMobile,
//       numOfBrothers,
//       numOfSisters,
//       manglik,
//       bodyColor,
//       height,
//       bloodGroup,
//       dateOfBirth,
//       birthTime,
//       address,
//       mobileNo,
//       education,
//       subcaste,
//       profession,
//       perAnnum,
//       gotra,
//       images: imageKeys, // Store all image keys in an array
//       city,
//       state,
//       pincode,
//       about,
//       createdBy: req.user,
//       packageName,
//       status, // New field
//       packageDetails: {
//         title: package.title,
//         amount: package.amount,
//         description: package.description,
//         link: package.link
//       }
//     });

//     // Save the matrimony object
//     await matrimony.save();

//     res.status(201).json({ success: true, data: matrimony });
//   } catch (err) {
//     res.status(400).json({ success: false, error: err.message });
//   }
// }



// exports.getAllMatrimonys = async (req, res) => {
//   const { page = 1, limit = 10, subcaste, city, manglik, dateOfBirth } = req.query;
//   const skip = (page - 1) * limit;

//   try {
//     let query = {};

//     // Apply search filters if provided
//     if (subcaste) {
//       query.subcaste = subcaste;
//     }
//     if (city) {
//       query.city = city;
//     }
//     if (manglik !== undefined) {
//       query.manglik = manglik === "true";
//     }
//     if (dateOfBirth) {
//       const yearOfBirth = new Date(dateOfBirth).getFullYear();
//       query.dateOfBirth = {
//         $gte: new Date(yearOfBirth, 0, 1), // Start of the year
//         $lt: new Date(yearOfBirth + 1, 0, 1) // Start of next year
//       };
//     }

//     const totalDocuments = await Matrimony.countDocuments(query);

//     const matrimonys = await Matrimony.find(query)
//       .populate('createdBy')
//       .populate('packageName')
//       .populate({
//         path: 'createdBy',
//         populate: {
//           path: 'selectedPackage',
//           model: 'packageMatrimony'
//         }
//       })
//       .skip(skip)
//       .limit(Number(limit));

//     res.status(200).json({
//       success: true,
//       data: matrimonys,
//       currentPage: parseInt(page),
//       totalPages: Math.ceil(totalDocuments / limit)
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };





// // Get Matrimony by ID
// exports.getMatrimonyById = async (req, res) => {
//   try {
//     const matrimony = await Matrimony.findById(req.params.id)
//       .populate('packageName', 'title amount description link'); // Populate packageName
//     if (!matrimony) {
//       return res.status(404).json({ success: false, error: 'Matrimony not found' });
//     }
//     res.status(200).json({ success: true, data: { ...matrimony._doc, status: matrimony.status } });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// // Update Matrimony
// exports.updateMatrimony = async (req, res) => {
//   try {
//     const { packageName, status, ...updateData } = req.body;

//     // Check if new images are uploaded
//     if (req.files && req.files.length > 0) {
//       const imageKeys = [];
//       for (const file of req.files) {
//         const imageKey = `${uuidv4()}_${file.originalname}`;
//         const params = {
//           Bucket: process.env.UPLOADSIMAGEBUCKET,
//           Key: imageKey,
//           Body: file.buffer,
//           ContentType: file.mimetype,
//         };
//         await s3.send(new PutObjectCommand(params));
//         imageKeys.push(imageKey);
//       }
//       updateData.images = imageKeys; // Update image array with new keys
//     } else if (req.body.images) {
//       updateData.images = req.body.images; // Use existing image keys from request body if no new files are uploaded
//     }

//     // Validate packageName if it exists in the update data
//     if (packageName) {
//       const package = await Package.findById(packageName);
//       if (!package) {
//         return res.status(400).json({ success: false, error: 'Invalid packageName' });
//       }
//       updateData.packageName = packageName;
//     }

//     // Update status if provided
//     if (status) {
//       updateData.status = status;
//     }

//     const matrimony = await Matrimony.findByIdAndUpdate(req.params.id, updateData, {
//       new: true,
//       runValidators: true,
//     }).populate('packageName', 'title amount description link');

//     if (!matrimony) {
//       return res.status(404).json({ success: false, error: 'Matrimony not found' });
//     }

//     res.status(200).json({ success: true, data: { ...matrimony._doc, status: matrimony.status } });
//   } catch (err) {
//     res.status(400).json({ success: false, error: err.message });
//   }
// };






// // Delete Matrimony
// exports.deleteMatrimony = async (req, res) => {
//   try {
//     const matrimony = await Matrimony.findByIdAndDelete(req.params.id);
//     if (!matrimony) {
//       return res.status(404).json({ success: false, error: 'Matrimony not found' });
//     }
//     res.status(200).json({ success: true, message: 'Deleted Successfully' });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// module.exports;


// controllers/adminMatrimonyController.js

const Matrimony = require('../models/matrimonyModel');
const { v4: uuidv4 } = require('uuid');
const Package = require('../models/packagesMatrimonyModel');
const User = require('../models/userModels');
const { PutObjectCommand } = require('@aws-sdk/client-s3');

// --- CHANGE 1: SAHI S3 CLIENT KO IMPORT KAREIN ---
// Path check karein. Agar s3.js file controllers ke bahar hai to '../s3' path aayega.
const { s3 } = require('../s3');

// --- CHANGE 2: PURANA, GALAT S3 CLIENT HATA DIYA GAYA HAI ---
// const s3 = new S3Client({ ... }); // <-- Yeh line ab yahan nahi hai.

exports.createMatrimony = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'At least one image is required' });
        }

        const BUCKET_NAME = process.env.UPLOADSIMAGEBUCKET;
        const imageKeys = [];
        for (const file of req.files) {
            const imageKey = `matrimony/images/${uuidv4()}_${file.originalname}`;
            const params = { Bucket: BUCKET_NAME, Key: imageKey, Body: file.buffer, ContentType: file.mimetype, ACL: 'public-read' };
            await s3.send(new PutObjectCommand(params));
            imageKeys.push(imageKey);
        }

        const {
            userName, fullName, fathersName, gender, maritalStatus,
            fatherMobile, numOfBrothers, numOfSisters, manglik, bodyColor,
            height, bloodGroup, dateOfBirth, birthTime, address, mobileNo,
            education, subcaste, profession, perAnnum, gotra, city,
            state, pincode, about, packageName, status
        } = req.body;

        const packageDetails = await Package.findById(packageName);
        if (!packageDetails) {
            return res.status(400).json({ success: false, error: 'Invalid packageName' });
        }

        const matrimony = new Matrimony({
            userName, fullName, fathersName, gender, maritalStatus,
            fatherMobile, numOfBrothers, numOfSisters, manglik, bodyColor,
            height, bloodGroup, dateOfBirth, birthTime, address, mobileNo,
            education, subcaste, profession, perAnnum, gotra, images: imageKeys,
            city, state, pincode, about, createdBy: req.user._id, packageName, status,
            packageDetails: {
                title: packageDetails.title,
                amount: packageDetails.amount,
                description: packageDetails.description,
                link: packageDetails.link
            }
        });
        
        await matrimony.save();
        
        // --- RESPONSE MEIN URL BANANE KA LOGIC ---
        const responseMatrimony = matrimony.toObject();
        responseMatrimony.images = responseMatrimony.images.map(img => `${process.env.DO_SPACES_URL}/${img}`);

        res.status(201).json({ success: true, data: responseMatrimony });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.getAllMatrimonys = async (req, res) => {
    const { page = 1, limit = 10, subcaste, city, manglik, dateOfBirth } = req.query;
    const skip = (page - 1) * limit;

    try {
        let query = {};
        if (subcaste) query.subcaste = subcaste;
        if (city) query.city = city;
        if (manglik !== undefined) query.manglik = manglik === "true";
        if (dateOfBirth) {
            const yearOfBirth = new Date(dateOfBirth).getFullYear();
            query.dateOfBirth = { $gte: new Date(yearOfBirth, 0, 1), $lt: new Date(yearOfBirth + 1, 0, 1) };
        }

        const totalDocuments = await Matrimony.countDocuments(query);
        const matrimonys = await Matrimony.find(query)
            .populate('createdBy')
            .populate('packageName')
            .skip(skip)
            .limit(Number(limit));
        
        // --- RESPONSE MEIN URL BANANE KA LOGIC ---
        const matrimonysWithUrls = matrimonys.map(mat => {
            const matObject = mat.toObject();
            matObject.images = matObject.images.map(img => `${process.env.DO_SPACES_URL}/${img}`);
            if(matObject.createdBy && matObject.createdBy.image){
                 matObject.createdBy.image = `${process.env.DO_SPACES_URL}/${matObject.createdBy.image}`;
            }
            return matObject;
        });

        res.status(200).json({
            success: true,
            data: matrimonysWithUrls,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalDocuments / limit)
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getMatrimonyById = async (req, res) => {
    try {
        const matrimony = await Matrimony.findById(req.params.id)
            .populate('packageName', 'title amount description link');
        if (!matrimony) {
            return res.status(404).json({ success: false, error: 'Matrimony not found' });
        }
        
        // --- RESPONSE MEIN URL BANANE KA LOGIC ---
        const responseMatrimony = matrimony.toObject();
        responseMatrimony.images = responseMatrimony.images.map(img => `${process.env.DO_SPACES_URL}/${img}`);

        res.status(200).json({ success: true, data: responseMatrimony });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.updateMatrimony = async (req, res) => {
    try {
        const { packageName, status, ...updateData } = req.body;
        const BUCKET_NAME = process.env.UPLOADSIMAGEBUCKET;

        if (req.files && req.files.length > 0) {
            const imageKeys = [];
            for (const file of req.files) {
                const imageKey = `matrimony/images/${uuidv4()}_${file.originalname}`;
                const params = { Bucket: BUCKET_NAME, Key: imageKey, Body: file.buffer, ContentType: file.mimetype, ACL: 'public-read' };
                await s3.send(new PutObjectCommand(params));
                imageKeys.push(imageKey);
            }
            updateData.images = imageKeys;
        } else if (req.body.images) {
            updateData.images = req.body.images.map(img => img.startsWith('http') ? img.split(process.env.DO_SPACES_URL + '/')[1] : img);
        }

        if (packageName) {
            const packageDetails = await Package.findById(packageName);
            if (!packageDetails) return res.status(400).json({ success: false, error: 'Invalid packageName' });
            updateData.packageName = packageName;
        }
        if (status) updateData.status = status;

        const matrimony = await Matrimony.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
            .populate('packageName', 'title amount description link');
        if (!matrimony) {
            return res.status(404).json({ success: false, error: 'Matrimony not found' });
        }

        // --- RESPONSE MEIN URL BANANE KA LOGIC ---
        const responseMatrimony = matrimony.toObject();
        responseMatrimony.images = responseMatrimony.images.map(img => `${process.env.DO_SPACES_URL}/${img}`);

        res.status(200).json({ success: true, data: responseMatrimony });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.deleteMatrimony = async (req, res) => {
    try {
        const matrimony = await Matrimony.findByIdAndDelete(req.params.id);
        if (!matrimony) {
            return res.status(404).json({ success: false, error: 'Matrimony not found' });
        }
        res.status(200).json({ success: true, message: 'Deleted Successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};