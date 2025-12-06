// const { S3Client, PutObjectCommand ,DeleteObjectCommand} = require('@aws-sdk/client-s3');
// const { v4: uuidv4 } = require('uuid');
// const Magazine = require('../models/magazineModel');

// // Initialize S3 client
// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// exports.createMagazine = async (req, res) => {
//   const { title } = req.body;
//   const pdfFile = req.files?.pdf?.[0];
//   const imageFile = req.files?.image?.[0];

//   const pdfKey = pdfFile ? `${uuidv4()}_${pdfFile.originalname}` : null;
//   const imageKey = imageFile ? `${uuidv4()}_${imageFile.originalname}` : null;

//   if (!pdfKey || !imageKey) {
//     return res.status(400).json({ success: false, error: 'Both PDF and image are required' });
//   }

//   if (!title) {
//     return res.status(400).json({ success: false, error: 'Title is required' });
//   }

//   try {
//     const pdfBucket = process.env.UPLOADS_PDF_BUCKET;
//     const imageBucket = process.env.UPLOADSIMAGEBUCKET;

//     console.log('PDF Bucket:', pdfBucket);
//     console.log('Image Bucket:', imageBucket);

//     if (!pdfBucket || !imageBucket) {
//       throw new Error('Bucket names are not defined in environment variables');
//     }

//     // Upload PDF
//     const pdfParams = {
//       Bucket: pdfBucket,
//       Key: pdfKey,
//       Body: pdfFile.buffer,
//       ContentType: pdfFile.mimetype,
//     };
//     await s3.send(new PutObjectCommand(pdfParams));

//     // Upload image
//     const imageParams = {
//       Bucket: imageBucket,
//       Key: imageKey,
//       Body: imageFile.buffer,
//       ContentType: imageFile.mimetype,
//     };
//     await s3.send(new PutObjectCommand(imageParams));

//     // Create magazine entry
//     const newMagazine = await Magazine.create({
//       title,
//       pdf: pdfKey,
//       image: imageKey,
//     });

//     res.status(201).json({ success: true, data: newMagazine });
//   } catch (err) {
//     console.error('Error uploading files:', err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };


// exports.getAllMagazines = async (req, res) => {
//   try {
//     const magazines = await Magazine.find();
//     res.status(200).json({ success: true, data: magazines });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };


// // Get magazine by ID
// exports.getMagazineById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const magazine = await Magazine.findById(id);

//     if (!magazine) {
//       return res.status(404).json({ success: false, error: 'Magazine not found' });
//     }

//     res.status(200).json({ success: true, data: magazine });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };



// // Update a magazine
// exports.updateMagazine = async (req, res) => {
//   const { id } = req.params;
//   const { title } = req.body;
//   const pdfFile = req.files?.pdf?.[0];
//   const imageFile = req.files?.image?.[0];

//   const updateFields = {};
  
//   if (title) updateFields.title = title;
//   if (pdfFile) updateFields.pdf = `${uuidv4()}_${pdfFile.originalname}`;
//   if (imageFile) updateFields.image = `${uuidv4()}_${imageFile.originalname}`;

//   try {
//     const magazine = await Magazine.findById(id);

//     if (!magazine) {
//       return res.status(404).json({ success: false, error: 'Magazine not found' });
//     }

//     // Upload new files if present
//     if (pdfFile) {
//       const pdfParams = {
//         Bucket: process.env.UPLOADS_PDF_BUCKET,
//         Key: updateFields.pdf,
//         Body: pdfFile.buffer,
//         ContentType: pdfFile.mimetype,
//       };
//       await s3.send(new PutObjectCommand(pdfParams));
//     }

//     if (imageFile) {
//       const imageParams = {
//         Bucket: process.env.UPLOADSIMAGEBUCKET,
//         Key: updateFields.image,
//         Body: imageFile.buffer,
//         ContentType: imageFile.mimetype,
//       };
//       await s3.send(new PutObjectCommand(imageParams));
//     }

//     // Update magazine entry
//     const updatedMagazine = await Magazine.findByIdAndUpdate(id, updateFields, { new: true });

//     res.status(200).json({ success: true, data: updatedMagazine });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };



// // Delete a magazine
// exports.deleteMagazine = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const magazine = await Magazine.findById(id);

//     if (!magazine) {
//       return res.status(404).json({ success: false, error: 'Magazine not found' });
//     }

//     // Delete files from S3
//     await s3.send(new DeleteObjectCommand({
//       Bucket: process.env.UPLOADS_PDF_BUCKET,
//       Key: magazine.pdf,
//     }));
//     await s3.send(new DeleteObjectCommand({
//       Bucket: process.env.UPLOADSIMAGEBUCKET,
//       Key: magazine.image,
//     }));

//     // Delete magazine entry
//     await Magazine.findByIdAndDelete(id);

//     res.status(200).json({ success: true, message: 'Magazine deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };


// controllers/adminMagazineController.js

const { v4: uuidv4 } = require('uuid');
const Magazine = require('../models/magazineModel');
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

// --- CHANGE 1: SAHI S3 CLIENT KO IMPORT KAREIN ---
// Path check karein. Agar s3.js file controllers ke bahar hai to '../s3' path aayega.
const { s3 } = require('../s3');

// --- CHANGE 2: PURANA, GALAT S3 CLIENT HATA DIYA GAYA HAI ---
// const s3 = new S3Client({ ... }); // <-- Yeh line ab yahan nahi hai.

