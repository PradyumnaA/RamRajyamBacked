require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/userModels');

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const grantAdminAccess = async () => {
    try {
        console.log('🔧 Granting admin access...\n');

        const user = await User.findOne({ email: 'pk@pk.com' });
        
        if (!user) {
            console.log('❌ User not found');
            process.exit(1);
        }

        console.log(`✓ Found user: ${user.email}`);
        console.log(`  Current role: ${user.role}`);
        
        user.role = 'admin';
        await user.save();
        
        console.log(`  Updated role: ${user.role}`);
        console.log('\n✅ Admin access granted!\n');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

grantAdminAccess();
