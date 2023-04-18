const request = require('supertest');

const app = require('../../src/app');

describe('PUT /v1/fragments', () => {
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

    // 201 status code if the user is authenticated and updates fragment
    test('authenticated users can update fragment', async () => {
        const data = Buffer.from("This is a fragment");
        const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send(data);
        var id = JSON.parse(res.text).fragment.id;
        const data2 = Buffer.from("Updated");
        const re = await request(app)
            .put(`/v1/fragments/${id}`)
            .auth('user1@email.com', 'password1')
            .set('content-type', 'text/plain')
            .send(data2);
        expect(re.statusCode).toBe(201);
    });

    // 400 status code if the user is authenticated and updates fragment to wrong content type
    test('authenticated users can update fragment but error if wrong type', async () => {
        const data = Buffer.from("This is a fragment");
        const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send(data);
        var id = JSON.parse(res.text).fragment.id;
        const data2 = Buffer.from("Updated");
        const re = await request(app)
            .put(`/v1/fragments/${id}`)
            .auth('user1@email.com', 'password1')
            .set('Content-type', 'application/json')
            .send(data2);
        expect(re.statusCode).toBe(400);
        });

    // 404 status code if the user is authenticated and updates nonexisting fragment
    test('authenticated users can update fragment but error if fragment does not exist', async () => {
        const data2 = Buffer.from("Updated");
        const re = await request(app)
            .put(`/v1/fragments/123`)
            .auth('user1@email.com', 'password1')
            .set('Content-type', 'text/plain')
            .send(data2);
        expect(re.statusCode).toBe(404);
    });


});