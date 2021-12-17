import express from 'express';
import jwtMiddleware from '../middlewares/jwt';
import postController from '../controllers/post.controller';

const router = express.Router();

router.get('/', postController.findAll);

router.get('/:id', postController.findOne);

router.post('/', jwtMiddleware, postController.create);

router.put('/:id/like', jwtMiddleware, postController.like);

router.delete('/:id', jwtMiddleware, postController.delete);

export default router;
