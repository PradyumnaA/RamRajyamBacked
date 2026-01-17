const BooksLibrary = require('../models/booksLibraryModel');
const BooksLibraryCounter = require('../models/booksLibraryCounter');
const BookLikes = require('../models/bookLikesModel');
const { v4: uuidv4 } = require('uuid');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// Initialize S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Helper function to get the next sequence value
const getNextSequenceValue = async (sequenceName) => {
  const sequenceDocument = await BooksLibraryCounter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return sequenceDocument.seq;
};

// Get all books with filters
exports.getAllBooks = async (req, res) => {
  try {
    const { category, city, status, search } = req.query;
    let filter = { status: 'Available' };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const books = await BooksLibrary.find(filter)
      .populate('sellerId', 'fullName contactNo email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: books,
      count: books.length,
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching books',
      error: error.message,
    });
  }
};

// Get book by ID
exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await BooksLibrary.findById(id)
      .populate('sellerId', 'fullName contactNo email')
      .populate('interested', 'fullName contactNo email');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Increment views
    book.views += 1;
    await book.save();

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching book',
      error: error.message,
    });
  }
};

// Create new book listing
exports.createBook = async (req, res) => {
  try {
    const { title, author, price, condition, description, category, sellerName, sellerContact } = req.body;
    const { userId } = req.user;

    // Validate required fields
    if (!title || !author || !price || !condition || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    let imageUrl = null;

    // Upload image if provided
    if (req.file) {
      const imageKey = `books/${uuidv4()}_${req.file.originalname}`;
      const params = {
        Bucket: process.env.UPLOADSIMAGEBUCKET,
        Key: imageKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      await s3.send(new PutObjectCommand(params));
      imageUrl = `https://${process.env.UPLOADSIMAGEBUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageKey}`;
    }

    const id = await getNextSequenceValue('booksLibraryId');

    const book = new BooksLibrary({
      id,
      title,
      author,
      price,
      condition,
      description,
      category,
      image: imageUrl,
      sellerName: sellerName || req.user.fullName,
      sellerContact: sellerContact || req.user.contactNo,
      sellerId: userId,
    });

    await book.save();

    res.status(201).json({
      success: true,
      message: 'Book listing created successfully',
      data: book,
    });
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating book listing',
      error: error.message,
    });
  }
};

// Update book listing
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const updates = req.body;

    const book = await BooksLibrary.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Check if user is owner
    if (book.sellerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this book',
      });
    }

    // Handle image upload if provided
    if (req.file) {
      const imageKey = `books/${uuidv4()}_${req.file.originalname}`;
      const params = {
        Bucket: process.env.UPLOADSIMAGEBUCKET,
        Key: imageKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      await s3.send(new PutObjectCommand(params));
      updates.image = `https://${process.env.UPLOADSIMAGEBUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageKey}`;
    }

    Object.assign(book, updates);
    await book.save();

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: book,
    });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating book',
      error: error.message,
    });
  }
};

// Delete book listing
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const book = await BooksLibrary.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Check if user is owner
    if (book.sellerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this book',
      });
    }

    await BooksLibrary.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting book',
      error: error.message,
    });
  }
};

// Mark as interested
exports.markInterested = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const book = await BooksLibrary.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    if (!book.interested.includes(userId)) {
      book.interested.push(userId);
      await book.save();
    }

    res.status(200).json({
      success: true,
      message: 'Marked as interested',
      data: book,
    });
  } catch (error) {
    console.error('Error marking interested:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking interested',
      error: error.message,
    });
  }
};

// Get user's listings
exports.getUserBooks = async (req, res) => {
  try {
    const { userId } = req.user;

    const books = await BooksLibrary.find({ sellerId: userId })
      .populate('interested', 'fullName contactNo email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: books,
      count: books.length,
    });
  } catch (error) {
    console.error('Error fetching user books:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user books',
      error: error.message,
    });
  }
};

// Get books by category
exports.getBooksByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const books = await BooksLibrary.find({
      category,
      status: 'Available',
    })
      .populate('sellerId', 'fullName contactNo email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: books,
      count: books.length,
    });
  } catch (error) {
    console.error('Error fetching books by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching books by category',
      error: error.message,
    });
  }
};

