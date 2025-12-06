// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const router = express.Router();
// const userController = require('../controllers/userController');
// const newsController = require('../controllers/newsController');
// const login = require('../controllers/loginController')
// const eventsController = require('../controllers/eventsController');
// const kuldeviController = require('../controllers/kuldeviController');
// const rasamController = require('../controllers/rasamController');
// const classifiedController = require('../controllers/classifiedController');
// const categoryVratController = require('../controllers/vratCategoryController');
// const varatSubController = require('../controllers/vratSubCategoryController');
// const varatSubSubController = require('../controllers/vratSubSubCategoryController');
// const varatController = require('../controllers/vratController');
// const achiversController = require('../controllers/achiversController');
// const organisationsController = require('../controllers/organisationsController');
// const donationController = require('../controllers/donationController');
// const jobController = require('../controllers/jobsContoller');
// const jobApplicationsController= require('../controllers/jobApplicationController');
// const galleryController = require('../controllers/galleryController');
// const volunteerController = require('../controllers/volunteersController');
// const optionsController = require('../controllers/userSelectedOptionController')
// const packageController = require('../controllers/packageController');
// const matrimonyController = require('../controllers/userMatrimonyController')
// const matrimonyPackageSelectController = require("../controllers/userSelectMatrimonyPackages");
// const categoryNewsController = require('../controllers/newsCategoryController');
// const categoryEventsController = require('../controllers/eventsCategoryController');
// const categoryKuldeviController = require('../controllers/kuldeviCategoryController');
// const categoryRasamController = require('../controllers/rasamCategoryController');
// const categoryClassifiedController = require('../controllers/classifiedcategoryController');
// const categoryOccupationController = require('../controllers/jobCategoryController');
// const bannerController = require('../controllers/bannerController');
// const bannerBottomController = require('../controllers/bannerBottomController');
// const casteController = require("../controllers/addCasteController")
// const leadController = require("../controllers/leadController")
// const bloodDonorController = require('../controllers/bloodZoneController');
// const userSponsorController = require('../controllers/sponsorUserController')
// const magazineController =  require('../controllers/userMagazineController')
// const suggestionController = require('../controllers/userSuggestions')
// const categoryOptionsController = require("../controllers/optionsCategoryController")
// const aboutController = require('../controllers/aboutController')
// const { requireAuth } = require('../auth');




// const uploadaws = multer({
//     storage: multer.memoryStorage(),
//   });
// const uploadRegister = multer({
//     storage: multer.memoryStorage(),
//   });

// const uploadFields = uploadRegister.fields([
//     { name: 'image', maxCount: 1 },
//     { name: 'businessImages', maxCount: 10 }
// ]);

// const  uploadMultiple = multer({
//     storage: multer.memoryStorage(),
//   });

// router.post('/register', uploadFields, userController.registerUser);
// router.post('/login',  login.loginUser);

// router.post('/forgotpassword', userController.forgotPassword);
// router.post('/resetpassword', userController.resetPassword);

// router.get('/caste', casteController.getAllCastes);
// router.get('/occupation', categoryOccupationController.getCategories);
// router.use(requireAuth('user'))
// router.get('/getprofile', userController.getUserProfile);
// router.put('/updateprofile', uploadFields, userController.updateUserProfile);
// router.get('/getallusers', userController.getAllUsersExceptOwn);
// router.get('/getbyidusers/:id', userController.getUserById);




// router.get('/categorynews', categoryNewsController.getCategories);

// router.post('/addnews', uploadaws.single('image'), newsController.createUserNews);
// router.get('/news', newsController.getUserNews);
// router.get('/news/:id', newsController.getUserNewsById);
// router.put('/news/:id', uploadaws.single('image'), newsController.updateUserNewsById);
// router.delete('/news/:id', newsController.deleteUserNewsById);
// router.get('/getallnews', newsController.getAllNews);
// router.post('/newslike', newsController.likeNews);
// router.post('/newsunlike', newsController.unlikeNews);


// router.get('/eventscategory', categoryEventsController.getCategories);
// router.post('/addevents',  uploadaws.single('image'), eventsController.createUserEvents);
// router.get('/events', eventsController.getUserEvents);
// router.get('/events/:id', eventsController.getUserEventsById);
// router.put('/events/:id',uploadaws.single('image'), eventsController.updateUserEventsById);
// router.delete('/events/:id', eventsController.deleteUserEventsById);
// router.get('/getallevents', eventsController.getAllEvents);
// router.post('/eventslike', eventsController.likeEvents);
// router.post('/eventsunlike', eventsController.unlikeEvents);

// router.get('/kuldevicategory', categoryKuldeviController.getCategories);
// router.get('/kuldevi', kuldeviController.getAllKuldevis);

