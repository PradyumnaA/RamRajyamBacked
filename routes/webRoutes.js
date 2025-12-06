// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

const eventsController = require('../controllers/eventsController');

const galleryController = require('../controllers/galleryController');
const bannerController = require('../controllers/bannerController');
const bannerBottomController = require('../controllers/bannerBottomController');
router.get('/getallnews', newsController.getAllNewsWeb);
// router.get('/news/:id', newsController.getUserNewsById);


router.get('/events', eventsController.getAllEventsWeb);
// router.get('/events/:id', eventsController.getAdminEventsById);


router.get('/gallery', galleryController.getAllGalleryWeb);
// router.get('/gallery/:id', galleryController.getCategoryById);

router.get('/userbanners', bannerController.getAllBannersPublic);


module.exports = router;
