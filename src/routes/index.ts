import express from 'express';

import oauthRouter from './oauth';
import authRouter from './auth';
import postsRouter from './posts';

const router = express.Router();

router.use('/oauth', oauthRouter);
router.use('/v2/auth', authRouter);
router.use('/posts', postsRouter);

export default router;
