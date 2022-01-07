import fs from 'fs';
import { resolve } from 'path';
import { getRepository } from 'typeorm';
import { validationResult } from 'express-validator';

import { User } from '../entity/User';

const translateError = ({ param, ...rest }) => {
  const messages = {
    login: 'login must contain a valid email address',
    avatar: 'avatar must be a base64 image URL (starting with data:image/<format>;base64,)'
  }
  return {
    param,
    ...rest,
    msg: messages[param],
  }
}

export default {
  async updateProfile(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array().map(translateError) });
    }
    try {
      const userId = req?.user?.id;
      const { login, avatar } = req.body;

      const userRepository = getRepository(User);
      const user: User = await userRepository.findOne(userId);
      user.email = login;

      if (avatar) {
        const base64Re = /data:image\/([a-zA-Z]*);base64,([^\"]*)/
        const m = avatar.match(base64Re)
        const ext = m[1];
        const filename = `avatar-${userId}.${ext}`;
        const fullPath = resolve(__dirname, '..', '..', 'public', 'avatars', filename);
        const fileContents = Buffer.from(m[2], 'base64')
        await fs.promises.writeFile(fullPath, fileContents);
        user.avatar = `/avatars/${filename}`;
      }

      await userRepository.save(user);

      res.status(200).send(user);
    } catch (err) {
      console.error('Error while creating post', err.message);
      return res.status(500).json({
        error: err.message,
      });
    }
  },
}
