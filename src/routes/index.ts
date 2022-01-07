import express from 'express';

import oauthRouter from './oauth';
import authRouter from './auth';
import postsRouter from './posts';
import usersRouter from './users';
import protectedPostsRouter from './posts-protected';

const router = express.Router();

router.use('/oauth', oauthRouter);
router.use('/v2/auth', authRouter);
router.use('/posts', postsRouter);
router.use('/v2/posts', protectedPostsRouter);
router.use('/v2/users', usersRouter);

export default router;
