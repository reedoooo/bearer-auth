'use strict';

const { users } = require('../models/index.js');

// Handle user signup
async function handleSignup(req, res, next) {
  try {
    let userRecord = await users.create(req.body);
    const output = {
        user: userRecord,
        token: userRecord.token
    };
    res.status(201).json(output);
  } catch (e) {
    if(e.name === 'SequelizeUniqueConstraintError'){
      res.status(409).send('Username already exists');
    } else{
    
      next(e);
    }
  }
}

// Handle user signin
async function handleSignin(req, res, next) {
  try {

    const user = {
        user: req.user,
        token: req.user.token
    };
    if(!req.user){
        throw new Error('User Not Found');
      }
    res.status(200).json(user);
  } catch (e) {
    if(e.message === 'User Not Found'){
      res.status(404).send('User not found');
    } else{
      next(e);
    }
  }
}

// Handle getting all users
async function handleGetUsers(req, res, next) {
  try {
    let userRecords = await users.findAll({});
    const list = userRecords.map(user => user.username);
    res.status(200).json(list);
  } catch (e) {
    console.error(e);
    next(e);
  }
}

// Handle request to secret area
function handleSecret(req, res, next) {
  res.status(200).send("Welcome to the secret area!");
} 

module.exports = {
  handleSignin,
  handleSignup,
  handleGetUsers,
  handleSecret
};
