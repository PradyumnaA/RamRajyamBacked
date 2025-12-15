
require('dotenv').config();

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
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

// Function to generate a unique referral code with 6 alphanumeric characters
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
    if (!user) return null;
    const userObject = user.toObject();
    if (userObject.image) {
        userObject.image = `${process.env.DO_SPACES_URL}/${userObject.image}`;
    }
    if (userObject.businessProfile && userObject.businessProfile.businessImages && userObject.businessProfile.businessImages.length > 0) {
        userObject.businessProfile.businessImages = userObject.businessProfile.businessImages.map(img => `${process.env.DO_SPACES_URL}/${img}`);
    }
    // Remove password from the response object
    delete userObject.password;
    return userObject;
};

exports.registerUser = async (req, res) => {
    try {
        const {
            fullName, email, password, contactNo, state, bloodGroup, pincode, address, city,
            subcaste, nativeOf, homeDistrict, homeCity, caste, gotra, kuldeviName, bloodYN, selectedJobCategories,
            referralCode, gender
        } = req.body;

        if (!fullName || !password || !gender) {
            return res.status(400).json({ status: 'fail', message: 'Full name, password, and gender are required.' });
        }

        const existingUser = await User.findOne({ $or: [{ contactNo }, { email }] });
        if (existingUser) return res.status(400).json({ status: 'fail', message: 'Email or contact number already exists' });

        let userReferralCode = referralCode || generateReferralCode();
        while (await User.findOne({ referralCode: userReferralCode })) {
            userReferralCode = generateReferralCode();
        }

        let singleImagePath;
        let businessImagePaths = [];
        if (req.files) {
            try {
                if (req.files.image) singleImagePath = await uploadFileToS3(req.files.image[0], 'user-profiles');
                if (req.files.businessImages) {
                    for (const file of req.files.businessImages) {
                        const key = await uploadFileToS3(file, 'business-images');
                        businessImagePaths.push(key);
                    }
                }
            } catch (uploadError) {
                console.warn('File upload failed, proceeding without images:', uploadError.message);
                // Allow registration to continue even if upload fails
            }
        }
        
        const highestIdUser = await User.findOne({}, {}, { sort: { id: -1 } });
        let nextId = highestIdUser ? highestIdUser.id + 1 : 1;

        const hashedPassword = await bcrypt.hash(password, 12);
        
        const newUser = new User({
            id: nextId, fullName, email, password: hashedPassword, contactNo, image: singleImagePath, selectedJobCategories, bloodYN,
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
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ status: 'fail', message: 'User profile not found' });
        
        const responseUser = formatUserResponse(user);
        res.status(200).json({ status: 'success', data: responseUser });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const { ...updateData } = req.body;
        delete updateData.password; // Password should be updated via reset flow

        if (req.files) {
            if (req.files.image) {
                updateData.image = await uploadFileToS3(req.files.image[0], 'user-profiles');
            }
            if (req.files.businessImages) {
                const businessImagePaths = [];
                for (const file of req.files.businessImages) {
                    const key = await uploadFileToS3(file, 'business-images');
                    businessImagePaths.push(key);
                }
                updateData['businessProfile.businessImages'] = businessImagePaths;
            }
        }
        
        const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'User profile not found' });
        
        const responseUser = formatUserResponse(updatedUser);
        res.status(200).json(responseUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllUsersExceptOwn = async (req, res) => {
    try {
        console.log('Fetching users... Current user ID:', req.user._id);
        
        // Fetch all users except the current user and exclude admin users
        // Simple approach: get all users except current, filter out admins
        const users = await User.find({ 
            _id: { $ne: req.user._id }
        });
        
        // Filter out admin users in code (more reliable)
        const filteredUsers = users.filter(user => user.role !== 'admin');
        
        console.log('Total users found:', users.length, 'After filtering:', filteredUsers.length);
        
        const usersWithUrls = filteredUsers.map(user => formatUserResponse(user));
        res.status(200).json({ status: 'success', data: usersWithUrls });
    } catch (error) {
        console.error('Error in getAllUsersExceptOwn:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error', error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });
        
        const responseUser = formatUserResponse(user);
        res.status(200).json({ status: 'success', data: responseUser });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'Gmail', // or use your own SMTP server details here
    auth: {
        user: process.env.EMAIL_USER, // Use environment variable for email
        pass: process.env.EMAIL_PASS  // Use environment variable for app password
    }
});

// Function to send reset email
const sendResetEmail = async (email, resetToken) => {
    const resetLink = `http://localhost:5000/reset-password?token=${resetToken}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset',
        text: `Click the following link to reset your password: ${resetLink}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Reset email sent');
    } catch (error) {
        console.error('Error sending reset email:', error);
        throw error; // Re-throw the error to be handled in the API
    }
};

// Forgot password controller function
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();
        await sendResetEmail(user.email, resetToken);

        res.status(200).json({ message: 'Password reset link sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Reset password API
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid or expired reset token'
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Password has been reset successfully'
        });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Internal server error'
        });
    }
};

// ADMIN ONLY: Delete a user by ID (called from admin panel)
exports.deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate user ID
        if (!id) {
            return res.status(400).json({
                status: 'fail',
                message: 'User ID is required'
            });
        }

        // Find and delete the user
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'User deleted successfully',
            data: { deletedUser: user.fullName }
        });
    } catch (error) {
        console.error('Error in deleteUserById:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};