// config.js
const crypto = require('crypto');

// Generate a random secret key
const secretKey = crypto.randomBytes(32).toString('hex');

module.exports = {
    secretKey: secretKey // Replace 'your_secret_key' with the generated secret key
};

