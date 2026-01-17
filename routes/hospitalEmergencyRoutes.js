const express = require('express');
const router = express.Router();
const hospitalEmergencyController = require('../controllers/hospitalEmergencyController');
const auth = require('../auth');
const uploadMiddleware = require('../controllers/uploadMiddleware');

// Public routes
router.get('/all', hospitalEmergencyController.getAllDoctors);
router.get('/search/:id', hospitalEmergencyController.getDoctorById);
router.get('/city/:city', hospitalEmergencyController.getDoctorsByCity);
router.get('/specialty/:specialty', hospitalEmergencyController.getDoctorsBySpecialty);
router.get('/nearby', hospitalEmergencyController.getNearbyDoctors);

// Protected routes (require authentication)
router.post('/register', auth, uploadMiddleware.single('image'), hospitalEmergencyController.registerDoctor);
router.put('/:id', auth, uploadMiddleware.single('image'), hospitalEmergencyController.updateDoctor);
router.delete('/:id', auth, hospitalEmergencyController.deleteDoctor);
router.post('/:id/review', auth, hospitalEmergencyController.addReview);

module.exports = router;
