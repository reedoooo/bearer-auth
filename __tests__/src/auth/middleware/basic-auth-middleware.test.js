'use strict';

// Setting up a secret for JWT tokens
process.env.SECRET = "TEST_SECRET";

// Importing necessary dependencies
const base64 = require('base-64');
const basic = require('../../../../src/auth/middleware/basic.js');
const { db, users } = require('../../../../src/auth/models/index.js');
// const { test } = require('node:test');

// Creating a fake user to be used in the test cases
let userInfo = {
  admin: { username: 'admin-basic', password: 'password' },
};

// Pre-loading the database with a fake user
beforeAll(async () => {
  // Syncing the database
  await db.sync();
  // Creating the user
  await users.create(userInfo.admin);
});

// Teardown the database after the tests are done
afterAll(async () => {
  // Dropping the database
  await db.drop();
});

describe('Auth Middleware', () => {

  // Mocking the express req/res/next that we need for each middleware call
  const req = {};
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res)
  }
  const next = jest.fn();

  describe('user authentication', () => {

    test('fails a login for a user (admin) with the incorrect basic credentials', async () => {
      const req = {
        headers: {
          authorization: `Basic ${Buffer.from('admin:incorrectpassword').toString('base64')}`,
        },
      };
      const res = {
        status: jest.fn(() => res),
        send: jest.fn(),
      };
      const next = jest.fn();
    
      await basic(req, res, next);
    
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid username or password' }));
      expect(res.status).toHaveBeenCalledWith(403); // Expecting a 401 status code
      expect(res.send).toHaveBeenCalled();
    });
    
    
    test('logs in an admin user with the right credentials', async () => {
      // Encoding the correct username and password
      let basicAuthString = base64.encode(`${userInfo.admin.username}:${userInfo.admin.password}`);
    
      // Changing the request to match this test case
      req.headers = {
        authorization: `Basic ${basicAuthString}`,
      };
    
      await basic(req, res, next);
    
      expect(next).toHaveBeenCalledWith();
    });
    
    
  });
});
