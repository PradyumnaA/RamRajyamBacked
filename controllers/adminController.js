// controllers/adminController.js
const Admin = require('../models/adminModel');
const jwt = require('jsonwebtoken');
const { secretKey } = require('../config');

const registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingAdmin = await Admin.findOne({ username });

    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const newAdmin = new Admin({ username, password });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering admin', error: error.message });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isValidPassword = await admin.isValidPassword(password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ adminId: admin._id }, secretKey, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Other admin controller functions can be added as needed

module.exports = { registerAdmin, loginAdmin };
