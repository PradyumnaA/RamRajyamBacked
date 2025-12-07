// config.js
const crypto = require('crypto');

// Prefer an explicit, stable secret from environment for JWT signing.
// If `JWT_SECRET` is not provided, fall back to a generated key (not recommended for production).
const secretKey = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');

if (!process.env.JWT_SECRET) {
    // Helpful message for developers; do not print secrets in production logs.
    console.warn('WARNING: JWT_SECRET is not set. A temporary secret was generated. Tokens will be invalid across restarts.');
}

module.exports = {
    secretKey
};

