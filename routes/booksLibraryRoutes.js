const express = require('express');
const router = express.Router();
const booksLibraryController = require('../controllers/booksLibraryController');
const auth = require('../auth');
const uploadMiddleware = require('../controllers/uploadMiddleware');
const multer = require('multer');

// Configure multer for multiple file uploads
const multiFileUpload = multer({ storage: multer.memoryStorage() });

// ⚠️ IMPORTANT: Specific routes MUST come before generic /:id routes

// Public specific routes
router.get('/all', booksLibraryController.getAllBooks);
router.get('/user/my-listings', auth, booksLibraryController.getUserBooks);
router.get('/category/:category', booksLibraryController.getBooksByCategory);

// Protected specific routes
router.post('/create', auth, uploadMiddleware.single('image'), booksLibraryController.createBook);

// Admin specific routes
router.post('/admin/create-book', auth.requireAdmin, multiFileUpload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'image', maxCount: 1 }]), booksLibraryController.adminCreateBook);
router.get('/admin/all-books', auth.requireAdmin, booksLibraryController.adminGetAllBooks);
router.delete('/admin/delete-book/:id', auth.requireAdmin, booksLibraryController.adminDeleteBook);

// User like/dislike routes - MUST come before generic /:id routes
router.post('/:bookId/like', auth, booksLibraryController.likeBook);
router.post('/:bookId/dislike', auth, booksLibraryController.dislikeBook);
router.get('/:bookId/like-status', auth, booksLibraryController.getBookLikeStatus);

// Generic :id routes - MUST come last
router.get('/:id', booksLibraryController.getBookById);
router.put('/:id', auth, uploadMiddleware.single('image'), booksLibraryController.updateBook);
router.delete('/:id', auth, booksLibraryController.deleteBook);
router.post('/:id/interested', auth, booksLibraryController.markInterested);

module.exports = router;
