import { expect } from 'chai';
import request from 'supertest';
import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import jwtDecode from 'jwt-decode';

import app from '../src/app';
import { User } from '../src/entity/User';

const createUser = async (email, clearPassword) => {
  const repository = getRepository(User);
  const password = await hash(clearPassword, 8);
  const user = repository.create({
    email,
    password
  });
  await repository.save(user);
};

describe('auth routes', () => {

  // Register route
  describe('register', () => {
    it('fails with missing parameters', () => request(app)
      .post('/api/v2/auth/register')
      .send({})
      .set('Accept', 'application/json')
      .expect(400)
      .expect('Content-Type', /json/)
      .then((res: any) => {
        expect(res.body.errors).to.be.a('array');
        expect(res.body.errors.length).to.equal(2);
      })
    );

    it('fails with an invalid email', () => request(app)
      .post('/api/v2/auth/register')
      .send({ login: 'john', pwd: '12345' })
      .set('Accept', 'application/json')
      .expect(400)
      .expect('Content-Type', /json/)
      .then((res: any) => {
        expect(res.body.errors).to.be.a('array');
        expect(res.body.errors.length).to.equal(1);
      })
    );

    it('fails with a short password', () => request(app)
      .post('/api/v2/auth/register')
      .send({ login: 'john@example.com', pwd: '123' })
      .set('Accept', 'application/json')
      .expect(400)
      .expect('Content-Type', /json/)
      .then((res: any) => {
        expect(res.body.errors).to.be.a('array');
        expect(res.body.errors.length).to.equal(1);
      })
    );

    it('fails with an existing email', async () => {
      await createUser('duplicate@example.com', 'abc12');
      return request(app)
        .post('/api/v2/auth/register')
        .send({ login: 'duplicate@example.com', pwd: 'abc12' })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(409)
      }
    );

    it('succeeds with correct parameters', () => request(app)
      .post('/api/v2/auth/register')
      .send({ login: 'will@example.com', pwd: 'abc12' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .then((res: any) => {
        expect(res.body).to.be.a('object');
        expect(Object.keys(res.body).length).to.equal(0);
      })
    );
  });

  // Login route
  describe('login', () => {
    before(async () => {
      await createUser('rose@example.com', 'abc12');
    });

    it('fails with missing parameters', () => request(app)
      .post('/api/v2/auth/login')
      .send({})
      .set('Accept', 'application/json')
      .expect(400)
      .expect('Content-Type', /json/)
      .then((res: any) => {
        expect(res.body.errors).to.be.a('array');
        expect(res.body.errors.length).to.equal(2);
      })
    );

    it('fails with an invalid email', () => request(app)
      .post('/api/v2/auth/login')
      .send({ login: 'john', pwd: '12345' })
      .set('Accept', 'application/json')
      .expect(400)
      .expect('Content-Type', /json/)
      .then((res: any) => {
        expect(res.body.errors).to.be.a('array');
        expect(res.body.errors.length).to.equal(1);
      })
    );

    it('fails with a short password', () => request(app)
      .post('/api/v2/auth/login')
      .send({ login: 'john@example.com', pwd: '123' })
      .set('Accept', 'application/json')
      .expect(400)
      .expect('Content-Type', /json/)
      .then((res: any) => {
        expect(res.body.errors).to.be.a('array');
        expect(res.body.errors.length).to.equal(1);
      })
    );

    it('fails with non-existing email', () => request(app)
      .post('/api/v2/auth/login')
      .send({ login: 'john@example.com', pwd: 'abc12' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
    );

    it('fails with incorrect password', () => request(app)
      .post('/api/v2/auth/login')
      .send({ login: 'rose@example.com', pwd: 'zzzzz' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
    );

    it('succeeds with correct credentials', () => request(app)
      .post('/api/v2/auth/login')
      .send({ login: 'rose@example.com', pwd: 'abc12' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res: any) => {
        const { token } = res.body
        expect(token).to.be.a('string');
        const { login } = (jwtDecode(token) as { login: string });
        expect(login).to.equal('rose@example.com');
      })
    );
  });
});
