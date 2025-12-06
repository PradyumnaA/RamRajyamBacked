const Bank = require('../models/bloodBankModel');
const Counter = require('../models/bloodBankCounter');

// Helper function to get the next sequence value
async function getNextSequenceValue(sequenceName) {
  const counter = await Counter.findOneAndUpdate(
    { name: sequenceName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

// Create a new bank detail
exports.createBank = async (req, res) => {
  try {
    const id = await getNextSequenceValue('bankId');
    const bank = new Bank({ id, ...req.body });
    await bank.save();
    res.status(201).json(bank);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update bank detail by ID
exports.updateBankById = async (req, res) => {
  try {
    const bank = await Bank.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!bank) return res.status(404).json({ message: 'Bank not found' });
    res.json(bank);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete bank detail by ID
exports.deleteBankById = async (req, res) => {
  try {
    const bank = await Bank.findOneAndDelete({ id: req.params.id });
    if (!bank) return res.status(404).json({ message: 'Bank not found' });
    res.json({ message: 'Bank deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get bank detail by ID
exports.getBankById = async (req, res) => {
  try {
    const bank = await Bank.findOne({ id: req.params.id });
    if (!bank) return res.status(404).json({ message: 'Bank not found' });
    res.json(bank);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all bank details with search by name and pincode, and pagination
// Get all bank details with search by name and pincode, and pagination
exports.getAllBanks = async (req, res) => {
  const { page = 1, limit = 10, name, pincode } = req.query;
  const query = {};

  if (name) {
    query.name = new RegExp(name, 'i'); // case-insensitive search by name
  }
  if (pincode) {
    query.pincode = pincode; // exact match search by pincode
  }

  // console.log("Query:", query); // Debugging: Log the query object

  try {
    const banks = await Bank.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Bank.countDocuments(query);

    // console.log("Banks found:", banks); // Debugging: Log the found banks

    res.json({
      banks,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      totalItems: total
    });
  } catch (error) {
    console.error("Error fetching banks:", error); // Debugging: Log the error
    res.status(400).json({ message: error.message });
  }
};

