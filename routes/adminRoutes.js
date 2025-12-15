// // routes/adminRoutes.js
// const express = require('express');
// const router = express.Router();
// const path = require('path');
// const multer = require('multer');
// const { registerAdmin, loginAdmin } = require('../controllers/adminController');


// const categoryOccupationController = require('../controllers/jobCategoryController');
// const businessNetworkRoutes = require('./businessNetworkRoutes');
// const userController = require('../controllers/AdminuserController');
// const categoryNewsController = require('../controllers/newsCategoryController');
// const newsController = require('../controllers/newsAdminController');
// const businessController = require('../controllers/businessDirectoryController');
// const bloodDonorController = require('../controllers/bloodZoneController');
// const bankController = require('../controllers/bloodBankController');
// const categoryEventsController = require('../controllers/eventsCategoryController');
// const eventsController = require('../controllers/eventsAdminController');
// const categoryKuldeviController = require('../controllers/kuldeviCategoryController');
// const kuldeviController = require('../controllers/kuldeviController');
// const categoryRasamController = require('../controllers/rasamCategoryController');
// const rasamController = require('../controllers/rasamController');
// const categoryClassifiedController = require('../controllers/classifiedcategoryController');
// const classifiedController = require('../controllers/classifiedAdminController');
// const categoryVratController = require('../controllers/vratCategoryController');
// const varatSubController = require('../controllers/vratSubCategoryController');
// const varatSubSubController = require('../controllers/vratSubSubCategoryController');
// const varatController = require('../controllers/vratController');
// const categoryAchiversController = require('../controllers/achiversCategoryController');
// const achiversController = require('../controllers/achiversController');
// const organisationsController = require('../controllers/organisationsController');
// const donationController = require('../controllers/donationController');
// const jobController = require('../controllers/jobsAdminController');
// const categoryGalleryController = require('../controllers/galleryCategoryController');
// const galleryController = require('../controllers/galleryController');
// const volunteerController = require('../controllers/volunteersController');

// const categoryOptionsController = require("../controllers/optionsCategoryController")
// const optionsController = require('../controllers/userSelectedOptionController')
// const packageController = require('../controllers/packageController');
// const matrimonyController = require('../controllers/adminMatrimonyController');
// const matrimonyPackageController = require('../controllers/adminMatrimonyPackageController');
// const contactMatrimonyController = require('../controllers/adminContactMatrimonyController')
// const casteController = require("../controllers/addCasteController")
// const bannerController = require('../controllers/bannerController');
// const bannerBottomController = require('../controllers/bannerBottomController');
// const adminSponsorController = require('../controllers/adminSponsorController')
// const magazineController = require('../controllers/adminMagazineController')
// const suggestionController = require('../controllers/adminSuggestions')
// const aboutController = require('../controllers/aboutController')
// const {requireAuth} = require("../auth")


// // const storage = multer.diskStorage({
// //     destination: './uploads',
// //     filename: (req, file, cb) => {
// //         const uniqueSuffix = Date.now() + '-' + path.extname(file.originalname);
// //         cb(null, uniqueSuffix);
// //     }
// // });

// // const upload = multer({
// //     storage: storage,
// //     fileFilter: (req, file, cb) => {
// //         if (file.fieldname === "image" || file.fieldname === "businessImages") {
// //             cb(null, true);
// //         } else {
// //             cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
// //         }
// //     }
// // });
// // const uploadRegister = multer({
// //     storage: multer.memoryStorage(),
// //   });

// // const uploadFields = uploadRegister.fields([
// //     { name: 'image', maxCount: 1 },
// //     { name: 'businessImages', maxCount: 10 }
// // ]);
// // const uploadaws = multer({
// //     storage: multer.memoryStorage(),
// //   });
// //   const uploadFiles = multer({ storage }).fields([
// //     { name: 'pdf', maxCount: 1 },
// //     { name: 'image', maxCount: 1 }
// //   ]);
// //   const  uploadMultiple = multer({
// //     storage: multer.memoryStorage(),
// //   });

// const upload = multer({ storage: multer.memoryStorage() });


// router.post('/register', registerAdmin);
// router.post('/login', loginAdmin);

// router.use(requireAuth('admin'))
// router.post('/registeruser', uploadFields, userController.registerUser);
// router.get('/users', userController.getAllUsers);

// router.post('/caste', upload.none(),casteController.addEntry);
// router.get('/caste', casteController.getAllEntries);
// router.get('/caste/:id', upload.none(),casteController.getEntryById);
// router.put('/caste/:id', upload.none(),casteController.updateEntry);
// router.delete('/caste/:id', casteController.deleteEntry);

