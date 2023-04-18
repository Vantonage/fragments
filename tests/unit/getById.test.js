const request = require('supertest');

const app = require('../../src/app');

describe('getById /v1/fragments/:_id', () => {
  // 401 error if there is no authorization header
  test('Unauthenticated requests are denied', async () => {
    const res = await request(app).get('/v1/fragments/123');
    expect(res.statusCode).toBe(401);
  });

  // 200 status code if the user is authenticated
  test('Authorized users can request', async () => {
    const res = await request(app).get('/v1/fragments/').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
  });

  //401 status code if the user is unauthorized
  test('Unauthorized users cannot make a request', async () => {
    const res = await request(app).get('/v1/fragments/').auth('user1@email.com', 'password2');
    expect(res.statusCode).toBe(401);
  });

  //404 if fragment does not exist
  test('404 if fragment does not exist', async () => {
    const res = await request(app).get('/v1/fragments/123').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
  }); 

  // Using a valid username/password pair with correct extension
  test('authenticated users get a fragments array', async () => {
    const res = await request(app)
    .post('/v1/fragments')
    .auth('user1@email.com', 'password1')
    .set('Content-Type', 'text/plain')
    .send(data);
    var id = JSON.parse(res.text).fragment.id;
    const getRes = await request(app)
      .get(`/v1/fragments/${id}.html`)
      .auth('user1@email.com', 'password1')
    expect(getRes.statusCode).toBe(200);
    //expect(getRes.text).toBe(data.toString());
  });
});
