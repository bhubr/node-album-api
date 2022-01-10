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

describe('post/comments routes', () => {

  describe('create a comment', () => {
    it('fails without auth', async () => {
      return postRequest(
        '/v2/posts/1/comments',
        {
          text: 'This is a comment',
        },
        401
      ).then((res: any) => {
        expect(res.body.message).to.equal('No authorization token was found');
      });
    });

    it('succeeds with auth', async () => {
      const { id: userId1 } = await createAndLoginUser(
        getUserEmail(),
        '12345'
      );
      const { id: userId2, jwt: jwt2 } = await createAndLoginUser(
        getUserEmail(),
        '12345'
      );
      const payload = await getPostPayload(userId1);
      const { id: postId } = await postService.createPost(payload);
      return postRequest(
        `/v2/posts/${postId}/comments`,
        {
          text: 'This is a comment',
        },
        201,
        jwt2
      ).then((res: any) => {
        expect(res.body.text).to.equal('This is a comment');
        expect(res.body.user.id).to.equal(userId2);
        expect(res.body.post.id).to.equal(postId);
      });
    });
  });

});