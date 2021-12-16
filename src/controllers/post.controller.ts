import postService from '../services/post.service';

export default {
  async create(req, res) {
    try {
      const userId = req?.user?.id;
      const { title, description, picture, tags } = req.body;
      const post = await postService.createPost({
        userId, title, description, picture, tags
      });
      res.status(201).send(post);
    } catch (err) {
      console.error('Error while creating post', err.message);
      return res.status(500).json({
        error: err.message,
      });
    }
  }
}
