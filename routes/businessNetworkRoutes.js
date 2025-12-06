// const express = require('express');
// const router = express.Router();
// const businessNetworkController = require('../controllers/businessNetworkController');
// const { requireAuth } = require('../auth'); // Import authentication middleware
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });

// // Route for adding businessNetwork
// router.post('/',  upload.single('image'), businessNetworkController.createbusinessNetwork);

// // Protected routes
// router.get('/', businessNetworkController.getbusinessNetwork);
// router.get('/:id', businessNetworkController.getbusinessNetworkById);
// router.put('/:id',upload.single('image'), businessNetworkController.updatebusinessNetworkById);
// router.delete('/:id', businessNetworkController.deletebusinessNetworkById);

// module.exports = router;


// routes/businessNetworkRoutes.js

const express = require('express');
const router = express.Router();
const businessNetworkController = require('../controllers/businessNetworkController');
const { requireAuth } = require('../auth'); // Import authentication middleware
const multer = require('multer');

// --- CHANGE IS HERE ---
// 'dest' hata kar 'memoryStorage' ka istemal karein.
// const upload = multer({ dest: 'uploads/' }); // <-- OLD, INCORRECT LINE
const upload = multer({ storage: multer.memoryStorage() }); // <-- NEW, CORRECT LINE

// Route for adding businessNetwork
router.post('/', upload.single('image'), businessNetworkController.createbusinessNetwork);

// Protected routes
router.get('/', businessNetworkController.getbusinessNetwork);
router.get('/:id', businessNetworkController.getbusinessNetworkById);
router.put('/:id', upload.single('image'), businessNetworkController.updatebusinessNetworkById);
router.delete('/:id', businessNetworkController.deletebusinessNetworkById);

module.exports = router;