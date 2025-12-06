// const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
// const Magazine = require('../models/magazineModel');

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// // Get all magazines for users
// exports.getAllUserMagazines = async (req, res) => {
//   try {
//     const magazines = await Magazine.find();
//     res.status(200).json({ success: true, data: magazines });
//   } catch (err) {
//     console.error('Error fetching magazines:', err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// // Download a magazine PDF
// exports.downloadMagazinePdf = async (req, res) => {
//     try {
//       const magazine = await Magazine.findById(req.params.id);
//       if (!magazine) {
//         return res.status(404).json({ error: 'Magazine not found' });
//       }
  
//       const params = {
//         Bucket: process.env.UPLOADS_PDF_BUCKET,
//         Key: magazine.pdf,
//       };
  
//       const command = new GetObjectCommand(params);
//       const data = await s3.send(command);
  
//       res.setHeader('Content-Type', 'application/pdf');
//       res.setHeader('Content-Disposition', `attachment; filename="${magazine.title}.pdf"`);
      
//       // Handle streaming the PDF file
//       data.Body.pipe(res).on('finish', () => {
//         console.log('PDF file streamed successfully');
//       }).on('error', (err) => {
//         console.error('Error streaming PDF:', err);
//         res.status(500).json({ error: 'Error streaming PDF file' });
//       });
//     } catch (err) {
//       console.error('Error in downloadMagazinePdf:', err);
//       res.status(500).json({ error: err.message });
//     }
//   };


// controllers/userMagazineController.js

const { GetObjectCommand } = require('@aws-sdk/client-s3');
const Magazine = require('../models/magazineModel');

// --- CHANGE 1: SAHI S3 CLIENT KO IMPORT KAREIN ---
// Path check karein. Agar s3.js file controllers ke bahar hai to '../s3' path aayega.
const { s3 } = require('../s3');

// --- CHANGE 2: PURANA, GALAT S3 CLIENT HATA DIYA GAYA HAI ---
// const s3 = new S3Client({ ... }); // <-- Yeh line ab yahan nahi hai.

// Helper function to format response with full URLs
const formatMagazineResponse = (magazine) => {
    if (!magazine) return null;
    const magazineObject = magazine.toObject();
    if (magazineObject.image) {
        magazineObject.image = `${process.env.DO_SPACES_URL}/${magazineObject.image}`;
    }
    if (magazineObject.pdf) {
        magazineObject.pdf = `${process.env.DO_SPACES_URL}/${magazineObject.pdf}`;
    }
    return magazineObject;
};

// Get all magazines for users
exports.getAllUserMagazines = async (req, res) => {
    try {
        const magazines = await Magazine.find();
        
        const magazinesWithUrls = magazines.map(mag => formatMagazineResponse(mag));
        
        res.status(200).json({ success: true, data: magazinesWithUrls });
    } catch (err) {
        console.error('Error fetching magazines:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Download a magazine PDF
exports.downloadMagazinePdf = async (req, res) => {
    try {
        const magazine = await Magazine.findById(req.params.id);
        if (!magazine) {
            return res.status(404).json({ error: 'Magazine not found' });
        }

        // Use the correct bucket name from environment variables
        const BUCKET_NAME = process.env.UPLOADSIMAGEBUCKET; 
        
        const params = {
            Bucket: BUCKET_NAME,
            Key: magazine.pdf, // The key already includes the folder path
        };

        const command = new GetObjectCommand(params);
        const data = await s3.send(command);

        res.setHeader('Content-Type', 'application/pdf');
        // Sanitize filename to prevent issues
        const safeFilename = magazine.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}.pdf"`);
        
        // Handle streaming the PDF file
        data.Body.pipe(res).on('finish', () => {
            console.log('PDF file streamed successfully');
        }).on('error', (err) => {
            console.error('Error streaming PDF:', err);
            // Avoid sending another response if headers are already sent
            if (!res.headersSent) {
                res.status(500).json({ error: 'Error streaming PDF file' });
            }
        });
    } catch (err) {
        console.error('Error in downloadMagazinePdf:', err);
        if (!res.headersSent) {
            res.status(500).json({ error: err.message });
        }
    }
};