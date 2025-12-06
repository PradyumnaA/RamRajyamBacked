const bcrypt = require('bcryptjs');

const enteredPassword = '123456'; // This should be the password entered during login
const storedHash = '$2a$10$abcdefghijABCDEFGHIJabcdefghijABCDEFGHIJabcdefghijABCDEFGHIJabcdefghijA'; // Example stored hash

bcrypt.hash(enteredPassword, 10, (err, hashedPassword) => {
    if (err) {
        console.error('Bcrypt hash error:', err);
        // Handle error
        return;
    }

    // console.log('Manually hashed password:', hashedPassword);

    bcrypt.compare(hashedPassword, storedHash, (err, result) => {
        if (err) {
            console.error('Bcrypt compare error:', err);
            // Handle error
            return;
        }
        // console.log('Password match:', result);
    });
});
