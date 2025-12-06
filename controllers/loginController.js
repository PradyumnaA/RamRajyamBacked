constjwt = require('jsonwebtoken');
const User = require('../models/userModels');
const { secretKey } = require('../config');

const bcrypt = require('bcryptjs');

exports.loginUser = async (req, res) => {
  try {
    const { contactNo, password } = req.body;

    // basic validation
    if (!contactNo || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'contactNo and password are required'
      });
    }

    // Find the user by contact number
    const user = await User.findOne({ contactNo }).lean(); // lean() returns plain JS object

    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid contactNo or password'
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
