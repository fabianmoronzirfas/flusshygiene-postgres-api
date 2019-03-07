
import routes from '../src/lib/routes';
import request from 'supertest';
import express from 'express';
jest.useFakeTimers();

const app = express();
app.use('/api/v1/', routes);

describe('default testing get requests', () => {
  test('route read/:id', async () => {
    expect.assertions(2);
    const response = await request(app).get('/api/v1/read/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual("");
  });
});
describe('default testing post requests', () => {
  test('route write', async () => {
    expect.assertions(2);
    const response = await request(app).post('/api/v1/write').send({});
    expect(response.status).toBe(201);
    expect(response.body).toEqual({success: true});
  });
});
