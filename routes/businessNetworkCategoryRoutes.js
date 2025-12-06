// const express = require('express');
// const router = express.Router();
// const categoryController = require('../controllers/businessNetworkCategoryController');
// const { requireAuth } = require('../auth'); // Import authentication middleware
// const multer = require('multer');
// const path = require('path');

// // Configure multer storage for single image
// const storage = multer.diskStorage({
//   destination: './uploads',
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + path.extname(file.originalname);
//     cb(null, uniqueSuffix);
//   },
// });

// const uploadSingle = multer({ storage: storage }).single('image');

// // Route for adding a businessNetwork category
// router.post('/',  uploadSingle, categoryController.createCategory);

// // Protected routes
// router.get('/', categoryController.getCategories);
// router.get('/:id', categoryController.getCategoryById);
// router.put('/:id',  uploadSingle, categoryController.updateCategoryById);
// router.delete('/:id', categoryController.deleteCategoryById);

// module.exports = router;

// routes/businessNetworkCategoryRoutes.js

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/businessNetworkCategoryController');
const { requireAuth } = require('../auth'); // Assuming you use this
const multer = require('multer');

// --- CHANGE 1: diskStorage ko memoryStorage se badlein ---
// Ab files server ki disk par save nahi hongi, seedhe memory mein rahengi.
const upload = multer({
    storage: multer.memoryStorage()
});

// Route for adding a businessNetwork category
// --- CHANGE 2: 'uploadSingle' ki jagah seedhe 'upload.single('image')' ka istemal karein ---
router.post('/', upload.single('image'), categoryController.createCategory);

// Protected routes (ye aahi hain, inmein file upload nahi hota)
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);

// Update route mein bhi upload middleware ka istemal karein
router.put('/:id', upload.single('image'), categoryController.updateCategoryById);

// Delete route mein upload middleware ki zaroorat nahi hai
router.delete('/:id', categoryController.deleteCategoryById);

module.exports = router;