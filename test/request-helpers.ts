import request from 'supertest';

import app from '../src/app';

export const postRequest = (path: string, data: any, expectedCode: number) => request(app)
  .post(`/api${path}`)
  .send(data)
  .set('Accept', 'application/json')
  .expect(expectedCode)
  .expect('Content-Type', /json/)