// router.get('/users/:id', userController.getUserById);
// router.put('/users/:id', uploadFields, userController.updateUserById);
// router.delete('/users/:id', userController.deleteUserById);

// router.post('/addcategory',  uploadaws.single('image'), categoryNewsController.createCategory);
// router.get('/category', categoryNewsController.getCategories);
// router.get('/category/:id', categoryNewsController.getCategoryById);
// router.put('/category/:id',  uploadaws.single('image'), categoryNewsController.updateCategoryById);
// router.delete('/category/:id', categoryNewsController.deleteCategoryById);


// router.post('/addnews', uploadaws.single('image'), newsController.createAdminNews);
// router.get('/news', newsController.getAllNews);
// router.get('/news/:id', newsController.getAdminNewsById);
// router.put('/news/:id', uploadaws.single('image'), newsController.updateAdminNewsById);
// router.delete('/news/:id', newsController.deleteAdminNewsById);

// router.get('/businessdirectory', businessController.getBusinessDirectoryUsers);

// router.get('/blooddonor', bloodDonorController.getBloodZoneUsers);

// router.post('/bloodBank', bankController.createBank);
// router.put('/bloodBank/:id', bankController.updateBankById);
// router.delete('/bloodBank/:id', bankController.deleteBankById);
// router.get('/bloodBank/:id', bankController.getBankById);
// router.get('/bloodBank', bankController.getAllBanks);

// router.post('/addeventscategory', uploadaws.single('image'), categoryEventsController.createCategory);
// router.get('/eventscategory', categoryEventsController.getCategories);
// router.get('/eventscategory/:id', categoryEventsController.getCategoryById);
// router.put('/eventscategory/:id', uploadaws.single('image'), categoryEventsController.updateCategoryById);
// router.delete('/eventscategory/:id', categoryEventsController.deleteCategoryById);

// router.post('/addevents',  uploadaws.single('image'), eventsController.createAdminEvents);
// router.get('/events', eventsController.getAllEvents);
// router.get('/events/:id', eventsController.getAdminEventsById);
// router.put('/events/:id',uploadaws.single('image'), eventsController.updateAdminEventsById);
// router.delete('/events/:id', eventsController.deleteAdminEventsById);

// router.post('/kuldevicategory', uploadaws.single('image'), categoryKuldeviController.createCategory);
// router.get('/kuldevicategory', categoryKuldeviController.getCategories);
// router.get('/kuldevicategory/:id', categoryKuldeviController.getCategoryById);
// router.put('/kuldevicategory/:id', uploadaws.single('image'), categoryKuldeviController.updateCategoryById);
// router.delete('/kuldevicategory/:id', categoryKuldeviController.deleteCategoryById);

// router.get('/kuldevi', kuldeviController.getAllKuldevis);
// router.get('/kuldevi/:id', kuldeviController.getKuldeviById);
// router.post('/kuldevi', uploadaws.single('image'), kuldeviController.createKuldevi);
// router.put('/kuldevi/:id', uploadaws.single('image'), kuldeviController.updateKuldevi);
// router.delete('/kuldevi/:id', kuldeviController.deleteKuldevi);


// router.post('/rasamcategory', uploadaws.single('image'), categoryRasamController.createCategory);
// router.get('/rasamcategory', categoryRasamController.getCategories);
// router.get('/rasamcategory/:id', categoryRasamController.getCategoryById);
// router.put('/rasamcategory/:id', uploadaws.single('image'), categoryRasamController.updateCategoryById);
// router.delete('/rasamcategory/:id', categoryRasamController.deleteCategoryById);

// router.get('/rasam', rasamController.getAllRasams);
// router.get('/rasam/:id', rasamController.getRasamById);
// router.post('/rasam', uploadaws.single('image'), rasamController.createRasam);
// router.put('/rasam/:id', uploadaws.single('image'), rasamController.updateRasam);
// router.delete('/rasam/:id', rasamController.deleteRasam);

// router.post('/classifiedcategory', uploadaws.single('image'), categoryClassifiedController.createCategory);
// router.get('/classifiedcategory', categoryClassifiedController.getAllCategories);
// router.get('/classifiedcategory/:id', categoryClassifiedController.getCategoryById);
// router.put('/classifiedcategory/:id', uploadaws.single('image'), categoryClassifiedController.updateCategory);
// router.delete('/classifiedcategory/:id', categoryClassifiedController.deleteCategory);

