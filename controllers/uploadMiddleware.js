// const multer = require('multer');
// const path = require('path');

// // Define storage options for multer
// const storage = multer.diskStorage({
//     destination: './uploads', // Specify your destination directory
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + path.extname(file.originalname);
//         cb(null, uniqueSuffix);
//     }
// });

// // Configure multer upload settings
// const upload = multer({
//     storage: storage,
//     fileFilter: (req, file, cb) => {
//         if (file.fieldname === 'image' || file.fieldname === 'businessImages') {
//             cb(null, true); // Accept the file
//         } else {
//             cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
//         }
//     }
// });

// // Middleware to handle fields and uploads
// const uploadFields = upload.fields([
//     { name: 'image', maxCount: 1 },
//     { name: 'businessImages', maxCount: 10 }
// ]);

// module.exports = { uploadFields };

// middleware/uploadMiddleware.js

const multer = require('multer');

// --- CHANGE 1: diskStorage ko memoryStorage se badlein ---
// Ab files server ki disk par save nahi hongi, seedhe memory mein rahengi.
const storage = multer.memoryStorage();

// Configure multer upload settings
const upload = multer({
    storage: storage,
    // File filter waise hi rahega, usmein koi badlaav ki zaroorat nahi hai.
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'image' || file.fieldname === 'businessImages') {
            cb(null, true);
        } else {
            cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
        }
    }
});

// Middleware to handle fields and uploads
// Yeh waise hi kaam karega jaise pehle kar raha tha.
const uploadFields = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'businessImages', maxCount: 10 }
]);

module.exports = { uploadFields };