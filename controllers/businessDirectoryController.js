const User = require('../models/userModels');

exports.getBusinessDirectoryUsers = async (req, res) => {
    try {
        const { username, page = 1, limit = 10 } = req.query;
        let filter = { 'businessProfile.firmName': { $exists: true, $ne: '' } }; 
        let query = {};

        // Apply username search if provided
        if (username) {
            query.fullName = { $regex: new RegExp(username, 'i') };
        }

        const count = await User.countDocuments({ ...filter, ...query });

        const users = await User.find({ ...filter, ...query })
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            status: 'success',
            data: {
                users,
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                totalUsers: count
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
};

