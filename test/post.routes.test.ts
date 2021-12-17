import { expect } from 'chai';
import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import jwtDecode from 'jwt-decode';

import { User } from '../src/entity/User';
import { Post } from '../src/entity/Post';
import { postRequest, getRequest, createAndLoginUser } from './support/helpers';


describe('post routes', () => {
  describe('v1', () => {
    it('creates a post without auth', () =>
      postRequest('/posts', {
        title: 'W3C', description: 'World Wide Web Consortium (W3C)', picture: 'https://www.w3.org/2008/site/images/logo-w3c-screen-lg',
      }, 201).then((res: any) => {
        expect(res.body.title).to.equal('W3C');
      }));


    it('fails with a string id', () =>
      getRequest('/posts/not-a-string', 400).then((res: any) => {
        // expect(res.body.title).to.equal('W3C');
      }));



    it('fails with a non-existing post id without auth', () =>
    getRequest('/posts/10000', 404).then((res: any) => {
      // expect(res.body.title).to.equal('W3C');
    }));

  });
  describe('v2', () => {
    it('creates a post without auth', async () => {
      const { id, jwt } = await createAndLoginUser('badposter@example.com', '12345');
      return postRequest('/v2/posts', {
        title: 'W3C', description: 'World Wide Web Consortium (W3C)', picture: 'https://www.w3.org/2008/site/images/logo-w3c-screen-lg',
      }, 401).then((res: any) => {
        // expect(res.body.title).to.equal('W3C');
        // expect(res.body.userId).to.equal(id);
      })
    });

    it('creates a post with auth', async () => {
      const { id, jwt } = await createAndLoginUser('poster@example.com', '12345');
      return postRequest('/v2/posts', {
        title: 'W3C', description: 'World Wide Web Consortium (W3C)', picture: 'https://www.w3.org/2008/site/images/logo-w3c-screen-lg',
      }, 201, jwt).then((res: any) => {
        expect(res.body.title).to.equal('W3C');
        expect(res.body.userId).to.equal(id);
      })
    });
  });
});