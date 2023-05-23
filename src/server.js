'use strict';

// Importing necessary packages
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const errorHandler = require('./auth/error-handlers/500.js');
const notFound = require('./auth/error-handlers/404.js');
const authRoutes = require('./auth/router/authRoutes.js');
const logger = require('./middleware/logger.js');

// Create an instance of express
const app = express();

// Add middleware functions
app.use(logger); // Log every request to the console

// Allow the app to use CORS (Cross Origin Resource Sharing) to enable interaction with other websites
app.use(cors());
app.use(morgan('dev'));

// Process JSON input and put the data on req.body for further handling
app.use(express.json());

// Process FORM input and put the data on req.body for further handling
app.use(express.urlencoded({ extended: true }));

// Use the routes defined in authRoutes.js
app.use(authRoutes);

// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  startup: (PORT) => {
    app.listen(PORT, () => {
      console.log(`Server Up on ${PORT}`);
    });
  },
};
