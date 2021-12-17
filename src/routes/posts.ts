import express from 'express';
import postController from '../controllers/post.controller';

const router = express.Router();

router.get('/', postController.findAll);

router.get('/:id', postController.findOne);

router.post('/', postController.create);

router.put('/:id/like', postController.like);

router.delete('/:id', postController.delete);

export default router;
