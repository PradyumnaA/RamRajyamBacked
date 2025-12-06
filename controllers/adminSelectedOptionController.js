const User = require('../models/userModels');
const SelectedOptions = require('../models/userSelectedOptionsModel');

// Get all selected options for admin
exports.getAllSelectedOptions = async (req, res) => {
    try {
        const selectedOptions = await SelectedOptions.find().populate('userId', 'fullName email'); // Populate user details

        if (!selectedOptions || selectedOptions.length === 0) {
            return res.status(404).json({ error: 'Selected options not found' });
        }

        res.status(200).json(selectedOptions);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
