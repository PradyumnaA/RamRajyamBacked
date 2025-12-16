require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/userModels');

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const createTestUser = async () => {
    try {
        console.log('🚀 Creating test user...\n');

        // Check if user already exists
        let user = await User.findOne({ email: 'pradyumnalearner@gmail.com' });
        
        if (user) {
            console.log('✓ User already exists. Updating password...');
            // Update password
            const hashedPassword = await bcrypt.hash('Prada1998!', 10);
            user.password = hashedPassword;
            await user.save();
            console.log('✓ Password updated');
        } else {
            console.log('✓ Creating new user...');
            // Hash the password
            const hashedPassword = await bcrypt.hash('Prada1998!', 10);
            
            // Create new user
            user = await User.create({
                email: 'pradyumnalearner@gmail.com',
                password: hashedPassword,
                fullName: 'Test User',
                contactNo: '9999999998',
                role: 'user',
                city: 'Delhi'
            });
            console.log('✓ User created');
        }

        console.log('\n✅ Test User Ready!\n');
        console.log('Email: pradyumnalearner@gmail.com');
        console.log('Password: Prada1998!');
        console.log('\nYou can now login with this account.\n');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
};

createTestUser();
