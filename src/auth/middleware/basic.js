'use strict';

// Import the base-64 module for decoding base64 strings
const base64 = require('base-64');

// Import the users model from the models directory
const { users } = require('../models/index.js');


// Export a middleware function for basic authentication
const basicAuth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) { 
      next('Authentication Required');
      return; // Stop execution if no authorization header is present
    }

    let credentials = req.headers.authorization.split(' ')[1];
    let [username, password] = base64.decode(credentials).split(':'); 

    const validUser = await users.authenticateBasic(username, password);

    if (validUser) { // Check if the user is valid
      req.user = validUser;
      next();
    } else {
      next('Invalid Login'); // Call next with error if the user is not valid
    }
  } catch (e) {

    res.status(403).send('Invalid Login');
    next(e); // Call next with error to stop execution
  }
}


// Export the middleware function
module.exports = basicAuth;