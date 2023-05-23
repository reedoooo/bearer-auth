const request = require('supertest');
const express = require('express');
const logger = require('../../../../src/middleware/logger');

describe('Logger Middleware', () => {
  let app;
  let consoleSpy;

  beforeEach(() => {
    // Create an Express application and add the logger middleware
    app = express();
    app.use(logger);

    // Add a test route
    app.get('/test', (req, res) => {
      res.status(200).send('Test route');
    });

    // Create a spy on console.log
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore the console.log spy
    consoleSpy.mockRestore();
  });

  it('should log the HTTP method and URL of a request', async () => {
    const response = await request(app).get('/test');

    // Assert that the logger called console.log with the correct message
    expect(consoleSpy).toHaveBeenCalledWith('GET /test');
  });
});
