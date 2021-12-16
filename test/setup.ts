import { getConnection } from 'typeorm';
import { initializeConnection } from '../src/app';

let connection;
export async function mochaGlobalSetup() {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('** Run tests with NODE_ENV=test');
  }
  await initializeConnection();
};

export async function mochaGlobalTeardown() {
  console.log('Mocha Teardown >> Closing connection');
  const connection = await getConnection();
  await connection.close();
};