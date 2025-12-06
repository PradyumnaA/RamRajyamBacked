// // userController.js
// const jwt = require('jsonwebtoken');
// const { v4: uuidv4 } = require('uuid');
// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
// const User = require('../models/userModels'); // Adjust the path if necessary
// const { emitNotification } = require('../socket'); // Correct import path
// const { secretKey } = require('../config');


// // Function to generate a unique referral code with 6 alphanumeric characters
// function generateReferralCode() {
//     const length = 6;
//     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let referralCode = '';
//     for (let i = 0; i < length; i++) {
//         referralCode += characters.charAt(Math.floor(Math.random() * characters.length));
//     }
//     return referralCode;
// }

// function generateShareLink(referralCode) {
//     const appBaseUrl = "https://yourapp.com"; 
//     return `${appBaseUrl}/register?ref=${referralCode}`;
// }


// async function uploadToS3({ file }) {
//     const key = `${uuidv4()}_${file.originalname}`;
//     const params = {
//         Bucket: process.env.UPLOADSIMAGEBUCKET,
//         Key: key,
//         Body: file.buffer,
//         ContentType: file.mimetype,
//     };
//     await s3.send(new PutObjectCommand(params));
//     return { key };
// }

// const s3 = new S3Client({
//     region: process.env.AWS_REGION,
//     endpoint: `https://s3.${process.env.AWS_REGION}.amazonaws.com`,
//     credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
//     }
// });

// exports.registerUser = async (req, res) => {
//     try {
//         const {
//             fullName, email, password, contactNo, state, bloodGroup, pincode, address, city,
//             subcaste, nativeOf, homeDistrict, homeCity, caste, gotra, kuldeviName, bloodYN, selectedJobCategories,
//             referralCode,gender  // Include referralCode in the request body
//         } = req.body;

//         // Validate required fields
//         if (!fullName) {
//             return res.status(400).json({
//                 status: 'fail',
//                 message: 'Please provide fullName'
//             });
//         }

//         // Check if the contact number already exists
//         const existingUser = await User.findOne({ contactNo });
//         if (existingUser) {
//             return res.status(400).json({
//                 status: 'fail',
//                 message: 'Email or contact number already exists'
//             });
//         }

//         // Generate a unique referral code if not provided
//         let userReferralCode = referralCode;
//         if (!referralCode) {
//             userReferralCode = generateReferralCode(); // Function to generate unique referral code
//         }

//         // Check if the generated referral code already exists
//         while (await User.findOne({ referralCode: userReferralCode })) {
//             userReferralCode = generateReferralCode(); // Regenerate until a unique code is found
//         }

//         // Generate the share link with the referral code
//         const shareLink = generateShareLink(userReferralCode);

//         // Handle image uploads
//         let singleImagePath;
//         let businessImagePaths = [];

//         if (req.files) {
//             if (req.files.image) {
//                 const { key } = await uploadToS3({ file: req.files.image[0] });
//                 singleImagePath = key;
//             }
//             if (req.files.businessImages) {
//                 for (const file of req.files.businessImages) {
//                     const { key } = await uploadToS3({ file });
//                     businessImagePaths.push(key);
//                 }
//             }
//         }

//         // Get the highest numeric ID user
//         const highestIdUser = await User.findOne({}, {}, { sort: { id: -1 } });
//         let nextId = 1;
//         if (highestIdUser) {
//             nextId = highestIdUser.id + 1;
//         }

//         // Initialize businessProfile if it doesn't exist
//         const newBusinessProfile = {
//             ...(req.body.businessProfile || {}),
//             businessImages: businessImagePaths
//         };

//         // Create the user object
//         const newUser = new User({
//             id: nextId,
//             fullName,
//             email,
//             password,
//             contactNo,
//             image: singleImagePath,
//             selectedJobCategories,
//             bloodYN,
//             bloodGroup,
//             pincode,
//             address,
//             state,
//             city,
//             subcaste,
//             nativeOf,
//             homeDistrict,
//             homeCity,
//             caste,
//             gotra,
//             kuldeviName,
//             gender,
//             businessProfile: newBusinessProfile,
//             referralCode: userReferralCode // Add referral code to the user object
//         });

//         // Save the user to the database
//         const user = await newUser.save();

//         // If a referral code was provided, find the referrer user and increment the referral count
//         if (referralCode) {
//             const referrerUser = await User.findOne({ referralCode: referralCode });
//             if (referrerUser) {
//                 await User.findByIdAndUpdate(referrerUser._id, { $inc: { referralCount: 1 } });
//             }
//         }