exports.createMagazine = async (req, res) => {
    const { title } = req.body;
    const pdfFile = req.files?.pdf?.[0];
    const imageFile = req.files?.image?.[0];

    if (!pdfFile || !imageFile) {
        return res.status(400).json({ success: false, error: 'Both PDF and image are required' });
    }
    if (!title) {
        return res.status(400).json({ success: false, error: 'Title is required' });
    }

    try {
        const BUCKET_NAME = process.env.UPLOADSIMAGEBUCKET; // Ek hi bucket use karein
        const pdfKey = `magazines/pdfs/${uuidv4()}_${pdfFile.originalname}`;
        const imageKey = `magazines/images/${uuidv4()}_${imageFile.originalname}`;

        // Upload PDF
        const pdfParams = {
            Bucket: BUCKET_NAME,
            Key: pdfKey,
            Body: pdfFile.buffer,
            ContentType: pdfFile.mimetype,
            ACL: 'public-read'
        };
        await s3.send(new PutObjectCommand(pdfParams));

        // Upload image
        const imageParams = {
            Bucket: BUCKET_NAME,
            Key: imageKey,
            Body: imageFile.buffer,
            ContentType: imageFile.mimetype,
            ACL: 'public-read'
        };
        await s3.send(new PutObjectCommand(imageParams));

        const newMagazine = await Magazine.create({
            title,
            pdf: pdfKey,
            image: imageKey,
        });
        
        // --- RESPONSE MEIN URL BANANE KA LOGIC ---
        const responseMagazine = newMagazine.toObject();
        responseMagazine.pdf = `${process.env.DO_SPACES_URL}/${responseMagazine.pdf}`;
        responseMagazine.image = `${process.env.DO_SPACES_URL}/${responseMagazine.image}`;

        res.status(201).json({ success: true, data: responseMagazine });
    } catch (err) {
        console.error('Error uploading files:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getAllMagazines = async (req, res) => {
    try {
        const magazines = await Magazine.find();
        
        // --- RESPONSE MEIN URL BANANE KA LOGIC ---
        const magazinesWithUrls = magazines.map(mag => {
            const magObject = mag.toObject();
            magObject.pdf = `${process.env.DO_SPACES_URL}/${magObject.pdf}`;
            magObject.image = `${process.env.DO_SPACES_URL}/${magObject.image}`;
            return magObject;
        });

        res.status(200).json({ success: true, data: magazinesWithUrls });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getMagazineById = async (req, res) => {
    const { id } = req.params;
    try {
        const magazine = await Magazine.findById(id);
        if (!magazine) {
            return res.status(404).json({ success: false, error: 'Magazine not found' });
        }
        
        // --- RESPONSE MEIN URL BANANE KA LOGIC ---
        const responseMagazine = magazine.toObject();
        responseMagazine.pdf = `${process.env.DO_SPACES_URL}/${responseMagazine.pdf}`;
        responseMagazine.image = `${process.env.DO_SPACES_URL}/${responseMagazine.image}`;

        res.status(200).json({ success: true, data: responseMagazine });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.updateMagazine = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const pdfFile = req.files?.pdf?.[0];
    const imageFile = req.files?.image?.[0];

    const BUCKET_NAME = process.env.UPLOADSIMAGEBUCKET;
    const updateFields = {};

    try {
        const magazine = await Magazine.findById(id);
        if (!magazine) {
            return res.status(404).json({ success: false, error: 'Magazine not found' });
        }

        if (title) updateFields.title = title;

        if (pdfFile) {
            updateFields.pdf = `magazines/pdfs/${uuidv4()}_${pdfFile.originalname}`;
            const pdfParams = { Bucket: BUCKET_NAME, Key: updateFields.pdf, Body: pdfFile.buffer, ContentType: pdfFile.mimetype, ACL: 'public-read' };
            await s3.send(new PutObjectCommand(pdfParams));
        }

        if (imageFile) {
            updateFields.image = `magazines/images/${uuidv4()}_${imageFile.originalname}`;
            const imageParams = { Bucket: BUCKET_NAME, Key: updateFields.image, Body: imageFile.buffer, ContentType: imageFile.mimetype, ACL: 'public-read' };
            await s3.send(new PutObjectCommand(imageParams));
        }

        const updatedMagazine = await Magazine.findByIdAndUpdate(id, updateFields, { new: true });
        
        // --- RESPONSE MEIN URL BANANE KA LOGIC ---
        const responseMagazine = updatedMagazine.toObject();
        if (responseMagazine.pdf && !responseMagazine.pdf.startsWith('http')) {
             responseMagazine.pdf = `${process.env.DO_SPACES_URL}/${responseMagazine.pdf}`;
        }
        if (responseMagazine.image && !responseMagazine.image.startsWith('http')) {
             responseMagazine.image = `${process.env.DO_SPACES_URL}/${responseMagazine.image}`;
        }
        
        res.status(200).json({ success: true, data: responseMagazine });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.deleteMagazine = async (req, res) => {
    const { id } = req.params;
    const BUCKET_NAME = process.env.UPLOADSIMAGEBUCKET;

    try {
        const magazine = await Magazine.findById(id);
        if (!magazine) {
            return res.status(404).json({ success: false, error: 'Magazine not found' });
        }

        await s3.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: magazine.pdf, }));
        await s3.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: magazine.image, }));

        await Magazine.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: 'Magazine deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};