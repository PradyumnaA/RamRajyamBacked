#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');
const BooksLibrary = require('./models/booksLibraryModel');
const BooksLibraryCounter = require('./models/booksLibraryCounter');

const DUMMY_USER_ID = new mongoose.Types.ObjectId(); // Will be used as sellerId for all dummy books

const DUMMY_BOOKS = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    price: 299,
    condition: 'Like New',
    description: 'A classic novel about love and the American Dream in the Jazz Age.',
    category: 'Fiction',
    sellerName: 'Raj Kumar',
    sellerContact: '9876543210',
    status: 'Available',
    views: 45
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    price: 349,
    condition: 'Good',
    description: 'A gripping tale of racial injustice and childhood innocence in the American South.',
    category: 'Fiction',
    sellerName: 'Priya Singh',
    sellerContact: '9123456789',
    status: 'Available',
    views: 67
  },
  {
    title: '1984',
    author: 'George Orwell',
    price: 279,
    condition: 'Fair',
    description: 'A dystopian novel depicting a totalitarian society under constant surveillance.',
    category: 'Dystopian',
    sellerName: 'Amit Patel',
    sellerContact: '8765432109',
    status: 'Available',
    views: 89
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    price: 319,
    condition: 'Like New',
    description: 'A romantic novel set in Georgian England with themes of love and social class.',
    category: 'Romance',
    sellerName: 'Neha Gupta',
    sellerContact: '7654321098',
    status: 'Available',
    views: 102
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    price: 289,
    condition: 'Good',
    description: 'A coming-of-age story following a teenage boy in New York City.',
    category: 'Fiction',
    sellerName: 'Vikram Singh',
    sellerContact: '9987654321',
    status: 'Available',
    views: 56
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    price: 399,
    condition: 'Like New',
    description: 'A practical guide to building good habits and breaking bad ones through small changes.',
    category: 'Self-Help',
    sellerName: 'Suresh Kumar',
    sellerContact: '8876543210',
    status: 'Available',
    views: 234
  },
  {
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    price: 429,
    condition: 'Good',
    description: 'An exploration of how Homo sapiens came to dominate the world through cognitive revolution.',
    category: 'Non-Fiction',
    sellerName: 'Anjali Sharma',
    sellerContact: '9765432109',
    status: 'Available',
    views: 178
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    price: 359,
    condition: 'Like New',
    description: 'An adventure fantasy tale of a hobbit named Bilbo Baggins on an unexpected journey.',
    category: 'Fantasy',
    sellerName: 'Rohan Das',
    sellerContact: '7765432109',
    status: 'Available',
    views: 143
  },
  {
    title: 'Educated',
    author: 'Tara Westover',
    price: 389,
    condition: 'Good',
    description: 'A memoir of a woman who leaves her survivalist family to pursue education.',
    category: 'Memoir',
    sellerName: 'Divya Reddy',
    sellerContact: '9654321098',
    status: 'Available',
    views: 167
  },
  {
    title: 'Think and Grow Rich',
    author: 'Napoleon Hill',
    price: 349,
    condition: 'Fair',
    description: 'A classic personal development book on achieving success through right thinking.',
    category: 'Self-Help',
    sellerName: 'Arun Kumar',
    sellerContact: '8654321098',
    status: 'Available',
    views: 89
  },
  {
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    price: 329,
    condition: 'Like New',
    description: 'A psychological thriller about a woman who shoots her husband and then never speaks again.',
    category: 'Thriller',
    sellerName: 'Meera Nair',
    sellerContact: '9543210987',
    status: 'Available',
    views: 201
  },
  {
    title: 'Becoming',
    author: 'Michelle Obama',
    price: 449,
    condition: 'Good',
    description: 'A memoir by the former First Lady of the United States sharing her life journey.',
    category: 'Biography',
    sellerName: 'Karan Singh',
    sellerContact: '8543210987',
    status: 'Available',
    views: 156
  },
  {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    price: 339,
    condition: 'Like New',
    description: 'A fantasy novel about a woman exploring alternate versions of her life.',
    category: 'Fantasy',
    sellerName: 'Shreya Verma',
    sellerContact: '7543210987',
    status: 'Available',
    views: 134
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    price: 459,
    condition: 'Good',
    description: 'An epic science fiction novel set in a distant future with political intrigue and adventure.',
    category: 'Science Fiction',
    sellerName: 'Arjun Kapoor',
    sellerContact: '9432109876',
    status: 'Available',
    views: 198
  },
  {
    title: 'The Art of War',
    author: 'Sun Tzu',
    price: 249,
    condition: 'Fair',
    description: 'An ancient Chinese military treatise on strategy and tactics applicable to modern life.',
    category: 'Philosophy',
    sellerName: 'Bhavna Joshi',
    sellerContact: '8432109876',
    status: 'Available',
    views: 112
  },
  {
    title: 'Malibu Rising',
    author: 'Taylor Jenkins Reid',
    price: 359,
    condition: 'Like New',
    description: 'A saga about a famous family and their legendary annual beach party.',
    category: 'Fiction',
    sellerName: 'Sanjana Roy',
    sellerContact: '7432109876',
    status: 'Available',
    views: 145
  },
  {
    title: 'The Power of Now',
    author: 'Eckhart Tolle',
    price: 379,
    condition: 'Good',
    description: 'A guide to spiritual enlightenment and living in the present moment.',
    category: 'Self-Help',
    sellerName: 'Nikhil Mehra',
    sellerContact: '9321098765',
    status: 'Available',
    views: 203
  },
  {
    title: 'Verity',
    author: 'Colleen Hoover',
    price: 319,
    condition: 'Like New',
    description: 'A dark thriller about a successful author and the woman hired to finish her books.',
    category: 'Thriller',
    sellerName: 'Sakshi Bhat',
    sellerContact: '8321098765',
    status: 'Available',
    views: 267
  },
  {
    title: 'Braiding Sweetgrass',
    author: 'Robin Wall Kimmerer',
    price: 389,
    condition: 'Good',
    description: 'Essays on gratitude and nature from a Native American perspective.',
    category: 'Nature',
    sellerName: 'Aman Singh',
    sellerContact: '7321098765',
    status: 'Available',
    views: 123
  },
  {
    title: 'It Ends with Us',
    author: 'Colleen Hoover',
    price: 329,
    condition: 'Fair',
    description: 'A powerful story about domestic abuse, love, and difficult choices.',
    category: 'Drama',
    sellerName: 'Pooja Desai',
    sellerContact: '9210987654',
    status: 'Available',
    views: 289
  }
];

