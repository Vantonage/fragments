const request = require('supertest');
const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  // 401 error if there is no authorization header
  test('Unauthenticated requests are denied', async () => {
    const res = await request(app).get('/v1/fragments');
    expect(res.statusCode).toBe(401);
  });
  // 200 status code if the user is authenticated
  test('Authorized users can request', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
  });

  //201 created code if user can create a plain text
  test('Authenticated users can create a plain text fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain');
    expect(res.statusCode).toBe(201);
  });
  //201 created code if user can create a plain text
  test('Authenticated users can create a markdown text fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown');
    expect(res.statusCode).toBe(201);
  });

  //201 created code if user can create a plain text
  test('Authenticated users can create an html text fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html');
    expect(res.statusCode).toBe(201);
  });
  //201 created code if user can create a plain text
  test('Authenticated users can create an application json', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(201);
  });
  // 200 status code if the response has a location header
  test('Responses include a location header', async () => {
    const res = await await request(app)
      .get('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Location', 'http:localhost:8080');
    expect(res.statusCode).toBe(200);
  });
  // 415 if the requested media type is unsupported
  test('Trying to create a fragment with an unsupported type errors as expected', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'json/application');
    expect(res.statusCode).toBe(415);
  });
  // checks if there is wanted all the values in the fragment
  test('responses include all necessary and expected properties (id, created, type, etc), and these values match what you expect for a given request (e.g., size, type, ownerId)', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain');
    const body = JSON.parse(res.text);
    expect(Object.keys(body.fragment)).toEqual([
      'id',
      'ownerId',
      'type',
      'created',
      'updated',
      'size',
    ]);
  });
});
