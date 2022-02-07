import express from 'express';
import { body } from 'express-validator';

import postController from '../controllers/post.controller';

const router = express.Router();

router.get('/', postController.findAll);

router.get('/:id', postController.findOne);

router.post(
  '/',
  body('title').isString().notEmpty(),
  body('description').isString(),
  body('picture').isString().notEmpty(),
  postController.create
);

router.put('/:id/like', postController.like);

router.delete('/:id', postController.delete);

export default router;
