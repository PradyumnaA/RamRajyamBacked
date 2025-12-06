require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');
const { initializeSocket } = require('./socket');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const webRoutes = require('./routes/webRoutes');
const bodyParser = require('body-parser');
const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');

const app = express();
const server = http.createServer(app);
const io = initializeSocket(server);



const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/web', webRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to Backend app!');
});

// mongoose
//   .connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log('Connected to MongoDB');
//   })
//   .catch((err) => {
//     console.error('Error connecting to MongoDB:', err.message);
//   });


//by Pradyumna
(async () => {
  try {
    console.log('MONGODB_URL present?:', !!process.env.MONGODB_URL);
    // uncomment to debug the actual URL (careful with secrets in logs)
    // console.log('MONGO_URL=', process.env.MONGO_URL);

    // Optional: helpful during development
    mongoose.set('debug', true);
    mongoose.set('strictQuery', false);

    // Use async/await so we catch errors cleanly
    await mongoose.connect(process.env.MONGODB_URL, {
      // modern mongoose ignores some old options but these are harmless
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10s timeout for initial selection
    });

    console.log('✅ Connected to MongoDB');

    // helpful listeners
    mongoose.connection.on('connected', () => {
      console.log('Mongoose default connection open');
    });
    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });
    mongoose.connection.on('disconnected', () => {
      console.warn('Mongoose default connection disconnected');
    });

    // optional: close gracefully
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Mongoose connection closed through app termination');
      process.exit(0);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    // exit if DB connection is critical
    process.exit(1);
  }
})();

const PORT = process.env.PORT || 3004;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
