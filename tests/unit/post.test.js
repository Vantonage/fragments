const request = require('supertest');

const app = require('../../src/app');
//const logger = require('../../src/logger');

describe('POST /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', async () => {
    const data = Buffer.from('This is fragment');
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .send(data);
    expect(res.statusCode).toBe(401);
  });
  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', async () => {
    const data = Buffer.from('This is fragment');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('invalid@email.com', 'incorrect_password')
      .set('Content-Type', 'text/plain')
      .send(data);
    expect(res.statusCode).toBe(401);
  });
  test('incorrect types are denied', async () => {
    const data = Buffer.from('This is fragment');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'abd/dasda')
      .send(data);
    expect(res.statusCode).toBe(415);
  });
  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users create a plain text fragment', async () => {
    const data = Buffer.from('This is fragment');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    expect(res.statusCode).toBe(201);
    expect(res.text.includes('text/plain'));
  });
});