// router.get('/rasamcategory', categoryRasamController.getCategories);
// router.get('/rasam', rasamController.getAllRasams);

// router.get('/classifiedcategory', categoryClassifiedController.getAllCategories);
// router.post('/classified', uploadMultiple.array('images', 10), classifiedController.createUserClassified);
// router.get('/classified', classifiedController.getUserClassifieds);
// router.get('/classified/:id', classifiedController.getUserClassifiedById);
// router.put('/classified/:id', uploadMultiple.array('images', 10), classifiedController.updateUserClassifiedById);
// router.delete('/classified/:id', classifiedController.deleteUserClassifiedById);
// router.get('/classified-all', classifiedController.getAllClassifieds);



// router.get('/vratcategory', categoryVratController.getCategories);
// router.get('/vratsubcategory', varatSubController.getVarat);
// router.get('/vratsubsubcategory', varatSubSubController.getVarat);
// router.get('/vrat', varatController.getVarat);

// router.get('/achivers', achiversController.getAchivers);
// router.get('/organisations', organisationsController.getAllOrganisations);
// router.get('/donation', donationController.getDonations);


// router.get('/occupation', categoryOccupationController.getCategories);
// router.post('/jobs', uploadaws.single('image'), jobController.createJob);
// router.put('/jobs/:id', uploadaws.single('image'), jobController.updateJob);
// router.delete('/jobs/:id', jobController.deleteJob);
// router.get('/jobs/:id', jobController.getJobById);
// router.get('/jobs/',jobController.getAllJobs);

// router.post('/jobs/apply/:jobId', jobApplicationsController.applyForJob);
// router.get('/jobsapplied', jobApplicationsController.getAllAppliedJobs);
// router.get('/myjobs/applicants', jobApplicationsController.getAllApplicantsForMyJobs);


// router.get('/gallery', galleryController.getAllCategories);
// router.get('/volunteers', volunteerController.getAllVolunteers);

// router.post('/options', optionsController.createSelectedOption);
// router.get('/optionscategory', categoryOptionsController.getCategories);

// router.get('/packages', packageController.getAllPackagesForUser );
// //user getall sponsor packages
// router.get('/sponsor-packages', packageController.getAllSponsorPackagesForUser );


// router.get('/matrimonypackages', matrimonyPackageSelectController.getAllPackagesForUser);
// router.post('/selectpackagesmatrimony', matrimonyPackageSelectController.selectPackage);

// router.post('/matrimony', uploadMultiple.array('images'),matrimonyController.createMatrimony);
// router.get('/getownmatrimony', matrimonyController.getOwnMatrimony);
// router.put('/updateownmatrimony', uploadMultiple.array('images'),matrimonyController.updateOwnMatrimony);
// // router.delete('/deleteownmatrimony', matrimonyController.deleteOwnMatrimony);
// router.get('/allmatrimony', matrimonyController.getAllMatrimonysUser);
// router.get('/byIdmatrimony/:id', matrimonyController.getMatrimonyById);
// router.post('/wishlist',matrimonyController.addToWishlist);
// router.delete('/wishlist',matrimonyController.removeFromWishlist);

// router.post('/contactrequestsmatrimony/:id', matrimonyController.generateRequest );

// //get banner
// router.get('/userbanners', bannerController.getAllBannersForUser);
// //sponsor
// router.post('/sponsor', uploadaws.single('image'),userSponsorController.createUserSponsor);
// router.get('/sponsors', userSponsorController.getAllApprovedSponsors);
// router.get('/sponsors-own', userSponsorController.getAllOwnSponsors);
// router.get('/sponsors-own/:id', userSponsorController.getOwnSponsorById);
// router.put('/sponsors-own/:id', uploadaws.single('image'),userSponsorController.updateOwnSponsor);
// router.delete('/sponsors-own/:id', userSponsorController.deleteOwnSponsor);


// //business network
// router.post('/leads', leadController.addLead);

// // Get all leads created by the current user
// router.get('/leads/own', leadController.getOwnLeads);

// // Get a lead by ID
// router.get('/leads/:id', leadController.getLeadById);

// // Update a lead by ID
// router.put('/leads/:id', leadController.updateLead);

// // Delete a lead by ID
// router.delete('/leads/:id', leadController.deleteLead);

// // Get all leads created by other users
// router.get('/leadsothers', leadController.getAllOtherUserLeads);

// // Add interest to a lead
// router.post('/leadinterest/:id', leadController.showInterest);
// // Get all leads with users who showed interest
// router.get('/leadinterestlist', leadController.getUsersInterestedInMyLeads);

