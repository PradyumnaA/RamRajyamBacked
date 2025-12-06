const Category = require('../models/optionsCategory');
const SelectedOption = require('../models/optionSelectedOptions');
const User = require('../models/userModels');

exports.createSelectedOption = async (req, res) => {
  const { categoryId, name, contactNo, email, description } = req.body;
  const userId = req.user._id; // Assuming userId is stored in req.user



  if (!categoryId) {
    return res.status(400).json({ error: 'Category ID is required' });
  }

  try {
    // Check if the category ID exists
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const newSelectedOption = new SelectedOption({
      userId,
      categoryId,
      name,
      contactNo,
      email,
      description,
    });
    await newSelectedOption.save();

    // Populate user and category details
    const populatedSelectedOption = await SelectedOption.findById(newSelectedOption._id)
      .populate('userId', 'fullName contactNo email address') // Populate user details
      .populate('categoryId', 'name image'); // Populate category details

    res.status(201).json(populatedSelectedOption);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Example backend handler
exports.getAllSelectedOptions = async (req, res) => {
  try {
    const { page = 1, limit = 10, name = '' } = req.query;

    const filter = name ? { name: { $regex: name, $options: 'i' } } : {};

    const skip = (page - 1) * limit;

    const selectedOptions = await SelectedOption.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .populate('userId', 'fullName contactNo email address')
      .populate('categoryId', 'name image');

    const totalSelectedOptions = await SelectedOption.countDocuments(filter);

    res.status(200).json({
      selectedOptions,
      currentPage: Number(page),
      totalPages: Math.ceil(totalSelectedOptions / limit),
      totalSelectedOptions
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

