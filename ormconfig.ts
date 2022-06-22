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

console.log('>> env', process.env.NODE_ENV);

const isProd = process.env.NODE_ENV === 'production';
const dir = isProd ? 'dist' : 'src';
const ext = isProd ? 'js' : 'ts';

export default {
  type: 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USER || 'test',
  password: process.env.DB_PASS || 'test',
  database: process.env.DB_NAME || 'test',
  synchronize: true,
  logging: false,
  entities: [`${dir}/entity/**/*.${ext}`],
  migrations: [`${dir}/migration/**/*.${ext}`],
  subscribers: [`${dir}/subscriber/**/*.${ext}`],
  cli: {
    entitiesDir: `${dir}/entity`,
    migrationsDir: `${dir}/migration`,
    subscribersDir: `${dir}/subscriber`,
  },
};
