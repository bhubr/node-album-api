import { getConnection, getRepository } from 'typeorm';
import { initializeConnection } from '../src/app';
import { User } from '../src/entity/User';
import { Post } from '../src/entity/Post';
import { Tag } from '../src/entity/Tag';

export async function mochaGlobalSetup() {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('** Run tests with NODE_ENV=test');
  }
  const connection = await initializeConnection();

  await connection.query('SET foreign_key_checks = 0');
  const userRepository = getRepository(User);
  await userRepository.clear();
  const postRepository = getRepository(Post);
  await postRepository.clear();
  const tagRepository = getRepository(Tag);
  await tagRepository.clear();
  await connection.query('SET foreign_key_checks = 1');
};

export async function mochaGlobalTeardown() {
  console.log('Mocha Teardown >> Closing connection');
  const connection = await getConnection();
  await connection.close();
};