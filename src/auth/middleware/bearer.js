'use strict';

// Import the users model from the models directory
const { users } = require('../models/index.js');

// Define an Express middleware function for bearer token authentication
const bearer = async (req, res, next) => {

  try {
    // If no authorization header is present on the request, move to the next middleware or route handler with an error
    if (!req.headers.authorization) { 
      next('Invalid Login'); 
    }

    // Extract the token from the authorization header
    const token = req.headers.authorization.split(' ')[1];

    // Authenticate the user using the provided token
    const validUser = await users.authenticateToken(token);

    // Attach the authenticated user and their token to the request object
    req.user = validUser;
    req.token = validUser.token;

    // Proceed to the next middleware function or route handler
    next();

  } catch (e) {
    // If authentication fails, log the error and send a 403 response
    console.error(e);
    res.status(403).send('Invalid Login');
  }
}

// Export the middleware function
module.exports = bearer;
