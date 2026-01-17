require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/userModels');

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const fixUserPassword = async () => {
    try {
        console.log('🔧 Fixing user password...\n');

        // Find the user
        const user = await User.findOne({ email: 'pradyumnalearner@gmail.com' });
        
        if (!user) {
            console.log('❌ User not found');
            process.exit(1);
        }

        console.log(`✓ Found user: ${user.email}`);
        
        // Hash the password with bcrypt
        const hashedPassword = await bcrypt.hash('Prada1998!', 10);
        user.password = hashedPassword;
        await user.save();
        
        console.log('✓ Password updated with proper bcrypt hashing');
        console.log('\n✅ User Password Fixed!\n');
        console.log('Email: pradyumnalearner@gmail.com');
        console.log('Password: Prada1998!');
        console.log('\nYou can now login.\n');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
};

fixUserPassword();