//         // Generate token
//         const token = jwt.sign({ userId: user._id }, secretKey);

//         // Find users in the same job category
//         const usersToNotify = await User.find({
//             selectedJobCategories
//         });

//         // Emit notification to users in the same job category
//         usersToNotify.forEach((userToNotify) => {
//             emitNotification(userToNotify._id.toString(), 'A new user has registered in the same job category as you.');
//         });

//         // Send success response with user data, token, and share link
//         res.status(201).json({
//             status: 'success',
//             data: {
//                 user,
//                 token,
//                 shareLink
//             }
//         });
//     } catch (err) {
//         // Handle errors
//         console.error('Error in registerUser:', err);
//         res.status(400).json({
//             status: 'fail',
//             message: err.message
//         });
//     }
// };





// exports.getAllUsers = async (req, res) => {
//     try {
//         const { profileType, username, city, bloodGroup, selectedJobCategories, page = 1, limit = 10 } = req.query;
//         let filter = {};
//         let query = {};

//         // Apply profile type filter if provided
//         if (profileType === 'personal') {
//             filter['$or'] = [
//                 { 'businessProfile.firmName': { $exists: false } },
//                 { 'businessProfile.firmName': '' }
//             ];
//         } else if (profileType === 'business') {
//             filter['businessProfile.firmName'] = { $exists: true, $ne: '' };
//         }

//         // Apply username search if provided
//         if (username) {
//             query.fullName = { $regex: new RegExp(username, 'i') };
//         }
//         if (city) {
//             query.city = { $regex: new RegExp(city, 'i') };
//         }
//         if (bloodGroup) {
//             query.bloodGroup = { $regex: new RegExp(bloodGroup, 'i') };
//         }
//         if (selectedJobCategories) {
//             query.selectedJobCategories = { $regex: new RegExp(selectedJobCategories, 'i') };
//         }

//         const count = await User.countDocuments({ ...filter, ...query });

//         const users = await User.find({ ...filter, ...query })
//             .skip((page - 1) * limit)
//             .limit(limit)
//             .select('-password'); // Exclude password from the response

//         res.status(200).json({
//             status: 'success',
//             data: {
//                 users: users.map(user => ({
//                     ...user.toObject(),
//                     registeredAt: user.createdAt // Include the registration date
//                 })),
//                 currentPage: page,
//                 totalPages: Math.ceil(count / limit)
//             }
//         });
//     } catch (err) {
//         res.status(404).json({
//             status: 'fail',
//             message: err.message
//         });
//     }
// };

// exports.updateUserById = async (req, res) => {
//     try {
//         // Extract fields from request body
//         const {
//             fullName, mobileNumber, email, password, businessProfile, pincode, address,
//             state, city, subcaste, bloodGroup, nativeOf, homeDistrict, homeCity, caste, gotra,gender, kuldeviName, bloodYN, selectedJobCategories
//         } = req.body;

//         // Parse businessProfile if it's a string (in case it's sent as JSON string)
//         let parsedBusinessProfile = businessProfile;
//         if (typeof businessProfile === 'string') {
//             try {
//                 parsedBusinessProfile = JSON.parse(businessProfile);
//             } catch (e) {
//                 console.error('Error parsing businessProfile JSON:', e);
//             }
//         }

//         // Find the existing user
//         const existingUser = await User.findOne({ _id: req.params.id });

//         if (!existingUser) {
//             return res.status(404).json({
//                 status: 'fail',
//                 message: 'User not found'
//             });
//         }

//         // Build the update object dynamically
//         let updateFields = {};
//         if (fullName) updateFields.fullName = fullName;
//         if (mobileNumber) updateFields.mobileNumber = mobileNumber;
//         if (email) updateFields.email = email;
//         if (password) updateFields.password = password;
//         if (pincode) updateFields.pincode = pincode;
//         if (address) updateFields.address = address;
//         if (state) updateFields.state = state;
//         if (city) updateFields.city = city;
//         if (subcaste) updateFields.subcaste = subcaste;
//         if (bloodGroup) updateFields.bloodGroup = bloodGroup;
//         if (nativeOf) updateFields.nativeOf = nativeOf;
//         if (homeDistrict) updateFields.homeDistrict = homeDistrict;
//         if (homeCity) updateFields.homeCity = homeCity;
//         if (caste) updateFields.caste = caste;
//         if (gotra) updateFields.gotra = gotra;
//         if (kuldeviName) updateFields.kuldeviName = kuldeviName;
//         if (bloodYN) updateFields.bloodYN = bloodYN.toLowerCase(); // Convert to lowercase
//         if (gender) updateFields.gender = gender; // Add gender to the update fields
//         if (selectedJobCategories) updateFields.selectedJobCategories = selectedJobCategories;

