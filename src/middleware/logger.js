'use strict';

// Define an Express middleware function for logging requests
const logger = (req, res, next) => {
    // Log the HTTP method and the requested URL
    console.log(`Received a ${req.method} request on ${req.url}`);

    // Proceed to the next middleware function or route handler
    next();
};

// Export the middleware function
module.exports = logger;
