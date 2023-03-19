const request = require('supertest');

const app = require('../../src/app');

describe('getByIdInfo /v1/fragments/:_id/info', () => {
  // 401 error if there is no authorization header
  test('Unauthenticated requests are denied', async () => {
    const res = await request(app).get('/v1/fragments/123/info');
    expect(res.statusCode).toBe(401);
  });

  // 200 status code if the user is authenticated and is requesting info
  test('Authorized users can request info', async () => {
    const res = await request(app).post('/v1/fragments/').auth('user1@email.com', 'password1').set('Content-Type', 'text/plain').send('This is a fragments');
    const id = JSON.parse(res.text).fragment.id;
    const getFragmentInfo = await request(app).get(`/v1/fragments/${id}/info`).auth('user1@email.com', 'password1');
    expect(getFragmentInfo.statusCode).toBe(200);
  });

  //401 status code if the user is unauthorized
  test('Unauthorized users cannot make a request', async () => {
    const res = await request(app).get('/v1/fragments/123/info').auth('user1@email.com', 'password2');
    expect(res.statusCode).toBe(401);
  });

  //404 if fragment does not exist
  test('404 if fragment does not exist', async () => {
    const res = await request(app).get('/v1/fragments/123').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
  }); 
});
