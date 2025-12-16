const jwt = require('jsonwebtoken');
const User = require('../models/userModels');
const { secretKey } = require('../config');

const bcrypt = require('bcryptjs');

exports.loginUser = async (req, res) => {
  try {
    // MODIFIED: Accept both email and contactNo for login
    const { contactNo, email, password } = req.body;

    // basic validation - require either email or contactNo, plus password
    if ((!contactNo && !email) || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email or contactNo, and password are required'
      });
    }

    // Find the user by contact number OR email
    const user = await User.findOne({
      $or: [
        { contactNo: contactNo || '' },
        { email: email || '' }
      ]
    });

    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid credentials'
      });
    }

    if (!user.password) {
      // defensive: no password stored
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid contactNo or password'
      });
    }

    // Check if passwords match using bcryptjs
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid contactNo or password'
      });
    }

    // Password is correct, generate JWT token (add expiry)
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      secretKey,
      { expiresIn: '7d' } // change as needed
    );

    // remove sensitive fields before sending back
    delete user.password;

    res.status(200).json({
      status: 'success',
      data: {
        user,
        token
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      status: 'fail',
      message: err.message || 'Internal server error'
    });
  }
};
