#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');

async function fixIndex() {
  try {
    const uri = process.env.MONGODB_URL;
    if (!uri) {
      console.error('MONGODB_URL not found in .env');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('✅ Connected');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Check existing indexes
    const indexes = await usersCollection.indexes();
    console.log('\nCurrent indexes:', indexes.map(i => i.name));

    // Drop the problematic regId_1 index
    try {
      await usersCollection.dropIndex('regId_1');
      console.log('✅ Dropped regId_1 index');
    } catch (err) {
      if (err.code === 27) {
        console.log('⚠️  regId_1 index not found (already removed or never existed)');
      } else {
        throw err;
      }
    }

    // Show remaining indexes
    const newIndexes = await usersCollection.indexes();
    console.log('\nRemaining indexes:', newIndexes.map(i => i.name));

    console.log('\n✅ Done! Restart your server and try registration again.');
  } catch (err) {
    console.error('Error:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

fixIndex();
