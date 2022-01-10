import express from 'express';
import jwtMiddleware from '../middlewares/jwt';
import notificationController from '../controllers/notification.controller';

const router = express.Router();

router.get('/', jwtMiddleware, notificationController.findAll);

export default router;
