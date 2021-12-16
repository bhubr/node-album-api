import { expect } from 'chai';
import request from 'supertest';
import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import jwtDecode from 'jwt-decode';

import app from '../src/app';
import { User } from '../src/entity/User';
import { postRequest } from './request-helpers';

const createUser = async (email, clearPassword) => {
  const repository = getRepository(User);
  const password = await hash(clearPassword, 8);
  const user = repository.create({
    email,
    password,
  });
  await repository.save(user);
};

describe('auth routes', () => {
  // Register route
  describe('register', () => {
    it('fails with missing parameters', () =>
      postRequest('/v2/auth/register', {}, 400).then((res: any) => {
        expect(res.body.errors).to.be.a('array');
        expect(res.body.errors.length).to.equal(2);
      }));

    it('fails with an invalid email', () => () =>
      postRequest(
        '/v2/auth/register',
        { login: 'john', pwd: '12345' },
        400
      ).then((res: any) => {
        expect(res.body.errors).to.be.a('array');
        expect(res.body.errors.length).to.equal(1);
      }));

    it('fails with a short password', () =>
      postRequest(
        '/v2/auth/register',
        { login: 'john@example.com', pwd: '123' },
        400
      ).then((res: any) => {
        expect(res.body.errors).to.be.a('array');
        expect(res.body.errors.length).to.equal(1);
      }));

    it('fails with an existing email', async () => {
      await createUser('duplicate@example.com', 'abc12');
      return postRequest(
        '/v2/auth/register',
        { login: 'duplicate@example.com', pwd: 'abc12' },
        409
      );
    });

    it('succeeds with correct parameters', () =>
      postRequest(
        '/v2/auth/register',
        { login: 'will@example.com', pwd: 'abc12' },
        201
      ).then((res: any) => {
        expect(res.body).to.be.a('object');
        expect(Object.keys(res.body).length).to.equal(0);
      }));
  });

  // Login route
  describe('login', () => {
    before(async () => {
      await createUser('rose@example.com', 'abc12');
    });

    it('fails with missing parameters', () =>
      postRequest('/v2/auth/login', {}, 400).then((res: any) => {
        expect(res.body.errors).to.be.a('array');
        expect(res.body.errors.length).to.equal(2);
      }));

    it('fails with an invalid email', () =>
      postRequest('/v2/auth/login', { login: 'john', pwd: '12345' }, 400).then(
        (res: any) => {
          expect(res.body.errors).to.be.a('array');
          expect(res.body.errors.length).to.equal(1);
        }
      ));

    it('fails with a short password', () =>
      postRequest(
        '/v2/auth/login',
        { login: 'john@example.com', pwd: '123' },
        400
      ).then((res: any) => {
        expect(res.body.errors).to.be.a('array');
        expect(res.body.errors.length).to.equal(1);
      }));

    it('fails with non-existing email', () =>
      postRequest(
        '/v2/auth/login',
        { login: 'john@example.com', pwd: 'abc12' },
        401
      ));

    it('fails with incorrect password', () =>
      postRequest(
        '/v2/auth/login',
        { login: 'rose@example.com', pwd: 'zzzzz' },
        401
      ));

    it('succeeds with correct credentials', () =>
      postRequest(
        '/v2/auth/login',
        { login: 'rose@example.com', pwd: 'abc12' },
        200
      ).then((res: any) => {
        const { token } = res.body;
        expect(token).to.be.a('string');
        const { login } = jwtDecode(token) as { login: string };
        expect(login).to.equal('rose@example.com');
      }));
  });
});
