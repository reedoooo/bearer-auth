'use strict';

// Import necessary modules
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

if (!process.env.SECRET) {
  throw new Error("Missing SECRET in environment variables");
}

const userSchema = (sequelize, DataTypes) => {
  const model = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    token: { 
      type: DataTypes.VIRTUAL,
      get() {
        return jwt.sign({ username: this.username }, process.env.SECRET, { expiresIn: '0.5h' });
      }
    }
  });

  model.beforeCreate(async (user) => {
    try {
      let hashedPass = await bcrypt.hash(user.password, 10);
      user.password = hashedPass;
    } catch (err) {
      
      throw err;
    }
  });

  model.authenticateBasic = async function (username, password) {
    try {
      if (!username || !password) {
        throw new Error('Missing username or password');
      }
      const user = await this.findOne({ where: { username } });
      if (user && await bcrypt.compare(password, user.password)) { 
        return user; 
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (err) {

      throw err;
    }
  };

  model.authenticateToken = async function (token) {
    try {
      const parsedToken = jwt.verify(token, process.env.SECRET); 
      const user = await this.findOne({ where: { username: parsedToken.username } });
      if (user) {
        return user;
      } else {
        throw new Error("User Not Found");
      }
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      } else {
        console.error(e.message);
        throw e;
      }
    }
  };

  return model;
};

module.exports = userSchema;
