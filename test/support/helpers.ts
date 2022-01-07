import request from 'supertest';
import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { stat } from 'fs/promises';

import app from '../../src/app';
import { User } from '../../src/entity/User';

// So much duplication in here! Bad Dobby!

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

export const putRequest = (path: string, data: any, expectedCode: number, token?: string) => {
  const p = request(app)
    .put(`/api${path}`)
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

export const deleteRequest = (path: string, expectedCode: number, token?: string) => {
  const p = request(app)
    .delete(`/api${path}`)
    .set('Accept', 'application/json')

  if (token) {
    p.set('Authorization', `Bearer ${token}`);
  }

  return p
    .expect(expectedCode);
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

// export const createPost = async ({ title, description, picture }): Promise<Post> => {
//   const repository = getRepository(Post);
//   const post = repository.create({
//     title, description, picture
//   });
//   return repository.save(post);
// };

export const getPostPayload = async (userId: number) => ({
  userId,
  title: `Test ${Math.random()}`,
  description: 'Test post',
  picture: 'https://i.imgur.com/gzurlSO.jpeg',
  tags: 'test'
});

export const getUserEmail = (() => {
  let nextId = 1;
  return () => {
    const idStr = nextId.toString().padStart(3, '0');
    nextId++;
    return `user${idStr}@example.com`;
  }
})();

export const fileExists = (filename) => stat(filename)
  .then(() => true)
  .catch(() => false)