//         // Handle the uploaded single image file to S3
//         if (req.files && req.files.image) {
//             const { key } = await uploadToS3({ file: req.files.image[0] });
//             updateFields.image = key;
//         }

//         // Handle the uploaded multiple business images to S3
//         if (req.files && req.files.businessImages) {
//             const businessImagePaths = [];
//             for (const file of req.files.businessImages) {
//                 const { key } = await uploadToS3({ file });
//                 businessImagePaths.push(key);
//             }
//             updateFields['businessProfile.businessImages'] = businessImagePaths;
//         }

//         // Merge the new businessProfile with the existing one
//         if (parsedBusinessProfile) {
//             updateFields.businessProfile = {
//                 ...existingUser.businessProfile.toObject(),
//                 ...parsedBusinessProfile
//             };
//         } else if (!req.files || !req.files.businessImages) {
//             updateFields.businessProfile = existingUser.businessProfile.toObject();
//         }

//         // Update the user
//         const updatedUser = await User.findOneAndUpdate(
//             { _id: req.params.id },
//             updateFields,
//             {
//                 new: true,
//                 runValidators: true
//             }
//         );

//         res.status(200).json({
//             status: 'success',
//             data: {
//                 user: updatedUser
//             }
//         });
//     } catch (err) {
//         res.status(400).json({
//             status: 'fail',
//             message: err.message
//         });
//     }
// };




// exports.deleteUserById = async (req, res) => {
//     try {
//         const user = await User.findOneAndDelete({ _id: req.params.id });
//         if (!user) {
//             return res.status(404).json({
//                 status: 'fail',
//                 message: 'User not found'
//             });
//         }
//         res.status(200).json({
//             status: 'success',
//             message: 'Successfully deleted user',
//             data: null
//         });
//     } catch (err) {
//         res.status(400).json({
//             status: 'fail',
//             message: err.message
//         });
//     }
// };

// exports.getUserById = async (req, res) => {
//     const id = req.params.id;

//     try {
//         const user = await User.findOne({ _id: id });

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         res.status(200).json(user);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


// controllers/userController.js

const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/userModels');
const { emitNotification } = require('../socket');
const { secretKey } = require('../config');
const { PutObjectCommand } = require('@aws-sdk/client-s3');

// --- CHANGE 1: SAHI S3 CLIENT KO IMPORT KAREIN ---
// Path check karein. Agar s3.js file controllers ke bahar hai to '../s3' path aayega.
const { s3 } = require('../s3');

// --- CHANGE 2: PURANA, GALAT S3 CLIENT AUR HELPER FUNCTION HATA DIYA GAYA HAI ---
// const s3 = new S3Client({ ... }); // <-- Yeh line ab yahan nahi hai.
// async function uploadToS3({ file }) { ... } // <-- Yeh function ab yahan nahi hai.