// //Blood Zone
// router.get('/blood-donor', bloodDonorController.getBloodZoneUsers);
// //Magazins
// router.get('/magazines', magazineController.getAllUserMagazines);
// router.get('/magazines/download/:id', magazineController.downloadMagazinePdf);
// //suggestions
// router.post('/suggestions', uploadaws.single('image'), suggestionController.addSuggestion);

// //getall about
// router.get('/getall', aboutController.getCategories);
// module.exports = router;



// routes/userRoutes.js
const express = require('express');
const multer = require('multer');
const router = express.Router();

// Controller Imports
const userController = require('../controllers/userController');
const newsController = require('../controllers/newsController');
const login = require('../controllers/loginController');
const eventsController = require('../controllers/eventsController');
const kuldeviController = require('../controllers/kuldeviController');
const rasamController = require('../controllers/rasamController');
const classifiedController = require('../controllers/classifiedController');
const categoryVratController = require('../controllers/vratCategoryController');
const varatSubController = require('../controllers/vratSubCategoryController');
const varatSubSubController = require('../controllers/vratSubSubCategoryController');
const varatController = require('../controllers/vratController');
const achiversController = require('../controllers/achiversController');
const organisationsController = require('../controllers/organisationsController');
const donationController = require('../controllers/donationController');
const jobController = require('../controllers/jobsContoller');
const jobApplicationsController = require('../controllers/jobApplicationController');
const galleryController = require('../controllers/galleryController');
const volunteerController = require('../controllers/volunteersController');
const optionsController = require('../controllers/userSelectedOptionController');
const packageController = require('../controllers/packageController');
const matrimonyController = require('../controllers/userMatrimonyController');
const matrimonyPackageSelectController = require("../controllers/userSelectMatrimonyPackages");
const categoryNewsController = require('../controllers/newsCategoryController');
const categoryEventsController = require('../controllers/eventsCategoryController');
const categoryKuldeviController = require('../controllers/kuldeviCategoryController');
const categoryRasamController = require('../controllers/rasamCategoryController');
const categoryClassifiedController = require('../controllers/classifiedcategoryController');
const categoryOccupationController = require('../controllers/jobCategoryController');
const bannerController = require('../controllers/bannerController');
const casteController = require("../controllers/addCasteController");
const leadController = require("../controllers/leadController");
const bloodDonorController = require('../controllers/bloodZoneController');
const userSponsorController = require('../controllers/sponsorUserController');
const magazineController = require('../controllers/userMagazineController');
const suggestionController = require('../controllers/userSuggestions');
const categoryOptionsController = require("../controllers/optionsCategoryController");
const aboutController = require('../controllers/aboutController');
const { requireAuth } = require('../auth');

// --- CORRECT & CLEAN MULTER CONFIGURATION ---
// We can use a single multer instance for all types of uploads.
const upload = multer({ storage: multer.memoryStorage() });


// --- ROUTES ---
router.post('/register', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'businessImages', maxCount: 10 }
]), userController.registerUser);

router.post('/login', login.loginUser);

router.post('/forgotpassword', userController.forgotPassword);
router.post('/resetpassword', userController.resetPassword);

router.get('/caste', casteController.getAllCastes);
router.get('/occupation', categoryOccupationController.getCategories);

// --- AUTHENTICATED ROUTES ---
router.use(requireAuth('user'));

router.get('/getprofile', userController.getUserProfile);
router.put('/updateprofile', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'businessImages', maxCount: 10 }
]), userController.updateUserProfile);
router.get('/getallusers', userController.getAllUsersExceptOwn);
router.get('/getbyidusers/:id', userController.getUserById);

// News Routes
router.get('/categorynews', categoryNewsController.getCategories);
router.post('/addnews', upload.single('image'), newsController.createUserNews);
router.get('/news', newsController.getUserNews);
router.get('/news/:id', newsController.getUserNewsById);
router.put('/news/:id', upload.single('image'), newsController.updateUserNewsById);
router.delete('/news/:id', newsController.deleteUserNewsById);
router.get('/getallnews', newsController.getAllNews);
router.post('/newslike', newsController.likeNews);
router.post('/newsunlike', newsController.unlikeNews);

// Events Routes
router.get('/eventscategory', categoryEventsController.getCategories);
router.post('/addevents', upload.single('image'), eventsController.createUserEvents);
router.get('/events', eventsController.getUserEvents);
router.get('/events/:id', eventsController.getUserEventsById);
router.put('/events/:id', upload.single('image'), eventsController.updateUserEventsById);
router.delete('/events/:id', eventsController.deleteUserEventsById);
router.get('/getallevents', eventsController.getAllEvents);
router.post('/eventslike', eventsController.likeEvents);
router.post('/eventsunlike', eventsController.unlikeEvents);

