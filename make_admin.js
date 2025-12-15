require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/userModels');

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const makeAdmin = async () => {
    try {
        const result = await User.findOneAndUpdate(
            { email: 'puso@puso.com' },
            { role: 'admin' },
            { new: true }
        );
        
        if (result) {
            console.log('✅ Puso is now an admin!');
            console.log('Updated user:', result);
        } else {
            console.log('❌ User not found');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

makeAdmin();