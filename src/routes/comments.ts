import express from 'express';
import jwtMiddleware from '../middlewares/jwt';
import commentController from '../controllers/comment.controller';

const router = express.Router();

router.get('/:postId/comments', commentController.findAll);

router.post('/:postId/comments', jwtMiddleware, commentController.create);

router.delete('/:postId/comments/:commentId', jwtMiddleware, commentController.delete);

export default router;
