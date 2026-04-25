import dotenv from 'dotenv';

dotenv.config();

export default {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: './src/migrations',
      extension: 'js',
    },
    seeds: {
      directory: './src/seeds',
      extension: 'js',
    },
  },
  production: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: './src/migrations',
      extension: 'js',
    },
    seeds: {
      directory: './src/seeds',
      extension: 'js',
    },
  },
};
