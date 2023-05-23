'use strict';

require('dotenv').config();

// Import necessary modules and libraries
const { Sequelize, DataTypes } = require('sequelize'); // Import Sequelize ORM
const userSchema = require('./users.js');
const env = process.env.NODE_ENV || 'development';
const config = require('../../../config/config.json')[env]; // Replace with your actual config file path

// Define connection string, defaulting to in-memory database for lack of a defined DATABASE_URL
let DATABASE_URL;
if (process.env.NODE_ENV === 'test') {
  DATABASE_URL = 'sqlite::memory';
} else if (process.env.NODE_ENV === 'development') {
  DATABASE_URL = `postgres://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`;
} else {
  DATABASE_URL = process.env.DATABASE_URL;
}

console.log('DATABASE_URL:', DATABASE_URL);

const sequelize = new Sequelize(DATABASE_URL, {
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

module.exports = {
  db: sequelize,
  users: userSchema(sequelize, DataTypes),
};

// 'use strict'

// require('dotenv').config();

// // Import necessary modules and libraries
// const { Sequelize, DataTypes } = require('sequelize'); // Import Sequelize ORM
// const userSchema = require('./users.js');

// // Define connection string, defaulting to in-memory database for lack of a defined DATABASE_URL
// const DATABASE_URL = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development' ? 'sqlite::memory' : process.env.DATABASE_URL;

// // Define database configuration object, which will be used to configure the Sequelize instance
// // const DATABASE_CONFIG = process.env.NODE_ENV === 'production' ? {
// //   // dialect: 'postgres',
// //   dialectOptions: {
// //     ssl: {
// //       require: true,
// //       rejectUnauthorized: false,
// //     }
// //   }
// // } : {};

// // const DATABASE_CONFIG = {
// //   dialectOptions: {
// //     ssl: {
// //       require: true,
// //       rejectUnauthorized: false
// //     }
// //   },
// //   logging: false
// // };

// // Create a Sequelize instance using the connection string
// console.log('DATABASE_URL:', DATABASE_URL);

// const sequelize = new Sequelize(DATABASE_URL);
// // const sequelize = new Sequelize(DATABASE_URL, DATABASE_CONFIG);
// // console.log('DATABASE_URL:', sequelize);

// // Below code is currently commented out. If uncommented, it would hash passwords before creating user entries in the database
// // usersModel.beforeCreate(async user => {
// //   user.password = await bcrypt.hash(user.password, 10);
// // })

// // Export sequelize instance and defined models for further use
// module.exports = {
//   db: sequelize,
//   users: userSchema(sequelize, DataTypes),
// }
