'use strict';

// Importing necessary packages and middleware
const express = require('express');
const basicAuth = require('../middleware/basic.js');
const bearerAuth = require('../middleware/bearer.js');

// Importing route handlers
const {
  handleSignin,
  handleSignup,
  handleGetUsers,
  handleSecret
} = require('./routeHandlers.js');

// Create a new router object
const authRouter = express.Router();

// Handle user signup requests
// No authentication required for signing up new users
authRouter.post('/signup', handleSignup);

// Handle user signin requests
// Basic authentication is required for signing in users
authRouter.post('/signin', basicAuth, handleSignin);

// Handle get users requests
// Bearer authentication (token-based authentication) is required for getting users
authRouter.get('/users', bearerAuth, handleGetUsers);

// Handle secret endpoint requests
// Bearer authentication (token-based authentication) is required for accessing secret information
authRouter.get('/secret', bearerAuth, handleSecret);

// Export the router for use in other files
module.exports = authRouter;
