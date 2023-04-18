const request = require('supertest');

const app = require('../../src/app');

describe('Delete /fragments/:id', () => {
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

  // 200 status code if the user is authenticated and deletes a user fragment
  test('authenticated users delete a fragment', async () => {
    const res = await request(app)
    .post('/v1/fragments')
    .auth('user1@email.com', 'password1')
    .set('Content-Type', 'text/plain');
    var id = JSON.parse(res.text).fragment.id;
    const re = await request(app)
        .delete(`/v1/fragments/${id}`)
        .auth('user1@email.com', 'password1')
    expect(re.statusCode).toBe(200);
  });

});