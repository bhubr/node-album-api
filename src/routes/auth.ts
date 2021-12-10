import express from 'express';

const router = express.Router();

router.get('/user', async (req, res) => {
  const { user } = req;
  res.send(user);
});

export default router;
