// const Job = require('../models/jobsModel');
// const { v4: uuidv4 } = require('uuid');
// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// const createJob = async (req, res) => {
//   try {
//     const { title, salary, description, category, companyName, address, pincode } = req.body;
//     const imageKey = req.file ? `${uuidv4()}_${req.file.originalname}` : null;
//     if (!imageKey) {
//       return res.status(400).json({ error: 'Image is required' });
//     }

//     const params = {
//       Bucket: process.env.UPLOADSIMAGEBUCKET,
//       Key: imageKey,
//       Body: req.file.buffer,
//       ContentType: req.file.mimetype,
//     };

//     const data = await s3.send(new PutObjectCommand(params));
//     console.log('Successfully uploaded file:', data);

//     const job = new Job({
//       title,
//       salary,
//       description,
//       image: imageKey,
//       category,
//       companyName,
//       address,
//       pincode,
//       createdBy: req.user._id,
//       status: 'pending',
//       isApproved: false,
//     });

//     await job.save();

//     const response = {
//       ...job.toObject(),
//       createdBy: req.user,
//       isApproved: false,
//     };

//     res.status(201).json(response);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// const updateJob = async (req, res) => {
//   try {
//     const { title, salary, description, status, category, companyName, address, pincode } = req.body;
//     const updateData = { title, salary, description, category, companyName, address, pincode };
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
//       updateData.image = imageKey;
//     }
//     if (status) updateData.status = status;

//     const job = await Job.findOneAndUpdate(
//       { id: req.params.id, createdBy: req.user._id },
//       updateData,
//       { new: true }
//     );

//     if (!job) {
//       return res.status(404).json({ message: 'Job not found or not authorized' });
//     }

//     const response = {
//       ...job.toObject(),
//       createdBy: req.user,
//       isApproved: job.status === 'approved',
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// const deleteJob = async (req, res) => {
//   try {
//     const job = await Job.findOneAndDelete({ id: req.params.id, createdBy: req.user._id });
//     if (!job) {
//       return res.status(404).json({ message: 'Job not found or not authorized' });
//     }
//     res.status(200).json({ message: 'Job deleted successfully' });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// const getJobById = async (req, res) => {
//   try {
//     const job = await Job.findOne({ id: req.params.id, createdBy: req.user._id });
//     if (!job) {
//       return res.status(404).json({ message: 'Job not found or not authorized' });
//     }
//     const response = {
//       ...job.toObject(),
//       createdBy: req.user,
//       isApproved: job.status === 'approved',
//     };
//     res.status(200).json(response);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// const getAllJobs = async (req, res) => {
//   const { page = 1, limit = 10, title, salary, startDate, endDate, pincode } = req.query;
//   const query = {
//     ...title && { title: new RegExp(title, 'i') },
//     ...salary && { salary: new RegExp(salary, 'i') },
//     ...startDate && endDate && { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } },
//     ...pincode && { pincode: new RegExp(pincode, 'i') },
//     status: 'approved',
//   };

//   try {
//     const jobs = await Job.find(query)
//       .populate('createdBy', 'name email')
//       .populate('category', 'name')
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .exec();
//     const count = await Job.countDocuments(query);

//     const response = jobs.map(job => ({
//       ...job.toObject(),
//       createdBy: job.createdBy,
//       isApproved: true,
//     }));

//     res.status(200).json({
//       jobs: response,
//       totalPages: Math.ceil(count / limit),
//       currentPage: page
//     });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// module.exports = {
//   createJob,
//   updateJob,
//   deleteJob,
//   getJobById,
//   getAllJobs
// };


// controllers/jobsContoller.js

const Job = require('../models/jobsModel');
const { v4: uuidv4 } = require('uuid');
const Category = require('../models/jobCategoryModels');
const { PutObjectCommand } = require('@aws-sdk/client-s3');

// --- CHANGE 1: SAHI S3 CLIENT KO IMPORT KAREIN ---
// Path check karein. Agar s3.js file controllers ke bahar hai to '../s3' path aayega.
const { s3 } = require('../s3');

// --- CHANGE 2: PURANA, GALAT S3 CLIENT HATA DIYA GAYA HAI ---
// const s3 = new S3Client({ ... }); // <-- Yeh line ab yahan nahi hai.

// Helper function to format response with full URLs
const formatJobResponse = async (job, user = null) => {
    if (!job) return null;
    const jobObject = job.toObject();
    
    // Convert job image key to full URL
    if (jobObject.image) {
        jobObject.image = `${process.env.DO_SPACES_URL}/${jobObject.image}`;
    }

    // Populate and format category details
    const categoryDetails = await Category.findById(jobObject.category);
    if (categoryDetails) {
        jobObject.category = categoryDetails.toObject();
        if (jobObject.category.image) {
            jobObject.category.image = `${process.env.DO_SPACES_URL}/${jobObject.category.image}`;
        }
    } else {
        jobObject.category = null;
    }
    
    if (user) jobObject.createdBy = user;
    return jobObject;
};


const createJob = async (req, res) => {
    try {
        const { title, salary, description, category, companyName, address, pincode } = req.body;
        
        if (!req.file) return res.status(400).json({ error: 'Image is required' });

        const imageKey = `jobs/${uuidv4()}_${req.file.originalname}`;
        const params = { Bucket: process.env.UPLOADSIMAGEBUCKET, Key: imageKey, Body: req.file.buffer, ContentType: req.file.mimetype, ACL: 'public-read' };
        await s3.send(new PutObjectCommand(params));

        const job = new Job({
            title, salary, description, image: imageKey,
            category, companyName, address, pincode,
            createdBy: req.user._id, status: 'pending', isApproved: false,
        });
        await job.save();
        
        const response = await formatJobResponse(job, req.user);
        res.status(201).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateJob = async (req, res) => {
    try {
        const { title, salary, description, category, companyName, address, pincode } = req.body;
        
        const job = await Job.findOne({ _id: req.params.id, createdBy: req.user._id });
        if (!job) return res.status(404).json({ message: 'Job not found or not authorized' });

        const updateData = { title, salary, description, category, companyName, address, pincode, status: 'pending' };
        
        if (req.file) {
            const imageKey = `jobs/${uuidv4()}_${req.file.originalname}`;
            const params = { Bucket: process.env.UPLOADSIMAGEBUCKET, Key: imageKey, Body: req.file.buffer, ContentType: req.file.mimetype, ACL: 'public-read' };
            await s3.send(new PutObjectCommand(params));
            updateData.image = imageKey;
        } else if (req.body.image) {
             updateData.image = req.body.image.startsWith('http') ? req.body.image.split(process.env.DO_SPACES_URL + '/')[1] : req.body.image;
        }

        const updatedJob = await Job.findByIdAndUpdate(req.params.id, updateData, { new: true });
        
        const response = await formatJobResponse(updatedJob, req.user);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteJob = async (req, res) => {
    try {
        const job = await Job.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
        if (!job) return res.status(404).json({ message: 'Job not found or not authorized' });
        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        
        const response = await formatJobResponse(job);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllJobs = async (req, res) => {
    const { page = 1, limit = 10, title, pincode } = req.query;
    const query = {
        status: 'approved',
        ...(title && { title: new RegExp(title, 'i') }),
        ...(pincode && { pincode: pincode }),
    };

    try {
        const jobs = await Job.find(query).populate('category').limit(limit * 1).skip((page - 1) * limit);
        const count = await Job.countDocuments(query);
        
        const response = await Promise.all(jobs.map(job => formatJobResponse(job)));

        res.status(200).json({
            jobs: response,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createJob,
    updateJob,
    deleteJob,
    getJobById,
    getAllJobs
};