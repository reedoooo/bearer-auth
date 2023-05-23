'use strict';

require('dotenv').config();

const { db } = require('./src/auth/models/index.js');
const server = require('./src/server.js')

// Start up DB Server
db.sync()
  .then(() => {
    // Start the web server
    server.startup(process.env.PORT);
  });
// 'use strict'

// require('dotenv').config();
// const server = require('./src/server');
// const { sequelize } = require('./src/auth/models/index') // import db models

// sequelize.sync()
// .then( () => {
//   server.start(process.env.PORT)
// })
// .catch(error => {
//   console.error(`SQL CONNECT ERROR: `, error)
// })