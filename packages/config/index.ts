import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  USERS_PATH: process.env.USERS_PATH,
  USERS_PORT: process.env.USERS_PORT,
  SWAGGER_USERS_PATH: process.env.SWAGGER_USERS_PATH,
  NOTES_PATH: process.env.NOTES_PATH,
  NOTES_PORT: process.env.NOTES_PORT,
  SWAGGER_NOTES_PATH: process.env.SWAGGER_NOTES_PATH,
  GG_ID: process.env.GG_ID,
  GG_KEY: process.env.GG_KEY,
  GG_CALLBACK: process.env.GG_CALLBACK,
  DOMAIN_FE: process.env.DOMAIN_FE,
  DOMAIN_GG: process.env.DOMAIN_GG,
  DATABASE_URL: process.env.DATABASE_URL,
  API_KEY: process.env.API_KEY,
  REDIS: {
    HOST: process.env.REDIS_HOST,
    PORT: process.env.REDIS_PORT,
    PASSWORD: process.env.REDIS_PASSWORD,
    URL: process.env.REDIS_URL,
    DB: process.env.REDIS_DB,
  },
};
