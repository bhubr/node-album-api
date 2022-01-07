import { expect } from 'chai';
import { resolve } from 'path';
import {
  postRequest,
  getRequest,
  putRequest,
  deleteRequest,
  createUser,
  createAndLoginUser,
  getPostPayload,
  getUserEmail,
  fileExists,
} from './support/helpers';
import postService from '../src/services/post.service';

describe('user routes', () => {
  describe('v2', () => {
    describe('update profile', () => {
      it('fails without auth', async () => {
        return putRequest(
          '/v2/users/me',
          {
            login: 'updated01@example.com'
          },
          401
        ).then((res: any) => {
          expect(res.body.message).to.equal('No authorization token was found');
        });
      });

      it('fails with auth but invalid login (email)', async () => {
        const { id, jwt } = await createAndLoginUser(getUserEmail(), '12345');
        return putRequest(
          '/v2/users/me',
          {
            login: 'updated01'
          },
          400,
          jwt
        );
      });

      it('fails with auth but invalid avatar (not base64)', async () => {
        const { id, jwt } = await createAndLoginUser(getUserEmail(), '12345');
        return putRequest(
          '/v2/users/me',
          {
            login: 'updated01@example.com',
            avatar: 'not-base64'
          },
          400,
          jwt
        );
      });

      it('succeeds with auth - email only', async () => {
        const { id, jwt } = await createAndLoginUser(getUserEmail(), '12345');
        return putRequest(
          '/v2/users/me',
          {
            login: 'updated01@example.com'
          },
          200,
          jwt
        ).then((res: any) => {
          expect(res.body.email).to.equal('updated01@example.com');
        });
      });

      it('succeeds with auth - email and avatar', async () => {
        const { id, jwt } = await createAndLoginUser(getUserEmail(), '12345');
        const avatarFilename = `avatar-${id}.png`;
        const fullPath = resolve(__dirname, '..', 'public', 'avatars', avatarFilename);
        return putRequest(
          '/v2/users/me',
          {
            login: 'updated02@example.com',
            avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII'
          },
          200,
          jwt
        ).then(async (res: any) => {
          expect(res.body.email).to.equal('updated02@example.com');
          expect(res.body.avatar).to.equal('/avatars/avatar-13.png');
          expect(res.body.password).to.equal(undefined);
          expect(await fileExists(fullPath)).to.equal(true);
        });
      });
    });
  });
});
