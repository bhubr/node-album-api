import request from 'supertest';
import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import app from '../../src/app';
import { User } from '../../src/entity/User';

export const postRequest = (path: string, data: any, expectedCode: number, token?: string) => {
  const p = request(app)
    .post(`/api${path}`)
    .send(data)
    .set('Accept', 'application/json')

  if (token) {
    p.set('Authorization', `Bearer ${token}`);
  }

  return p
    .expect(expectedCode)
    .expect('Content-Type', /json/);
}

export const getRequest = (path: string, expectedCode: number, token?: string) => {
  const p = request(app)
    .get(`/api${path}`)
    .set('Accept', 'application/json')

  if (token) {
    p.set('Authorization', `Bearer ${token}`);
  }

  return p
    .expect(expectedCode)
    .expect('Content-Type', /json/);
}

export const createUser = async (email, clearPassword): Promise<User> => {
  const repository = getRepository(User);
  const password = await hash(clearPassword, 8);
  const user = repository.create({
    email,
    password,
  });
  return repository.save(user);
};

interface IdToken {
  id: number;
  jwt: string;
}

export const createAndLoginUser = async (email, clearPassword): Promise<IdToken> => {
  const { id } = await createUser(email, clearPassword);
  const jwt = await sign({ id, login: email }, process.env.JWT_SECRET);
  return { id, jwt };
}