async function seedBooks() {
  const uri = process.env.MONGODB_URL;
  if (!uri) {
    console.error('❌ Please set MONGODB_URL in your .env file');
    process.exit(1);
  }

  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    // Clear existing books
    console.log('🗑️  Clearing existing books...');
    await BooksLibrary.deleteMany({});
    await BooksLibraryCounter.deleteMany({});

    // Reset counter
    console.log('🔄 Resetting book counter...');
    await BooksLibraryCounter.create({ _id: 'booksLibraryId', seq: 0 });

    // Seed books
    console.log(`📚 Seeding ${DUMMY_BOOKS.length} dummy books...`);
    const booksToInsert = DUMMY_BOOKS.map((book, index) => ({
      id: index + 1,
      ...book,
      sellerId: DUMMY_USER_ID,
      image: `https://via.placeholder.com/300x400?text=${encodeURIComponent(book.title)}`
    }));

    const result = await BooksLibrary.insertMany(booksToInsert);
    console.log(`✅ Successfully inserted ${result.length} books`);

    console.log('\n📊 Seeded Books Summary:');
    console.log(`   Total Books: ${result.length}`);
    console.log(`   Categories: ${[...new Set(DUMMY_BOOKS.map(b => b.category))].join(', ')}`);
    console.log(`   Price Range: ₹${Math.min(...DUMMY_BOOKS.map(b => b.price))} - ₹${Math.max(...DUMMY_BOOKS.map(b => b.price))}`);

  } catch (err) {
    console.error('❌ Error seeding books:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n✨ Seeding completed. Disconnected from MongoDB.');
  }
}

seedBooks();