// router.post('/classified', uploadMultiple.array('images', 10), classifiedController.createClassified);
// router.get('/classified', classifiedController.getAllClassifieds);
// router.get('/classified/:id', classifiedController.getClassifiedById);
// router.put('/classified/:id', uploadMultiple.array('images', 10), classifiedController.updateClassified);
// router.delete('/classified/:id', classifiedController.deleteClassified);



// router.post('/api/businessnetwork', businessNetworkRoutes);

// router.post('/vratcategory', uploadaws.single('image'), categoryVratController.createCategory);
// router.get('/vratcategory', categoryVratController.getCategories);
// router.get('/vratcategory/:id', categoryVratController.getCategoryById);
// router.put('/vratcategory/:id', uploadaws.single('image'), categoryVratController.updateCategoryById);
// router.delete('/vratcategory/:id', categoryVratController.deleteCategoryById);

// router.post('/vratsubcategory',  uploadaws.single('image'), varatSubController.createVarat);
// router.get('/vratsubcategory', varatSubController.getVarat);
// router.get('/vratsubcategory/:id', varatSubController.getVaratById);
// router.put('/vratsubcategory/:id',uploadaws.single('image'), varatSubController.updateVaratById);
// router.delete('/vratsubcategory/:id', varatSubController.deleteVaratById);

// router.post('/vratsubsubcategory',  uploadaws.single('image'), varatSubSubController.createVarat);
// router.get('/vratsubsubcategory', varatSubSubController.getVarat);
// router.get('/vratsubsubcategory/:id', varatSubSubController.getVaratById);
// router.put('/vratsubsubcategory/:id',uploadaws.single('image'), varatSubSubController.updateVaratById);
// router.delete('/vratsubsubcategory/:id', varatSubSubController.deleteVaratById);

// router.post('/vrat',  uploadaws.single('image'), varatController.createVarat);
// router.get('/vrat', varatController.getVarat);
// router.get('/vrat/:id', varatController.getVaratById);
// router.put('/vrat/:id',uploadaws.single('image'), varatController.updateVaratById);
// router.delete('/vrat/:id', varatController.deleteVaratById);

// router.post('/achiverscategory',  uploadaws.single('image'), categoryAchiversController.createCategory);
// router.get('/achiverscategory', categoryAchiversController.getCategories);
// router.get('/achiverscategory/:id', categoryAchiversController.getCategoryById);
// router.put('/achiverscategory/:id',  uploadaws.single('image'), categoryAchiversController.updateCategoryById);
// router.delete('/achiverscategory/:id', categoryAchiversController.deleteCategoryById);


// router.post('/achivers',uploadaws.single('image'), achiversController.createAchivers);
// router.get('/achivers', achiversController.getAchivers);
// router.get('/achivers/:id', achiversController.getAchiversById);
// router.put('/achivers/:id',uploadaws.single('image'), achiversController.updateAchiversById);
// router.delete('/achivers/:id', achiversController.deleteAchiversById);

// router.post('/occupation',  uploadaws.single('image'), categoryOccupationController.createCategory);
// router.get('/occupation', categoryOccupationController.getCategories);
// router.get('/occupation/:id', categoryOccupationController.getCategoryById);
// router.put('/occupation/:id',  uploadaws.single('image'), categoryOccupationController.updateCategoryById);
// router.delete('/occupation/:id', categoryOccupationController.deleteCategoryById);

// router.post('/jobs', uploadaws.single('image'), jobController.createJob);
// router.put('/jobs/:id', uploadaws.single('image'), jobController.updateJob);
// router.delete('/jobs/:id', jobController.deleteJob);
// router.get('/jobs/:id', jobController.getJobById);
// router.get('/jobs/',jobController.getAllJobs);

// router.post('/organisations', uploadMultiple.array('images', 10), organisationsController.createOrganisation);
// router.get('/organisations', organisationsController.getAllOrganisations);
// router.get('/organisations/:id', organisationsController.getOrganisationById);
// router.put('/organisations/:id', uploadMultiple.array('images', 10), organisationsController.updateOrganisationById);
// router.delete('/organisations/:id', organisationsController.deleteOrganisationById);

// router.post('/donation', uploadaws.single('image'), donationController.createDonation);
// router.get('/donation', donationController.getDonations);
// router.get('/donation/:id', donationController.getDonationById);
// router.put('/donation/:id',uploadaws.single('image'), donationController.updateDonationById);
// router.delete('/donation/:id', donationController.deleteDonationById);
 

