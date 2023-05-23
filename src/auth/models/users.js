'use strict';

// Import necessary modules
require('dotenv').config(); // To use .env file to store and use environment variables
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken'); // For generating JSON web tokens

// Define a function to generate a Users model. The Sequelize instance is passed in as an argument.
const userSchema = (sequelize, DataTypes) => {

  // Define the Users model with username, password, and token fields
  const model = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true }, // Username must be unique and not null
    password: { type: DataTypes.STRING, allowNull: false, }, // Password must not be null
    token: { // The token field is virtual, meaning it's not actually stored in the DB
      type: DataTypes.VIRTUAL,
      get() { // Define a getter for the token which generates a token signed with the username and secret key
        return jwt.sign({
          username: this.username,
        }, 
        process.env.SECRET, // Use the secret from the environment variables
        {expiresIn: '0.5h'} // The token will expire in 30 minutes
        );
      }
    }
  });

  // Before a user is created, hash their password
  model.beforeCreate(async (user) => {
    let hashedPass = await bcrypt.hash(user.password, 10);
    user.password = hashedPass;
  });

  // Basic AUTH: Method for validating strings (username, password) 

  model.authenticateBasic = async function (username, password) {
    const user = await this.findOne({ where: {username: username} });
    if (!user) {
      throw new Error('User Not Found');
    }
    const valid = await bcrypt.compare(password, user.password);
    if (valid) { 
      return user; 
    } else {
      throw new Error('Invalid Password');
    }
  };
  
    // model.authenticateBasic = async function (username, password) {
  //   const user = await this.findOne({ where: {username: username} });
  //   const valid = await bcrypt.compare(password, user.password);
  //   if (valid) { return user; }
  //   throw new Error('Invalid User');
  // };

  // Bearer AUTH: Method for validating a token
  model.authenticateToken = async function (token) {
    try {
      const parsedToken = jwt.verify(token, process.env.SECRET); // Parse the token
      const user = await this.findOne({ where: {username: parsedToken.username} });
      if (user) {
        return user;
      } else {
        throw new Error("User Not Found");
      }
    } catch (e) {
      throw new Error(e.message);
    }
  };
  // model.authenticateToken = async function (token) {
  //   try {
  //     const parsedToken = jwt.verify(token, process.env.SECRET); // Parse the token
  //     const user = await this.findOne({ username: parsedToken.username });
  //     if (user) {
  //       // TODO: If the token is expired, refresh the token. Implementation needed.
  //       return user;
  //     }
  //     throw new Error("User Not Found");
  //   } catch (e) {
  //     throw new Error(e.message);
  //   }
  // };

  // Return the Users model
  return model;
};

// Export the Users model generator function
module.exports = userSchema;
