const express = require('express');
const router = express.Router();
const booksLibraryController = require('../controllers/booksLibraryController');
const auth = require('../auth');
const uploadMiddleware = require('../controllers/uploadMiddleware');
const multer = require('multer');

// Configure multer for multiple file uploads
const multiFileUpload = multer({ storage: multer.memoryStorage() });

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

// Admin routes (require admin authentication)
router.post('/admin/create-book', auth.requireAdmin, multiFileUpload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'image', maxCount: 1 }]), booksLibraryController.adminCreateBook);
router.get('/admin/all-books', auth.requireAdmin, booksLibraryController.adminGetAllBooks);
router.delete('/admin/delete-book/:id', auth.requireAdmin, booksLibraryController.adminDeleteBook);

// User like/dislike routes
router.post('/:bookId/like', auth, booksLibraryController.likeBook);
router.post('/:bookId/dislike', auth, booksLibraryController.dislikeBook);
router.get('/:bookId/like-status', auth, booksLibraryController.getBookLikeStatus);

module.exports = router;
