// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');

describe(' app.use 404 middleware test', () => {
  test('should return HTTP 404 response', async () => {
    const res = await request(app).get('/hello');
    expect(res.statusCode).toBe(404);
  });
});