// router.post('/gallerycategory',  categoryGalleryController.createCategory);
// router.get('/gallerycategory', categoryGalleryController.getCategories);
// router.get('/gallerycategory/:id', categoryGalleryController.getCategoryById);
// router.put('/gallerycategory/:id',  categoryGalleryController.updateCategoryById);
// router.delete('/gallerycategory/:id', categoryGalleryController.deleteCategoryById);

// router.post('/gallery', uploadMultiple.array('images'), galleryController.createCategory);
// router.get('/gallery', galleryController.getAllCategories);
// router.get('/gallery/:id', galleryController.getCategoryById);
// router.put('/gallery/:id', uploadMultiple.array('images'), galleryController.updateCategory);
// router.delete('/gallery/:id', galleryController.deleteCategory);

// router.post('/volunteers', uploadaws.single('image'),volunteerController.createVolunteer);
// router.put('/volunteers/:id', uploadaws.single('image'),volunteerController.updateVolunteerById);
// router.get('/volunteers', volunteerController.getAllVolunteers);
// router.get('/volunteers/:id', volunteerController.getVolunteerById);
// router.delete('/volunteers/:id', volunteerController.deleteVolunteerById);


// router.post('/addoptionscategory',  uploadaws.single('image'), categoryOptionsController.createCategory);
// router.get('/optionscategory', categoryOptionsController.getCategories);
// router.get('/optionscategory/:id', categoryOptionsController.getCategoryById);
// router.put('/optionscategory/:id',  uploadaws.single('image'), categoryOptionsController.updateCategoryById);
// router.delete('/optionscategory/:id', categoryOptionsController.deleteCategoryById);


// router.get('/options', optionsController.getAllSelectedOptions);

// router.post('/packages', packageController.createPackage);
// router.get('/packages', packageController.getAllPackages);
// //getall sponsor packages
// router.get('/sponsor-packages', packageController.getAllSponsorPackagesForUser);


// router.get('/packages/:id', packageController.getPackageById);
// router.put('/packages/:id', packageController.updatePackage);
// router.delete('/packages/:id', packageController.deletePackage);

// router.post('/matrimony', uploadMultiple.array('images'),matrimonyController.createMatrimony);
// router.get('/matrimony', matrimonyController.getAllMatrimonys);

// router.get('/matrimony/:id', matrimonyController.getMatrimonyById);
// router.put('/matrimony/:id', uploadMultiple.array('images'),matrimonyController.updateMatrimony);
// router.delete('/matrimony/:id', matrimonyController.deleteMatrimony);

// router.post('/matrimonypackages', matrimonyPackageController.createPackage);
// router.get('/matrimonypackages', matrimonyPackageController.getAllPackages);
// router.get('/matrimonypackages/:id', matrimonyPackageController.getPackageById);
// router.put('/matrimonypackages/:id', matrimonyPackageController.updatePackage);
// router.delete('/matrimonypackages/:id', matrimonyPackageController.deletePackage);

// router.get('/contactrequestsmatrimony', contactMatrimonyController.getAllContactRequests);
// // router.get('/contactrequestsmatrimony/:id', contactMatrimonyController.getContactRequestById);
// router.put('/contactrequestsmatrimony/:id', contactMatrimonyController.updateContactRequestStatus);
// router.delete('/contactrequestsmatrimony/:id', contactMatrimonyController.deleteContactRequest);

// //admin add banner
// router.post('/banners', uploadaws.single('image'), bannerController.addBanner);
// router.get('/banners', bannerController.getAllBanners);
// router.get('/banners/:id', bannerController.getBannerById);
// router.put('/banners/:id', uploadaws.single('image'), bannerController.updateBanner);
// router.delete('/banners/:id', bannerController.deleteBanner);

// //sponsor
// router.post('/sponsor',  uploadaws.single('image'),adminSponsorController.addSponsorByAdmin);
// router.get('/sponsors', adminSponsorController.getAllSponsors);
// router.get('/sponsor/:id', adminSponsorController.getSponsorById);
// router.put('/sponsor/:id',  uploadaws.single('image'),adminSponsorController.updateSponsorByAdmin);
// router.delete('/sponsor/:id', adminSponsorController.deleteSponsorByAdmin);
// //Magazine
// router.post('/magazines',uploadaws.fields([{ name: 'pdf' }, { name: 'image' }]), magazineController.createMagazine);
// router.get('/magazines', magazineController.getAllMagazines);
// router.get('/magazines/:id', magazineController.getMagazineById);
// router.put('/magazines/:id', uploadaws.fields([{ name: 'pdf', maxCount: 1 }, { name: 'image', maxCount: 1 }]), magazineController.updateMagazine);
// router.delete('/magazines/:id', magazineController.deleteMagazine);