// ADMIN: Create book with PDF upload
exports.adminCreateBook = async (req, res) => {
  try {
    const { title, author, price, condition, description, category } = req.body;

    if (!title || !author || !price || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    if (!req.files || !req.files.pdf) {
      return res.status(400).json({
        success: false,
        message: 'PDF file is required',
      });
    }

    let imageUrl = null;
    let pdfUrl = null;

    // Upload image if provided
    if (req.files && req.files.image) {
      const imageKey = `books/admin/${uuidv4()}_${req.files.image[0].originalname}`;
      const params = {
        Bucket: process.env.UPLOADSIMAGEBUCKET,
        Key: imageKey,
        Body: req.files.image[0].buffer,
        ContentType: req.files.image[0].mimetype,
      };

      await s3.send(new PutObjectCommand(params));
      imageUrl = `https://${process.env.UPLOADSIMAGEBUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageKey}`;
    }

    // Upload PDF
    const pdfKey = `books/admin/pdfs/${uuidv4()}_${req.files.pdf[0].originalname}`;
    const pdfParams = {
      Bucket: process.env.UPLOADSIMAGEBUCKET,
      Key: pdfKey,
      Body: req.files.pdf[0].buffer,
      ContentType: 'application/pdf',
    };

    await s3.send(new PutObjectCommand(pdfParams));
    pdfUrl = `https://${process.env.UPLOADSIMAGEBUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${pdfKey}`;

    const id = await getNextSequenceValue('booksLibraryId');

    const book = new BooksLibrary({
      id,
      title,
      author,
      price: price || 0,
      condition: condition || 'Good',
      description,
      category,
      image: imageUrl,
      pdfFile: pdfUrl,
      sellerName: 'Admin',
      sellerContact: 'admin@kurmisamaj.com',
      sellerId: req.user._id,
      isAdminBook: true,
      status: 'Available',
    });

    await book.save();

    res.status(201).json({
      success: true,
      message: 'Book uploaded successfully by admin',
      data: book,
    });
  } catch (error) {
    console.error('Error creating admin book:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading book',
      error: error.message,
    });
  }
};

// ADMIN: Get all books (admin view)
exports.adminGetAllBooks = async (req, res) => {
  try {
    const books = await BooksLibrary.find()
      .populate('sellerId', 'fullName contactNo email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: books,
      count: books.length,
    });
  } catch (error) {
    console.error('Error fetching all books for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching books',
      error: error.message,
    });
  }
};

// ADMIN: Delete book
exports.adminDeleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await BooksLibrary.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    await BooksLibrary.findByIdAndDelete(id);
    await BookLikes.deleteMany({ bookId: id });

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting book',
      error: error.message,
    });
  }
};

// USER: Like a book
exports.likeBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { userId } = req.user;

    const book = await BooksLibrary.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Check if user already liked or disliked
    const existingLike = await BookLikes.findOne({
      bookId,
      userId,
    });

    if (existingLike) {
      if (existingLike.isLiked) {
        // Unlike the book
        await BookLikes.deleteOne({ _id: existingLike._id });
        book.likes -= 1;
      } else {
        // Change from dislike to like
        existingLike.isLiked = true;
        await existingLike.save();
        book.dislikes -= 1;
        book.likes += 1;
      }
    } else {
      // New like
      await BookLikes.create({
        bookId,
        userId,
        isLiked: true,
      });
      book.likes += 1;
    }

    await book.save();

    res.status(200).json({
      success: true,
      message: 'Book liked',
      data: book,
    });
  } catch (error) {
    console.error('Error liking book:', error);
    res.status(500).json({
      success: false,
      message: 'Error liking book',
      error: error.message,
    });
  }
};

// USER: Dislike a book
exports.dislikeBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { userId } = req.user;

    const book = await BooksLibrary.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Check if user already liked or disliked
    const existingLike = await BookLikes.findOne({
      bookId,
      userId,
    });

    if (existingLike) {
      if (!existingLike.isLiked) {
        // Remove dislike
        await BookLikes.deleteOne({ _id: existingLike._id });
        book.dislikes -= 1;
      } else {
        // Change from like to dislike
        existingLike.isLiked = false;
        await existingLike.save();
        book.likes -= 1;
        book.dislikes += 1;
      }
    } else {
      // New dislike
      await BookLikes.create({
        bookId,
        userId,
        isLiked: false,
      });
      book.dislikes += 1;
    }

    await book.save();

    res.status(200).json({
      success: true,
      message: 'Book disliked',
      data: book,
    });
  } catch (error) {
    console.error('Error disliking book:', error);
    res.status(500).json({
      success: false,
      message: 'Error disliking book',
      error: error.message,
    });
  }
};

// USER: Get book like status for current user
exports.getBookLikeStatus = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { userId } = req.user;

    const likeStatus = await BookLikes.findOne({
      bookId,
      userId,
    });

    res.status(200).json({
      success: true,
      data: {
        isLiked: likeStatus ? likeStatus.isLiked : null,
      },
    });
  } catch (error) {
    console.error('Error getting book like status:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting like status',
      error: error.message,
    });
  }
};
