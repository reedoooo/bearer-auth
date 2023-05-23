'use strict';

// Setting up a secret for JWT tokens
process.env.SECRET = "TEST_SECRET";

// Importing necessary dependencies
const { db } = require('../../../../../src/auth/models/index.js');
const { handleSignup } = require('../../../../../src/auth/router/routeHandlers.js');

// Pre-loading the database before all test cases
beforeAll(async () => {
  // Syncing the database
  await db.sync();
});

// Dropping the database after all test cases are done
afterAll(async () => {
  await db.drop();
});

describe('testing the Signup Handler', () => {

  // Mocking response object and next function for Express.js
  const res = {
    send: jest.fn(() => res),
    status: jest.fn(() => res),
    json: jest.fn(() => res),
  };
  const next = jest.fn();

  // Test case for successful signup
  test('Should respond with a new user if a Username and Password is present on the request', async () => {

    // Mocking a request with username and password
    let req = {
      body: {
        username: 'test',
        password: 'test'
      }
    };

    // Calling the handleSignup function
    await handleSignup(req, res, next);

    // Verifying the response status and JSON body
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        user: expect.any(Object),
        token: expect.any(String)
      })
    );
  });

  // Test case for request with missing body
  test('Should call the error handler if no body attached to the request on the request body', async () => {

    // Mocking a request without a body
    let req = {};
    jest.clearAllMocks();

    // Calling the handleSignup function
    await handleSignup(req, res, next);

    // Verifying that the error handler has been called and no response has been sent
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.anything());
  });
});
