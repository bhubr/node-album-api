import slug from 'slug';
import { getRepository } from 'typeorm';
import { Post } from '../entity/Post';
import { Tag } from '../entity/Tag';

export default {
  async createPost({ userId, title, description, picture, tags }): Promise<Post> {
    let allTagRecords;
    if (tags) {
      const tagRepository = getRepository(Tag);
      const splitTags = tags.split(',');
      const tagRecords = await tagRepository.createQueryBuilder("tag")
        .where("tag.title IN (:tags)", { tags: splitTags })
        .getMany();

      const tagsToAdd = splitTags.filter(title => !tagRecords.find(record => record.title === title));
      const newTags = tagsToAdd.map(title => tagRepository.create({
        title, slug: slug(title)
      }));
      const newTagRecords = await Promise.all(newTags.map(t => tagRepository.save(t)));
      allTagRecords = [...tagRecords, ...newTagRecords];
    }

    const postRepository = getRepository(Post);
    const postSlug = slug(title);
    const post = postRepository.create({
      title,
      description,
      picture,
      slug: postSlug,
    });
    if (allTagRecords) {
      post.tags = allTagRecords;
    }
    await postRepository.save(post);
    return post;
  }
}

    