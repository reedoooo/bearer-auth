// Import necessary libraries
const request = require('supertest');
const { server } = require('../src/server'); // path to your server file

describe('Server', () => {

  it('should respond with 404 on an unknown route', async () => {
    // Make a GET request to an unknown route
    const response = await request(server).get('/non-existing-route');

    // Assert that the server responds with a 404 status
    expect(response.status).toBe(404);
  });

  it('should respond with 200 on a known route', async () => {
    // Assuming you have a route handler for '/' in your authRoutes
    const response = await request(server).get('/');

    // Assert that the server responds with a 200 status
    expect(response.status).toBe(200);
  });
});