// //suggestions
// router.get('/suggestions',suggestionController.getAllSuggestions);
// //about routes
// router.post('/add',  uploadaws.single('image'), aboutController.createCategory);
// router.get('/getall', aboutController.getCategories);
// router.get('/getbyid/:id', aboutController.getCategoryById);
// router.put('/update/:id',  uploadaws.single('image'), aboutController.updateCategoryById);
// router.delete('/delete/:id', aboutController.deleteCategoryById);
// module.exports = router;


// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { registerAdmin, loginAdmin } = require('../controllers/adminController');
const { requireAuth } = require("../auth");

// Controller Imports
const categoryOccupationController = require('../controllers/jobCategoryController');
const businessNetworkRoutes = require('./businessNetworkRoutes');
const userController = require('../controllers/AdminuserController');
const categoryNewsController = require('../controllers/newsCategoryController');
const newsController = require('../controllers/newsAdminController');
const businessController = require('../controllers/businessDirectoryController');
const bloodDonorController = require('../controllers/bloodZoneController');
const bankController = require('../controllers/bloodBankController');
const categoryEventsController = require('../controllers/eventsCategoryController');
const eventsController = require('../controllers/eventsAdminController');
const categoryKuldeviController = require('../controllers/kuldeviCategoryController');
const kuldeviController = require('../controllers/kuldeviController');
const categoryRasamController = require('../controllers/rasamCategoryController');
const rasamController = require('../controllers/rasamController');
const categoryClassifiedController = require('../controllers/classifiedcategoryController');
const classifiedController = require('../controllers/classifiedAdminController');
const categoryVratController = require('../controllers/vratCategoryController');
const varatSubController = require('../controllers/vratSubCategoryController');
const varatSubSubController = require('../controllers/vratSubSubCategoryController');
const varatController = require('../controllers/vratController');
const categoryAchiversController = require('../controllers/achiversCategoryController');
const achiversController = require('../controllers/achiversController');
const organisationsController = require('../controllers/organisationsController');
const donationController = require('../controllers/donationController');
const jobController = require('../controllers/jobsAdminController');
const categoryGalleryController = require('../controllers/galleryCategoryController');
const galleryController = require('../controllers/galleryController');
const volunteerController = require('../controllers/volunteersController');
const categoryOptionsController = require("../controllers/optionsCategoryController");
const optionsController = require('../controllers/userSelectedOptionController');
const packageController = require('../controllers/packageController');
const matrimonyController = require('../controllers/adminMatrimonyController');
const matrimonyPackageController = require('../controllers/adminMatrimonyPackageController');
const contactMatrimonyController = require('../controllers/adminContactMatrimonyController');
const casteController = require("../controllers/addCasteController");
const bannerController = require('../controllers/bannerController');
const adminSponsorController = require('../controllers/adminSponsorController');
const magazineController = require('../controllers/adminMagazineController');
const suggestionController = require('../controllers/adminSuggestions');
const aboutController = require('../controllers/aboutController');

// --- CORRECT MULTER CONFIGURATION ---
// We only need ONE multer instance that uses memory storage for cloud uploads.
const upload = multer({ storage: multer.memoryStorage() });


// --- ROUTES ---

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// ✅ ALL ROUTES BELOW REQUIRE ADMIN AUTHENTICATION
// Only admin users can access member management (add, update, delete)
router.use(requireAuth('admin'));

// User Management Routes
router.post('/registeruser', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'businessImages', maxCount: 10 }
]), userController.registerUser);
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'businessImages', maxCount: 10 }
]), userController.updateUserById);
router.delete('/users/:id', userController.deleteUserById);

// Caste Routes
router.post('/caste', upload.none(), casteController.addEntry);
router.get('/caste', casteController.getAllEntries);
router.get('/caste/:id', upload.none(), casteController.getEntryById);
router.put('/caste/:id', upload.none(), casteController.updateEntry);
router.delete('/caste/:id', casteController.deleteEntry);

// News Category Routes
router.post('/addcategory', upload.single('image'), categoryNewsController.createCategory);
router.get('/category', categoryNewsController.getCategories);
router.get('/category/:id', categoryNewsController.getCategoryById);
router.put('/category/:id', upload.single('image'), categoryNewsController.updateCategoryById);
router.delete('/category/:id', categoryNewsController.deleteCategoryById);

