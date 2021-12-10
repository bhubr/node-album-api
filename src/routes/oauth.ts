import express from 'express';
import { getRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { User } from '../entity/User';
import getAccessToken from '../helpers/get-access-token';
import getGitHubUser from '../helpers/get-github-user';

const router = express.Router();

router.post('/token', async (req, res) => {
  const { code } = req.body;
  try {
    const data = await getAccessToken(code);
    const accessToken = data.get('access_token');
    const gitHubUser = await getGitHubUser(accessToken);
    const userRepository = getRepository(User);
    const users: User[] = await userRepository.find({ githubId: gitHubUser.githubId });
    let user: User;
    if (!users.length) {
      user = await userRepository.create({ ...gitHubUser });
    } else {
      user = users[0];
    }
    const jwtSecret = process.env.JWT_SECRET;
    const { id, name, login, avatarUrl } = user;
    const jwtPayload = { id, name, login, avatarUrl };
    const jwt = await sign(jwtPayload, jwtSecret);
    const isProd = process.env.NODE_ENV === 'production';
    return res
      .cookie('jwt', jwt, { maxAge: 4 * 3600 * 1000, secure: isProd })
      .json(user);
  } catch (err) {
    console.error('Error while requesting a token', err.response.status);
    return res.status(500).json({
      error: err.message,
    });
  }
});

export default router;
