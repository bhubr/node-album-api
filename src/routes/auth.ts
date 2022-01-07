import express from 'express';
import { getRepository } from 'typeorm';
import { body, validationResult } from 'express-validator';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import { User } from '../entity/User';
import jwtMiddleware from '../middlewares/jwt';

const router = express.Router();

router.get('/user', jwtMiddleware, async (req, res) => {
  const { user } = req;
  res.send(user);
});

const errorHelper = (msg: string) => ({
  errors: [
    {
      msg,
    },
  ],
});

const translateError = ({ param, ...rest }) => {
  const messages = {
    login: 'login must contain a valid email address',
    pwd: 'pwd must be a string of at least 5 characters'
  }
  return {
    param,
    ...rest,
    msg: messages[param],
  }
}

router.post(
  '/register',
  // username must be an email
  body('login').isEmail(),
  // password must be at least 5 chars long
  body('pwd').isLength({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array().map(translateError) });
    }

    const { login: email, pwd } = req.body;
    const userRepository = getRepository(User);
    const users = await userRepository.find({ email });
    if (users.length > 0) {
      return res.status(409).send(errorHelper('Email already exists'));
    }
    const password = await hash(pwd, 14);
    const user = userRepository.create({ email, password });
    try {
      await userRepository.save(user);
      return res.status(201).send({});
    } catch (err) {
      return res.status(500).send(errorHelper(err.message));
    }
  }
);

router.post(
  '/login',
  // username must be an email
  body('login').isEmail(),
  // password must be at least 5 chars long
  body('pwd').isLength({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array().map(translateError) });
    }

    const { login: email, pwd: password } = req.body;
    const userRepository = getRepository(User);
    const users = await userRepository.find({ email });
    if (users.length === 0) {
      return res.status(401).send(errorHelper('Invalid credentials'));
    }

    const [user] = users;
    const ok = await compare(password, user.password);
    if (!ok) {
      return res.status(401).send(errorHelper('Invalid credentials'));
    }

    const { id, email: login, avatar } = user;
    const token = await sign({ id, login, avatar }, process.env.JWT_SECRET);

    return res.status(200).send({ token, user: { id, login, avatar } });
  }
);

export default router;