// News Routes
router.post('/addnews', upload.single('image'), newsController.createAdminNews);
router.get('/news', newsController.getAllNews);
router.get('/news/:id', newsController.getAdminNewsById);
router.put('/news/:id', upload.single('image'), newsController.updateAdminNewsById);
router.delete('/news/:id', newsController.deleteAdminNewsById);

// Business and Blood Zone
router.get('/businessdirectory', businessController.getBusinessDirectoryUsers);
router.get('/blooddonor', bloodDonorController.getBloodZoneUsers);

// Blood Bank Routes
router.post('/bloodBank', bankController.createBank);
router.get('/bloodBank', bankController.getAllBanks);
router.get('/bloodBank/:id', bankController.getBankById);
router.put('/bloodBank/:id', bankController.updateBankById);
router.delete('/bloodBank/:id', bankController.deleteBankById);

// Events Category Routes
router.post('/addeventscategory', upload.single('image'), categoryEventsController.createCategory);
router.get('/eventscategory', categoryEventsController.getCategories);
router.get('/eventscategory/:id', categoryEventsController.getCategoryById);
router.put('/eventscategory/:id', upload.single('image'), categoryEventsController.updateCategoryById);
router.delete('/eventscategory/:id', categoryEventsController.deleteCategoryById);

// Events Routes
router.post('/addevents', upload.single('image'), eventsController.createAdminEvents);
router.get('/events', eventsController.getAllEvents);
router.get('/events/:id', eventsController.getAdminEventsById);
router.put('/events/:id', upload.single('image'), eventsController.updateAdminEventsById);
router.delete('/events/:id', eventsController.deleteAdminEventsById);

// Kuldevi Category Routes
router.post('/kuldevicategory', upload.single('image'), categoryKuldeviController.createCategory);
router.get('/kuldevicategory', categoryKuldeviController.getCategories);
router.get('/kuldevicategory/:id', categoryKuldeviController.getCategoryById);
router.put('/kuldevicategory/:id', upload.single('image'), categoryKuldeviController.updateCategoryById);
router.delete('/kuldevicategory/:id', categoryKuldeviController.deleteCategoryById);

// Kuldevi Routes
router.post('/kuldevi', upload.single('image'), kuldeviController.createKuldevi);
router.get('/kuldevi', kuldeviController.getAllKuldevis);
router.get('/kuldevi/:id', kuldeviController.getKuldeviById);
router.put('/kuldevi/:id', upload.single('image'), kuldeviController.updateKuldevi);
router.delete('/kuldevi/:id', kuldeviController.deleteKuldevi);

// Rasam Category Routes
router.post('/rasamcategory', upload.single('image'), categoryRasamController.createCategory);
router.get('/rasamcategory', categoryRasamController.getCategories);
router.get('/rasamcategory/:id', categoryRasamController.getCategoryById);
router.put('/rasamcategory/:id', upload.single('image'), categoryRasamController.updateCategoryById);
router.delete('/rasamcategory/:id', categoryRasamController.deleteCategoryById);

// Rasam Routes
router.post('/rasam', upload.single('image'), rasamController.createRasam);
router.get('/rasam', rasamController.getAllRasams);
router.get('/rasam/:id', rasamController.getRasamById);
router.put('/rasam/:id', upload.single('image'), rasamController.updateRasam);
router.delete('/rasam/:id', rasamController.deleteRasam);

// Classified Category Routes
router.post('/classifiedcategory', upload.single('image'), categoryClassifiedController.createCategory);
router.get('/classifiedcategory', categoryClassifiedController.getAllCategories);
router.get('/classifiedcategory/:id', categoryClassifiedController.getCategoryById);
router.put('/classifiedcategory/:id', upload.single('image'), categoryClassifiedController.updateCategory);
router.delete('/classifiedcategory/:id', categoryClassifiedController.deleteCategory);

// Classified Routes
router.post('/classified', upload.array('images', 10), classifiedController.createClassified);
router.get('/classified', classifiedController.getAllClassifieds);
router.get('/classified/:id', classifiedController.getClassifiedById);
router.put('/classified/:id', upload.array('images', 10), classifiedController.updateClassified);
router.delete('/classified/:id', classifiedController.deleteClassified);

// Business Network Route
router.post('/api/businessnetwork', businessNetworkRoutes);

