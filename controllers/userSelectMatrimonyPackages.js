const MatrimonyPackage = require('../models/packagesMatrimonyModel');
const User = require('../models/userModels'); // Assuming you have a user model

// Get All Packages for User
exports.getAllPackagesForUser = async (req, res) => {
    try {
        const packages = await MatrimonyPackage.find({}, 'title amount description link');
        res.status(200).json({ success: true, data: packages });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// User selects a package
exports.selectPackage = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming the user ID is available in the request object
        const { packageId } = req.body;

        // Check if the package exists
        const selectedPackage = await MatrimonyPackage.findById(packageId);
        if (!selectedPackage) {
            return res.status(404).json({ success: false, error: 'Package not found' });
        }

        // Update the user document with the selected package
        const user = await User.findByIdAndUpdate(userId, { selectedPackage: packageId }, { new: true }).populate('selectedPackage');

        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
