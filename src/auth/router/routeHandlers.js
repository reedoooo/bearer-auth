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
  } catch (err) {
    next(err);
  }
}

// Handle user signin
async function handleSignin(req, res, next) {
  try {
    const user = {
        username: req.body.username,
        token: req.body.token
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

// Handle get users
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

// Handle secret data
function handleSecret(req, res, next) {
  // This could be any data you want to keep secret
  res.status(200).json({ secret: 'This is a secret message' });
}

module.exports = {
  handleSignin,
  handleSignup,
  handleGetUsers,
  handleSecret
};
