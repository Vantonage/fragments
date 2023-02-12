// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');

describe(' app.use 404 middleware test', () => {
  test('should return HTTP 404 response', async () => {
    const res = await request(app).get('/hello');
    expect(res.statusCode).toBe(404);
  });

  test('should return HTTP 500 for an internal server error', () =>
    request(app).post('/v1/fragments').auth('user1@email.com', 'password1').expect(500));

  test('should return HTTP 401 for unauthorized', () => request(app).post('%').expect(400));

});
