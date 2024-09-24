// adminMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const adminMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization.split(' ')[1];
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch the user details from DB
    const user = await User.findById(decoded.id);
    
    if (user && user.role === 'admin') {
      // User is an admin
      req.user = user;
      next();
    } else {
      res.status(401).json({ message: 'Not authorized as admin' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = adminMiddleware;
