#!/usr/bin/env node
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { ObjectId } = mongoose.Types;

const SEED_FILE = path.join(__dirname, 'dummy_seed.json');

function convertExtendedJSON(value) {
  if (Array.isArray(value)) {
    return value.map(convertExtendedJSON);
  }

  if (value && typeof value === 'object') {
    // {$oid: "..."}
    if (Object.keys(value).length === 1 && value.$oid) {
      try {
        return new ObjectId(value.$oid);
      } catch (e) {
        return value.$oid;
      }
    }
    // {$date: "..."}
    if (Object.keys(value).length === 1 && value.$date) {
      return new Date(value.$date);
    }

    const out = {};
    for (const k of Object.keys(value)) {
      out[k] = convertExtendedJSON(value[k]);
    }
    return out;
  }

  return value;
}

async function hashPasswords(docs) {
  const out = [];
  for (const doc of docs) {
    const copy = { ...doc };
    if (copy.password && typeof copy.password === 'string') {
      try {
        const salt = await bcrypt.genSalt(10);
        copy.password = await bcrypt.hash(copy.password, salt);
      } catch (err) {
        console.error('Error hashing password for doc', doc, err);
      }
    }
    out.push(copy);
  }
  return out;
}

async function main() {
  if (!fs.existsSync(SEED_FILE)) {
    console.error('Seed file not found:', SEED_FILE);
    process.exit(1);
  }

  const raw = fs.readFileSync(SEED_FILE, 'utf8');
  let seed;
  try {
    seed = JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse seed JSON:', err.message);
    process.exit(1);
  }

  const uri = process.env.MONGODB_URL;
  if (!uri) {
    console.error('Please set MONGODB_URL in your environment (.env or env var)');
    process.exit(1);
  }

  try {
    console.log('Connecting with Mongoose using MONGODB_URL...');
    // same connection style that works in index.js
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB (via Mongoose in dummy_seed.js)');

    const db = mongoose.connection.db;

    for (const entry of seed) {
      const collName = entry.collection;
      if (!collName) {
        console.warn('Skipping entry without collection name', entry);
        continue;
      }

      const rawDocs = entry.documents || [];
      const converted = rawDocs.map((d) => convertExtendedJSON(d));
      const hashed = await hashPasswords(converted);

      // *** IMPORTANT FIXES ***
      // 1. Strip _id so we don’t get duplicate _id errors from dumps
      // 2. Let Mongo generate new _id values
      const sanitized = hashed.map((doc) => {
        const { _id, ...rest } = doc;
        return rest;
      });

      console.log(`Importing ${sanitized.length} documents into collection '${collName}'`);

      // Make seeding idempotent
      await db.collection(collName).deleteMany({});

      if (sanitized.length > 0) {
        try {
          // ordered:false => one bad doc won’t stop all others
          await db.collection(collName).insertMany(sanitized, { ordered: false });
        } catch (err) {
          console.error(`❌ Error inserting docs into '${collName}':`, err.message);
          if (err.writeErrors) {
            for (const we of err.writeErrors) {
              console.error('   -> writeError index', we.index, 'code', we.code, 'msg', we.errmsg);
            }
          }
          // Don’t exit immediately so we can still seed other collections
        }
      }

      console.log(`-> Done: ${collName}`);
    }

    console.log('🎉 Seeding completed (with above warnings if any).');
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();
