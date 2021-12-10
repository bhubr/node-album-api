import express from 'express';

import oauthRouter from './oauth';
import authRouter from './auth';
import postsRouter from './posts';
import jwtMiddleware from '../middlewares/jwt'

const router = express.Router();

router.use('/oauth', oauthRouter);
router.use('/auth', jwtMiddleware, authRouter);
router.use('/posts', postsRouter);

export default router;
