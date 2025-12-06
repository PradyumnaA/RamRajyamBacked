const Suggestion = require('../models/suggestionsModel');
const User = require('../models/userModels');

// Get all suggestions
exports.getAllSuggestions = async (req, res) => {
  try {
    const { username } = req.query;

    // Build the query
    let query = {};
    if (username) {
      const user = await User.findOne({ username });
      if (user) {
        query.createdBy = user._id;
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    }

    const suggestions = await Suggestion.find(query).populate('createdBy', 'username');
    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