// Vrat Routes (and its subcategories)
router.post('/vratcategory', upload.single('image'), categoryVratController.createCategory);
router.get('/vratcategory', categoryVratController.getCategories);
router.get('/vratcategory/:id', categoryVratController.getCategoryById);
router.put('/vratcategory/:id', upload.single('image'), categoryVratController.updateCategoryById);
router.delete('/vratcategory/:id', categoryVratController.deleteCategoryById);

router.post('/vratsubcategory', upload.single('image'), varatSubController.createVarat);
router.get('/vratsubcategory', varatSubController.getVarat);
router.get('/vratsubcategory/:id', varatSubController.getVaratById);
router.put('/vratsubcategory/:id', upload.single('image'), varatSubController.updateVaratById);
router.delete('/vratsubcategory/:id', varatSubController.deleteVaratById);

router.post('/vratsubsubcategory', upload.single('image'), varatSubSubController.createVarat);
router.get('/vratsubsubcategory', varatSubSubController.getVarat);
router.get('/vratsubsubcategory/:id', varatSubSubController.getVaratById);
router.put('/vratsubsubcategory/:id', upload.single('image'), varatSubSubController.updateVaratById);
router.delete('/vratsubsubcategory/:id', varatSubSubController.deleteVaratById);

router.post('/vrat', upload.single('image'), varatController.createVarat);
router.get('/vrat', varatController.getVarat);
router.get('/vrat/:id', varatController.getVaratById);
router.put('/vrat/:id', upload.single('image'), varatController.updateVaratById);
router.delete('/vrat/:id', varatController.deleteVaratById);

// Achievers Category Routes
router.post('/achiverscategory', upload.single('image'), categoryAchiversController.createCategory);
router.get('/achiverscategory', categoryAchiversController.getCategories);
router.get('/achiverscategory/:id', categoryAchiversController.getCategoryById);
router.put('/achiverscategory/:id', upload.single('image'), categoryAchiversController.updateCategoryById);
router.delete('/achiverscategory/:id', categoryAchiversController.deleteCategoryById);

// Achievers Routes
router.post('/achivers', upload.single('image'), achiversController.createAchivers);
router.get('/achivers', achiversController.getAchivers);
router.get('/achivers/:id', achiversController.getAchiversById);
router.put('/achivers/:id', upload.single('image'), achiversController.updateAchiversById);
router.delete('/achivers/:id', achiversController.deleteAchiversById);

// Occupation Routes
router.post('/occupation', upload.single('image'), categoryOccupationController.createCategory);
router.get('/occupation', categoryOccupationController.getCategories);
router.get('/occupation/:id', categoryOccupationController.getCategoryById);
router.put('/occupation/:id', upload.single('image'), categoryOccupationController.updateCategoryById);
router.delete('/occupation/:id', categoryOccupationController.deleteCategoryById);

// Jobs Routes
router.post('/jobs', upload.single('image'), jobController.createJob);
router.get('/jobs/', jobController.getAllJobs);
router.get('/jobs/:id', jobController.getJobById);
router.put('/jobs/:id', upload.single('image'), jobController.updateJob);
router.delete('/jobs/:id', jobController.deleteJob);

// Organisations Routes
router.post('/organisations', upload.array('images', 10), organisationsController.createOrganisation);
router.get('/organisations', organisationsController.getAllOrganisations);
router.get('/organisations/:id', organisationsController.getOrganisationById);
router.put('/organisations/:id', upload.array('images', 10), organisationsController.updateOrganisationById);
router.delete('/organisations/:id', organisationsController.deleteOrganisationById);

// Donation Routes
router.post('/donation', upload.single('image'), donationController.createDonation);
router.get('/donation', donationController.getDonations);
router.get('/donation/:id', donationController.getDonationById);
router.put('/donation/:id', upload.single('image'), donationController.updateDonationById);
router.delete('/donation/:id', donationController.deleteDonationById);

// Gallery Category Routes
router.post('/gallerycategory', categoryGalleryController.createCategory);
router.get('/gallerycategory', categoryGalleryController.getCategories);
router.get('/gallerycategory/:id', categoryGalleryController.getCategoryById);
router.put('/gallerycategory/:id', categoryGalleryController.updateCategoryById);
router.delete('/gallerycategory/:id', categoryGalleryController.deleteCategoryById);

// Gallery Routes
router.post('/gallery', upload.array('images'), galleryController.createCategory);
router.get('/gallery', galleryController.getAllCategories);
router.get('/gallery/:id', galleryController.getCategoryById);
router.put('/gallery/:id', upload.array('images'), galleryController.updateCategory);
router.delete('/gallery/:id', galleryController.deleteCategory);