function generateReferralCode() {
    const length = 6;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let referralCode = '';
    for (let i = 0; i < length; i++) {
        referralCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return referralCode;
}

function generateShareLink(referralCode) {
    const appBaseUrl = "https://yourapp.com"; 
    return `${appBaseUrl}/register?ref=${referralCode}`;
}

// Helper function to upload files using the central s3 client
async function uploadFileToS3(file, folder) {
    const key = `${folder}/${uuidv4()}_${file.originalname}`;
    const params = { Bucket: process.env.UPLOADSIMAGEBUCKET, Key: key, Body: file.buffer, ContentType: file.mimetype, ACL: 'public-read' };
    await s3.send(new PutObjectCommand(params));
    return key;
}

// --- Helper function to format user response with full URLs ---
const formatUserResponse = (user) => {
    const userObject = user.toObject();
    if (userObject.image) {
        userObject.image = `${process.env.DO_SPACES_URL}/${userObject.image}`;
    }
    if (userObject.businessProfile && userObject.businessProfile.businessImages && userObject.businessProfile.businessImages.length > 0) {
        userObject.businessProfile.businessImages = userObject.businessProfile.businessImages.map(img => `${process.env.DO_SPACES_URL}/${img}`);
    }
    return userObject;
};

// exports.registerUser = async (req, res) => {
//     try {
//         const {
//             fullName, email, password, contactNo, state, bloodGroup, pincode, address, city,
//             subcaste, nativeOf, homeDistrict, homeCity, caste, gotra, kuldeviName, bloodYN, selectedJobCategories,
//             referralCode, gender
//         } = req.body;

//         if (!fullName) return res.status(400).json({ status: 'fail', message: 'Please provide fullName' });
//         const existingUser = await User.findOne({ contactNo });
//         if (existingUser) return res.status(400).json({ status: 'fail', message: 'Contact number already exists' });

//         let userReferralCode = referralCode || generateReferralCode();
//         while (await User.findOne({ referralCode: userReferralCode })) {
//             userReferralCode = generateReferralCode();
//         }

//         let singleImagePath;
//         let businessImagePaths = [];
//         if (req.files) {
//             if (req.files.image) singleImagePath = await uploadFileToS3(req.files.image[0], 'user-profiles');
//             if (req.files.businessImages) {
//                 for (const file of req.files.businessImages) {
//                     const key = await uploadFileToS3(file, 'business-images');
//                     businessImagePaths.push(key);
//                 }
//             }
//         }
        
//         const highestIdUser = await User.findOne({}, {}, { sort: { id: -1 } });
//         let nextId = highestIdUser ? highestIdUser.id + 1 : 1;

//         const newUser = new User({
//             id: nextId, fullName, email, password, contactNo, image: singleImagePath, selectedJobCategories, bloodYN,
//             bloodGroup, pincode, address, state, city, subcaste, nativeOf, homeDistrict, homeCity, caste, gotra,
//             kuldeviName, gender, businessProfile: { ...(req.body.businessProfile || {}), businessImages: businessImagePaths },
//             referralCode: userReferralCode
//         });

//         const user = await newUser.save();

//         if (referralCode) {
//             const referrerUser = await User.findOne({ referralCode });
//             if (referrerUser) await User.findByIdAndUpdate(referrerUser._id, { $inc: { referralCount: 1 } });
//         }

//         const token = jwt.sign({ userId: user._id, role: 'user' }, secretKey, { expiresIn: '24h' });
        
//         const responseUser = formatUserResponse(user);

//         res.status(201).json({ status: 'success', data: { user: responseUser, token, shareLink: generateShareLink(userReferralCode) } });
//     } catch (err) {
//         console.error('Error in registerUser:', err);
//         res.status(400).json({ status: 'fail', message: err.message });
//     }
// };

// In your controller file (e.g., userController.js or adminController.js)

exports.registerUser = async (req, res) => {
    try {
        const {
            fullName, email, password, contactNo, state, bloodGroup, pincode, address, city,
            subcaste, nativeOf, homeDistrict, homeCity, caste, gotra, kuldeviName, bloodYN, selectedJobCategories,
            referralCode, gender
        } = req.body;

        // Basic validation checks (add more as needed)
        if (!fullName) return res.status(400).json({ status: 'fail', message: 'Please provide fullName' });
        if (!contactNo) return res.status(400).json({ status: 'fail', message: 'Please provide contact number' });
        if (!email) return res.status(400).json({ status: 'fail', message: 'Please provide email' });
        if (!password) return res.status(400).json({ status: 'fail', message: 'Please provide password' });
        if (!req.files || !req.files.image || req.files.image.length === 0) {
             return res.status(400).json({ status: 'fail', message: 'Profile image is required.' });
        }

        // Check for existing user by contactNo and email (important before saving)
        const existingUserByContact = await User.findOne({ contactNo });
        if (existingUserByContact) return res.status(400).json({ status: 'fail', message: 'Contact number already exists.' });

        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) return res.status(400).json({ status: 'fail', message: 'Email address already exists.' });

        let userReferralCode = referralCode || generateReferralCode();
        // Ensure generated referral code is unique
        while (await User.findOne({ referralCode: userReferralCode })) {
            userReferralCode = generateReferralCode();
        }

        let singleImagePath;
        let businessImagePaths = [];
        if (req.files) {
            if (req.files.image && req.files.image.length > 0) {
                singleImagePath = await uploadFileToS3(req.files.image[0], 'user-profiles');
            }
            if (req.files.businessImages && req.files.businessImages.length > 0) {
                for (const file of req.files.businessImages) {
                    const key = await uploadFileToS3(file, 'business-images');
                    businessImagePaths.push(key);
                }
            }
        }

        // --- CRITICAL CHANGE HERE: Generate and assign regId ---
        const highestRegIdUser = await User.findOne({}, {}, { sort: { regId: -1 } });
        let nextRegId = (highestRegIdUser && typeof highestRegIdUser.regId === 'number') ? highestRegIdUser.regId + 1 : 1;

        const newUser = new User({
            regId: nextRegId, // Assign the unique ID to the 'regId' field
            fullName, email, password, contactNo, image: singleImagePath, selectedJobCategories, bloodYN,
            bloodGroup, pincode, address, state, city, subcaste, nativeOf, homeDistrict, homeCity, caste, gotra,
            kuldeviName, gender, businessProfile: { ...(req.body.businessProfile || {}), businessImages: businessImagePaths },
            referralCode: userReferralCode
        });

        const user = await newUser.save();

        if (referralCode) {
            const referrerUser = await User.findOne({ referralCode });
            if (referrerUser) await User.findByIdAndUpdate(referrerUser._id, { $inc: { referralCount: 1 } });
        }

        const token = jwt.sign({ userId: user._id, role: 'user' }, secretKey, { expiresIn: '24h' });

        const responseUser = formatUserResponse(user);

        res.status(201).json({ status: 'success', data: { user: responseUser, token, shareLink: generateShareLink(userReferralCode) } });
    } catch (err) {
        console.error('Error in registerUser:', err);
        // Enhanced error handling for duplicate key errors
        if (err.code === 11000) { // MongoDB duplicate key error code
            const duplicateField = Object.keys(err.keyPattern)[0];
            let message = `Duplicate value for ${duplicateField}.`;
            if (duplicateField === 'regId') {
                message = 'Failed to generate a unique registration ID. Please try again.';
            } else if (duplicateField === 'contactNo') {
                message = 'This contact number is already registered.';
            } else if (duplicateField === 'email') {
                message = 'This email address is already registered.';
            } else if (duplicateField === 'referralCode') {
                message = 'Referral code conflict. Please try again or leave it blank to auto-generate.';
            }
            return res.status(400).json({ status: 'fail', message: message });
        }
        res.status(400).json({ status: 'fail', message: err.message || 'An unexpected error occurred during registration.' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const { profileType, username, city, bloodGroup, selectedJobCategories, page = 1, limit = 10 } = req.query;
        let query = {};
        if (username) query.fullName = { $regex: username, $options: 'i' };
        if (city) query.city = { $regex: city, $options: 'i' };
        if (bloodGroup) query.bloodGroup = { $regex: bloodGroup, $options: 'i' };
        if (selectedJobCategories) query.selectedJobCategories = { $in: selectedJobCategories.split(',') };
        if (profileType === 'business') query['businessProfile.firmName'] = { $exists: true, $ne: '' };
        if (profileType === 'personal') query['businessProfile.firmName'] = { $exists: false };

        const count = await User.countDocuments(query);
        const users = await User.find(query).skip((page - 1) * limit).limit(limit).select('-password');

        const usersWithUrls = users.map(user => formatUserResponse(user));

        res.status(200).json({ status: 'success', data: { users: usersWithUrls, currentPage: page, totalPages: Math.ceil(count / limit) } });
    } catch (err) {
        res.status(404).json({ status: 'fail', message: err.message });
    }
};

exports.updateUserById = async (req, res) => {
    try {
        const { ...updateData } = req.body;
        
        if (req.files) {
            if (req.files.image) updateData.image = await uploadFileToS3(req.files.image[0], 'user-profiles');
            if (req.files.businessImages) {
                const businessImagePaths = [];
                for (const file of req.files.businessImages) {
                    const key = await uploadFileToS3(file, 'business-images');
                    businessImagePaths.push(key);
                }
                updateData['businessProfile.businessImages'] = businessImagePaths;
            }
        }
        
        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!updatedUser) return res.status(404).json({ status: 'fail', message: 'User not found' });
        
        const responseUser = formatUserResponse(updatedUser);

        res.status(200).json({ status: 'success', data: { user: responseUser } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.deleteUserById = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });
        res.status(200).json({ status: 'success', message: 'Successfully deleted user', data: null });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        const responseUser = formatUserResponse(user);

        res.status(200).json(responseUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


