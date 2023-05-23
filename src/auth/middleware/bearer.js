"use strict";

// Import the users model from the models directory
const { users } = require("../models/index.js");

// Define an Express middleware function for bearer token authentication
const bearer = async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ').pop();
      const user = await users.authenticateToken(token);
  
      req.user = user;
      req.token = user.token;
      next();
    } catch (error) {
    //   console.error('Invalid token:', error);
      res.status(403).send("Invalid Login");
      next(error); // Call next with error to stop execution
    }
  };
  

// Export the middleware function
module.exports = bearer;
