import { getRepository } from 'typeorm';
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
import { Post } from '../src/entity/Post';

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
    describe('get all posts', async () => {
      it('get posts with tags', async () => {
        const { id: userId1 } = await createAndLoginUser(
          getUserEmail(),
          '12345'
        );
        const { id: userId2 } = await createAndLoginUser(
          getUserEmail(),
          '12345'
        );
        const postPayloads = new Array(30).fill(0)
        .map((_, i) => {
          let userId
          if (i < 10) userId = userId1
          else if (i < 20) userId = userId2
          return getPostPayload(userId);
        })
        const postRepository = getRepository(Post);
        const postsBefore = await postRepository.find();
        await Promise.all(
          postPayloads.map(p => postService.createPost(p))
        )
        
        return getRequest('/v2/posts', 200).then(
          (res: any) => {
            expect(Array.isArray(res.body)).to.equal(true);
            expect(res.body.length).to.equal(30 + postsBefore.length);
          }
        );
      });
    });

    describe('get one post', async () => {
      it('get posts with tags and user', async () => {
        const { id: userId } = await createAndLoginUser(
          getUserEmail(),
          '12345'
        );
        const payload = getPostPayload(userId);
        const p = await postService.createPost(payload)
        
        return getRequest(`/v2/posts/${p.id}`, 200).then(
          (res: any) => {
            expect(Array.isArray(res.body.tags)).to.equal(true);
            expect(res.body.user.id).to.equal(userId);
            expect(res.body.user.password).to.equal(undefined);
          }
        );
      });
    });
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
