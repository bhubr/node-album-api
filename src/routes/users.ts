import express from 'express';
import { body } from 'express-validator';
import userController from '../controllers/user.controller';
import jwtMiddleware from '../middlewares/jwt';

const router = express.Router();

router.put(
  '/me',
  jwtMiddleware,
  body('login').isEmail(),
  body('avatar').custom((value) => {
    const base64Re = /data:image\/([a-zA-Z]*);base64,([^\"]*)/
    return !value || base64Re.test(value);
  }),
  userController.updateProfile
);

export default router;
