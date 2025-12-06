const Category = require('../models/galleryCategoryModel');
const Counter = require('../models/galleryCategoryCounter');
const path = require('path');

// Helper function to get the next sequence value
const getNextSequenceValue = async (sequenceName) => {
  const counter = await Counter.findByIdAndUpdate(
    sequenceName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};

// Create a new category
exports.createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    const id = await getNextSequenceValue('categoryId');
    const newCategory = new Category({ id, name });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
  
      // Create a filter object for searching by category name
      const filter = search ? { name: { $regex: search, $options: 'i' } } : {};
  
      // Calculate the number of documents to skip
      const skip = (page - 1) * limit;
  
      // Fetch categories with pagination and search
      const categories = await Category.find(filter)
        .skip(skip)
        .limit(Number(limit));
  
      // Fetch the total count of categories for pagination info
      const totalCategories = await Category.countDocuments(filter);
  
      res.status(200).json({
        categories,
        currentPage: Number(page),
        totalPages: Math.ceil(totalCategories / limit),
        totalCategories
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

// Get a category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({ id: req.params.id });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a category by ID
exports.updateCategoryById = async (req, res) => {
  const { name } = req.body;


  try {
    const category = await Category.findOneAndUpdate(
      { id: req.params.id },
      { name },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a category by ID
exports.deleteCategoryById = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ id: req.params.id });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
