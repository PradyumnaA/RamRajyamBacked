const Package = require('../models/packagesModel');

// Admin Controllers
exports.createPackage = async (req, res) => {
    try {
        const { title, amount, description, link, startDate, endDate, packageType } = req.body;

        // Log received data
        console.log(req.body);

        if (!title || !amount) {
            return res.status(400).json({ success: false, error: 'Title and amount are required.' });
        }

        // Convert date strings to Date objects
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Set hours for proper date storage
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        const package = await Package.create({ 
            title, 
            amount, 
            description, 
            link, 
            startDate: start, 
            endDate: end, 
            packageType 
        });
        res.status(201).json({ success: true, data: package });
    } catch (err) {
        console.error(err); // Log error for debugging
        res.status(400).json({ success: false, error: err.message });
    }
};



exports.getAllPackages = async (req, res) => {
    try {
        const { title, page, limit } = req.query;
        const query = title ? { title: { $regex: title, $options: 'i' } } : {};
        const packages = await Package.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Package.countDocuments(query);
        res.status(200).json({ success: true, data: packages, totalPages: Math.ceil(count / limit) });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getPackageById = async (req, res) => {
    try {
        const package = await Package.findById(req.params.id);
        if (!package) {
            return res.status(404).json({ success: false, error: 'Package not found' });
        }
        res.status(200).json({ success: true, data: package });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.updatePackage = async (req, res) => {
    const { title, amount, description, link, packageType, startDate, endDate } = req.body;

    try {
        
        const updatedPackage = await Package.findByIdAndUpdate(
            req.params.id,
            {
                title,
                amount,
                description,
                link,
                packageType,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                  // Ensure this is in ISO format
            },
            { new: true }
        );
        console.log('Request Body:', req.body);

        if (!updatedPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }

        res.status(200).json({ data: updatedPackage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};




exports.deletePackage = async (req, res) => {
    try {
        const package = await Package.findByIdAndDelete(req.params.id);
        if (!package) {
            return res.status(404).json({ success: false, error: 'Package not found' });
        }
        res.status(200).json({ success: true, message:'Deleted Successfully ' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// User Controller
exports.getAllPackagesForUser = async (req, res) => {
    try {
        const packages = await Package.find({}, 'title amount description link startDate endDate packageType');
        res.status(200).json({ success: true, data: packages });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

//getall api for sponsor packages 
exports.getAllSponsorPackages = async (req, res) => {
    try {
        const packages = await Package.find({
            packageType: { $in: ['Sponsor', 'sponsor'] }
        }, 'title amount description link startDate endDate packageType');

        res.status(200).json({ success: true, data: packages });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

//getall user sponsor packages
exports.getAllSponsorPackagesForUser = async (req, res) => {
    try {
        const packages = await Package.find({
            packageType: { $in: ['Sponsor', 'sponsor'] }
        }, 'title amount description link startDate endDate packageType');

        res.status(200).json({ success: true, data: packages });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};