const express = require('express');
const router = express.Router();
const booksLibraryController = require('../controllers/booksLibraryController');
const auth = require('../auth');
const uploadMiddleware = require('../controllers/uploadMiddleware');

// Public routes
router.get('/all', booksLibraryController.getAllBooks);
router.get('/:id', booksLibraryController.getBookById);
router.get('/category/:category', booksLibraryController.getBooksByCategory);

// Protected routes (require authentication)
router.post('/create', auth, uploadMiddleware.single('image'), booksLibraryController.createBook);
router.put('/:id', auth, uploadMiddleware.single('image'), booksLibraryController.updateBook);
router.delete('/:id', auth, booksLibraryController.deleteBook);
router.post('/:id/interested', auth, booksLibraryController.markInterested);
router.get('/user/my-listings', auth, booksLibraryController.getUserBooks);

module.exports = router;
