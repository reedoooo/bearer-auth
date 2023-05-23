"use strict";

process.env.SECRET = "TEST_SECRET";

const bearer = require("../../../../src/auth/middleware/bearer");
const { db, users } = require("../../../../src/auth/models/index.js");
const jwt = require("jsonwebtoken");

let userInfo = {
  admin: { username: "admin", password: "password" },
};

// Pre-load our database with fake users
beforeAll(async () => {
  await db.sync();
  await users.create(userInfo.admin);
});
afterAll(async () => {
  await db.drop();
});

describe("Auth Middleware", () => {
  // Mock the express req/res/next that we need for each middleware call
  const req = {};
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res),
    json: jest.fn(() => res),
  };
  const next = jest.fn();

  describe("user authentication", () => {
    // Update for bearer-auth-middleware.test.js
    test("fails a login for a user (admin) with an incorrect token", async () => {
      const req = {
        headers: {
          authorization: "Bearer incorrecttoken",
        },
      };
      const res = {
        status: jest.fn(() => res),
        send: jest.fn(),
      };
      const next = jest.fn();

      await bearer(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Invalid token" })
      );
      expect(res.status).toHaveBeenCalledWith(403); // Expecting a 401 status code
      expect(res.send).toHaveBeenCalled();
    });

    test("logs in a user with a proper token", async () => {
      const user = { username: "admin", password: "password" }; // Include the password or any other required fields
      const token = jwt.sign(user, process.env.SECRET);

      req.headers = {
        authorization: `Bearer ${token}`,
      };

      await bearer(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });
});