// Volunteers Routes
router.post('/volunteers', upload.single('image'), volunteerController.createVolunteer);
router.get('/volunteers', volunteerController.getAllVolunteers);
router.get('/volunteers/:id', volunteerController.getVolunteerById);
router.put('/volunteers/:id', upload.single('image'), volunteerController.updateVolunteerById);
router.delete('/volunteers/:id', volunteerController.deleteVolunteerById);

// Options Category Routes
router.post('/addoptionscategory', upload.single('image'), categoryOptionsController.createCategory);
router.get('/optionscategory', categoryOptionsController.getCategories);
router.get('/optionscategory/:id', categoryOptionsController.getCategoryById);
router.put('/optionscategory/:id', upload.single('image'), categoryOptionsController.updateCategoryById);
router.delete('/optionscategory/:id', categoryOptionsController.deleteCategoryById);

// Options Routes
router.get('/options', optionsController.getAllSelectedOptions);

// Package Routes
router.post('/packages', packageController.createPackage);
router.get('/packages', packageController.getAllPackages);
router.get('/sponsor-packages', packageController.getAllSponsorPackagesForUser);
router.get('/packages/:id', packageController.getPackageById);
router.put('/packages/:id', packageController.updatePackage);
router.delete('/packages/:id', packageController.deletePackage);

// Matrimony Routes
router.post('/matrimony', upload.array('images'), matrimonyController.createMatrimony);
router.get('/matrimony', matrimonyController.getAllMatrimonys);
router.get('/matrimony/:id', matrimonyController.getMatrimonyById);
router.put('/matrimony/:id', upload.array('images'), matrimonyController.updateMatrimony);
router.delete('/matrimony/:id', matrimonyController.deleteMatrimony);

// Matrimony Package Routes
router.post('/matrimonypackages', matrimonyPackageController.createPackage);
router.get('/matrimonypackages', matrimonyPackageController.getAllPackages);
router.get('/matrimonypackages/:id', matrimonyPackageController.getPackageById);
router.put('/matrimonypackages/:id', matrimonyPackageController.updatePackage);
router.delete('/matrimonypackages/:id', matrimonyPackageController.deletePackage);

// Matrimony Contact Request Routes
router.get('/contactrequestsmatrimony', contactMatrimonyController.getAllContactRequests);
router.put('/contactrequestsmatrimony/:id', contactMatrimonyController.updateContactRequestStatus);
router.delete('/contactrequestsmatrimony/:id', contactMatrimonyController.deleteContactRequest);

// Banner Routes
router.post('/banners', upload.single('image'), bannerController.addBanner);
router.get('/banners', bannerController.getAllBanners);
router.get('/banners/:id', bannerController.getBannerById);
router.put('/banners/:id', upload.single('image'), bannerController.updateBanner);
router.delete('/banners/:id', bannerController.deleteBanner);

// Sponsor Routes
router.post('/sponsor', upload.single('image'), adminSponsorController.addSponsorByAdmin);
router.get('/sponsors', adminSponsorController.getAllSponsors);
router.get('/sponsor/:id', adminSponsorController.getSponsorById);
router.put('/sponsor/:id', upload.single('image'), adminSponsorController.updateSponsorByAdmin);
router.delete('/sponsor/:id', adminSponsorController.deleteSponsorByAdmin);

// Magazine Routes
router.post('/magazines', upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'image', maxCount: 1 }]), magazineController.createMagazine);
router.get('/magazines', magazineController.getAllMagazines);
router.get('/magazines/:id', magazineController.getMagazineById);
router.put('/magazines/:id', upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'image', maxCount: 1 }]), magazineController.updateMagazine);
router.delete('/magazines/:id', magazineController.deleteMagazine);

// Suggestions Route
router.get('/suggestions', suggestionController.getAllSuggestions);

// About Routes
router.post('/add', upload.single('image'), aboutController.createCategory);
router.get('/getall', aboutController.getCategories);
router.get('/getbyid/:id', aboutController.getCategoryById);
router.put('/update/:id', upload.single('image'), aboutController.updateCategoryById);
router.delete('/delete/:id', aboutController.deleteCategoryById);

// ADMIN ONLY: Delete user by ID (requires admin auth)
// Usage: DELETE /api/admin/users/:id with admin JWT token
// const { requireAuth } = require('../auth');
router.delete('/users/:id', requireAuth('admin'), userController.deleteUserById);

module.exports = router;