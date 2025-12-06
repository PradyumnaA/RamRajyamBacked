// controllers/casteSubcasteGotraController.js

const CasteSubcasteGotra = require('../models/casteModels');

// Add new entry
exports.addEntry = async (req, res) => {
  try {
    const { caste, subcaste, gotra } = req.body;
    const newEntry = new CasteSubcasteGotra({ caste, subcaste, gotra });
    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all entries
exports.getAllEntries = async (req, res) => {
    try {
      // Extract query parameters
      const { page = 1, limit = 10, caste, subcaste, gotra } = req.query;
  
      // Create a search criteria object
      const searchCriteria = {};
      if (caste) {
        searchCriteria.caste = { $regex: caste, $options: 'i' }; // case-insensitive search by caste
      }
      if (subcaste) {
        searchCriteria.subcaste = { $regex: subcaste, $options: 'i' }; // case-insensitive search by subcaste
      }
      if (gotra) {
        searchCriteria.gotra = { $regex: gotra, $options: 'i' }; // case-insensitive search by gotra
      }
  
      // Calculate the total number of entries matching the search criteria
      const totalEntries = await CasteSubcasteGotra.countDocuments(searchCriteria);
  
      // Fetch entries based on pagination and search criteria
      const entries = await CasteSubcasteGotra.find(searchCriteria)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
  
      res.status(200).json({
        entries,
        totalEntries,
        totalPages: Math.ceil(totalEntries / limit),
        currentPage: parseInt(page),
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  

// Get entry by ID
exports.getEntryById = async (req, res) => {
  try {
    const entry = await CasteSubcasteGotra.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.status(200).json(entry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.updateEntry = async (req, res) => {
    try {
      const { caste, subcaste, gotra } = req.body;
      const updatedEntry = await CasteSubcasteGotra.findByIdAndUpdate(
        req.params.id,
        { caste, subcaste, gotra },
        { new: true }
      );
      if (!updatedEntry) {
        return res.status(404).json({ message: 'Entry not found' });
      }
      res.status(200).json(updatedEntry);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
// Delete entry
exports.deleteEntry = async (req, res) => {
  try {
    const entry = await CasteSubcasteGotra.findByIdAndDelete(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.status(200).json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.getAllCastes = async (req, res) => {
  try {
    // Extract query parameters
    const { page = 1, limit = 10, caste, subcaste, gotra } = req.query;

    // Create a search criteria object
    const searchCriteria = {};
    if (caste) {
      searchCriteria.caste = { $regex: caste, $options: 'i' }; // case-insensitive search by caste
    }
    if (subcaste) {
      searchCriteria.subcaste = { $regex: subcaste, $options: 'i' }; // case-insensitive search by subcaste
    }
    if (gotra) {
      searchCriteria.gotra = { $regex: gotra, $options: 'i' }; // case-insensitive search by gotra
    }

    // Calculate the total number of entries matching the search criteria
    const totalEntries = await CasteSubcasteGotra.countDocuments(searchCriteria);

    // Fetch entries based on pagination and search criteria
    const entries = await CasteSubcasteGotra.find(searchCriteria)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      entries,
      totalEntries,
      totalPages: Math.ceil(totalEntries / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};