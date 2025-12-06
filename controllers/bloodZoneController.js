const User = require('../models/userModels');
//admin
exports.getBloodZoneUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', bloodGroup, city, pincode } = req.query;

        // Build the query object
        let query = { bloodYN: { $in: ['Yes', 'yes'] } };

        // Add search condition for full name if search query is provided
        if (search) {
            query.fullName = { $regex: search, $options: 'i' }; // 'i' makes the search case-insensitive
        }

        // Add search condition for blood group if provided
        if (bloodGroup) {
            query.bloodGroup = bloodGroup;
        }

        // Add search condition for city if provided
        if (city) {
            query.city = { $regex: city, $options: 'i' }; // Case-insensitive search for city
        }

        // Add search condition for pincode if provided
        if (pincode) {
            query.pincode = pincode;
        }

        // Get filtered and paginated users
        const bloodZoneUsers = await User.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        // Get the total count of matched users for pagination
        const totalBloodZoneUsers = await User.countDocuments(query);

        res.status(200).json({
            status: 'success',
            data: {
                users: bloodZoneUsers,
                currentPage: page,
                totalPages: Math.ceil(totalBloodZoneUsers / limit),
                totalBloodZoneUsers: totalBloodZoneUsers
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

