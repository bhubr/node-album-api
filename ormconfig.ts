import dotenv from 'dotenv';

dotenv.config();

const obfuscate = (str: string) =>
  typeof str === 'string'
    ? str.slice(0, 3) + '*'.repeat(str.length - 3)
    : 'N/A';

console.log(
  '>> db',
  obfuscate(process.env.DB_HOST),
  obfuscate(process.env.DB_PORT),
  obfuscate(process.env.DB_NAME),
  obfuscate(process.env.DB_USER),
  obfuscate(process.env.DB_PASS),
);

export default {
  type: 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USER || 'test',
  password: process.env.DB_PASS || 'test',
  database: process.env.DB_NAME || 'test',
  synchronize: true,
  logging: false,
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};