// Kuldevi & Rasam Routes
router.get('/kuldevicategory', categoryKuldeviController.getCategories);
router.get('/kuldevi', kuldeviController.getAllKuldevis);
router.get('/rasamcategory', categoryRasamController.getCategories);
router.get('/rasam', rasamController.getAllRasams);

// Classified Routes
router.get('/classifiedcategory', categoryClassifiedController.getAllCategories);
router.post('/classified', upload.array('images', 10), classifiedController.createUserClassified);
router.get('/classified', classifiedController.getUserClassifieds);
router.get('/classified/:id', classifiedController.getUserClassifiedById);
router.put('/classified/:id', upload.array('images', 10), classifiedController.updateUserClassifiedById);
router.delete('/classified/:id', classifiedController.deleteUserClassifiedById);
router.get('/classified-all', classifiedController.getAllClassifieds);

// Vrat Routes
router.get('/vratcategory', categoryVratController.getCategories);
router.get('/vratsubcategory', varatSubController.getVarat);
router.get('/vratsubsubcategory', varatSubSubController.getVarat);
router.get('/vrat', varatController.getVarat);

// General Info Routes
router.get('/achivers', achiversController.getAchivers);
router.get('/organisations', organisationsController.getAllOrganisations);
router.get('/donation', donationController.getDonations);

// Jobs Routes
router.get('/occupation', categoryOccupationController.getCategories);
router.post('/jobs', upload.single('image'), jobController.createJob);
router.put('/jobs/:id', upload.single('image'), jobController.updateJob);
router.delete('/jobs/:id', jobController.deleteJob);
router.get('/jobs/:id', jobController.getJobById);
router.get('/jobs/', jobController.getAllJobs);

// Job Application Routes
router.post('/jobs/apply/:jobId', jobApplicationsController.applyForJob);
router.get('/jobsapplied', jobApplicationsController.getAllAppliedJobs);
router.get('/myjobs/applicants', jobApplicationsController.getAllApplicantsForMyJobs);

// Gallery & Volunteers
router.get('/gallery', galleryController.getAllCategories);
router.get('/volunteers', volunteerController.getAllVolunteers);

// Options & Packages
router.post('/options', optionsController.createSelectedOption);
router.get('/optionscategory', categoryOptionsController.getCategories);
router.get('/packages', packageController.getAllPackagesForUser);
router.get('/sponsor-packages', packageController.getAllSponsorPackagesForUser);

// Matrimony Routes
router.get('/matrimonypackages', matrimonyPackageSelectController.getAllPackagesForUser);
router.post('/selectpackagesmatrimony', matrimonyPackageSelectController.selectPackage);
router.post('/matrimony', upload.array('images', 10), matrimonyController.createMatrimony);
router.get('/getownmatrimony', matrimonyController.getOwnMatrimony);
router.put('/updateownmatrimony', upload.array('images', 10), matrimonyController.updateOwnMatrimony);
router.get('/allmatrimony', matrimonyController.getAllMatrimonysUser);
router.get('/byIdmatrimony/:id', matrimonyController.getMatrimonyById);
router.post('/wishlist/:matrimonyId', matrimonyController.addToWishlist);
router.delete('/wishlist/:matrimonyId', matrimonyController.removeFromWishlist);
router.post('/contactrequestsmatrimony/:id', matrimonyController.generateRequest);

// Banner & Sponsor
router.get('/userbanners', bannerController.getAllBannersForUser);
router.post('/sponsor', upload.single('image'), userSponsorController.createUserSponsor);
router.get('/sponsors', userSponsorController.getAllApprovedSponsors);
router.get('/sponsors-own', userSponsorController.getAllOwnSponsors);
router.get('/sponsors-own/:id', userSponsorController.getOwnSponsorById);
router.put('/sponsors-own/:id', upload.single('image'), userSponsorController.updateOwnSponsor);
router.delete('/sponsors-own/:id', userSponsorController.deleteOwnSponsor);

// Business Network (Leads)
router.post('/leads', leadController.addLead);
router.get('/leads/own', leadController.getOwnLeads);
router.get('/leads/:id', leadController.getLeadById);
router.put('/leads/:id', leadController.updateLead);
router.delete('/leads/:id', leadController.deleteLead);
router.get('/leadsothers', leadController.getAllOtherUserLeads);
router.post('/leadinterest/:id', leadController.showInterest);
router.get('/leadinterestlist', leadController.getUsersInterestedInMyLeads);

// Blood Zone
router.get('/blood-donor', bloodDonorController.getBloodZoneUsers);

// Magazines
router.get('/magazines', magazineController.getAllUserMagazines);
router.get('/magazines/download/:id', magazineController.downloadMagazinePdf);

// Suggestions
router.post('/suggestions', upload.single('image'), suggestionController.addSuggestion);

// About
router.get('/getall', aboutController.getCategories);

module.exports = router;