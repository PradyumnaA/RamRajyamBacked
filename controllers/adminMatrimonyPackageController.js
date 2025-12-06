const Package = require('../models/packagesMatrimonyModel');

// Admin Controllers
exports.createPackage = async (req, res) => {
    try {
        const package = await Package.create(req.body);
        res.status(201).json({ success: true, data: package });
    } catch (err) {
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
    try {
        const package = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
        // console.log(req.body,"==")
        if (!package) {
            return res.status(404).json({ success: false, error: 'Package not found' });
        }
        res.status(200).json({ success: true, data: package });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
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
        const packages = await Package.find({}, 'title amount description link');
        res.status(200).json({ success: true, data: packages });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
