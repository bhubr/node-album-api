import { expect } from 'chai';
import {
  postRequest,
  getRequest,
  deleteRequest,
  createUser,
  createAndLoginUser,
  getPostPayload,
  getUserEmail,
} from './support/helpers';
import postService from '../src/services/post.service';

describe('post routes', () => {
  describe('v1', () => {
    it('creates a post without auth', () =>
      postRequest(
        '/posts',
        {
          title: 'W3C',
          description: 'World Wide Web Consortium (W3C)',
          picture: 'https://www.w3.org/2008/site/images/logo-w3c-screen-lg',
        },
        201
      ).then((res: any) => {
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
    describe('create a post', () => {
      it('fails without auth', async () => {
        return postRequest(
          '/v2/posts',
          {
            title: 'W3C',
            description: 'World Wide Web Consortium (W3C)',
            picture: 'https://www.w3.org/2008/site/images/logo-w3c-screen-lg',
          },
          401
        ).then((res: any) => {
          expect(res.body.message).to.equal('No authorization token was found');
        });
      });

      it('succeeds with auth', async () => {
        const { id, jwt } = await createAndLoginUser(getUserEmail(), '12345');
        return postRequest(
          '/v2/posts',
          {
            title: 'W3C',
            description: 'World Wide Web Consortium (W3C)',
            picture: 'https://www.w3.org/2008/site/images/logo-w3c-screen-lg',
          },
          201,
          jwt
        ).then((res: any) => {
          expect(res.body.title).to.equal('W3C');
          expect(res.body.userId).to.equal(id);
        });
      });
    });

    describe('delete a post', async () => {
      it('fails without auth', async () => {
        const { id: userId } = await createUser(getUserEmail(), '12345');
        const payload = await getPostPayload(userId);
        const { id: postId } = await postService.createPost(payload);

        return deleteRequest(`/v2/posts/${postId}`, 401).then((res: any) => {
          expect(res.body.message).to.equal('No authorization token was found');
        });
      });

      it('fails if deleter is not owner', async () => {
        const { id: userId1 } = await createAndLoginUser(
          getUserEmail(),
          '12345'
        );
        const { jwt: jwt2 } = await createAndLoginUser(
          getUserEmail(),
          '12345'
        );
        const payload = await getPostPayload(userId1);
        const { id: postId } = await postService.createPost(payload);
        return deleteRequest(`/v2/posts/${postId}`, 403, jwt2).then(
          (res: any) => {
            expect(res.body.error).to.equal('This post belongs to another user');
          }
        );
      });

      it('fails with non-existing post', async () => {
        const { jwt } = await createAndLoginUser(
          getUserEmail(),
          '12345'
        );
        return deleteRequest('/v2/posts/9999999', 404, jwt).then(
          (res: any) => {
            expect(res.body.error).to.equal('post with id 9999999 not found');
          }
        );
      });

      it('succeeds with auth', async () => {
        const { id: userId, jwt } = await createAndLoginUser(
          getUserEmail(),
          '12345'
        );
        const payload = await getPostPayload(userId);
        const { id: postId } = await postService.createPost(payload);
        return deleteRequest(`/v2/posts/${postId}`, 204, jwt).then(
          (res: any) => {
            expect(Object.keys(res.body).length).to.equal(0);
          }
        );
      });
    });
  });
});
