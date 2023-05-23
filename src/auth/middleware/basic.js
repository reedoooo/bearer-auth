'use strict';

// Import the base-64 module for decoding base64 strings
const base64 = require('base-64');

// Import the users model from the models directory
const { users } = require('../models/index.js');

// Export a middleware function for basic authentication
module.exports = async (req, res, next) => {

  // If no authorization header is present on the request, return an authentication error
  if (!req.headers.authorization) { 
    return _authError(); 
  }

  // Extract the credentials from the authorization header
  let credentials = req.headers.authorization.split(' ')[1];

  // Decode the base64 credentials and split them into username and password
  let [username, pass] = base64.decode(credentials).split(':'); 

  try {
    // Try to authenticate the user using the provided username and password
    req.user = await users.authenticateBasic(username, pass);

    // If successful, proceed to the next middleware function or route handler
    next();
  } catch (e) {
    // If authentication fails, log the error and send a 403 response
    console.error(e);
    res.status(403).send('Invalid Login');
  }
}
