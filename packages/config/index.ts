import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

export const config = {
  // users
  USERS_PATH: process.env.USERS_PATH,
  USERS_PORT: process.env.USERS_PORT,
  SWAGGER_USERS_PATH: process.env.SWAGGER_USERS_PATH,
  USERS_GRPC_HOST: process.env.USERS_GRPC_HOST,
  // notes
  NOTES_PATH: process.env.NOTES_PATH,
  NOTES_PORT: process.env.NOTES_PORT,
  SWAGGER_NOTES_PATH: process.env.SWAGGER_NOTES_PATH,
  NOTES_GRPC_HOST: process.env.NOTES_GRPC_HOST,
  // noti
  NOTI_PORT: process.env.NOTI_PORT,
  NOTI_PATH: process.env.NOTI_PATH,
  SWAGGER_NOTI_PATH: process.env.SWAGGER_NOTI_PATH,
  NOTI_GRPC_HOST: process.env.NOTI_GRPC_HOST,

  AUTHEN_KEY: 'x-api-key',
  // google
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
  RABBIT: {
    HOST: process.env.RABBIT_HOST,
    PORT: process.env.RABBIT_PORT,
    USER: process.env.RABBIT_USER,
    PASSWORD: process.env.RABBIT_PASSWORD,
    URL: process.env.RABBIT_URL,
  },
  PROTO_PATH: {
    USERS: path.join(process.cwd(), '../../packages', 'proto', 'users.proto'),
    NOTES: path.join(process.cwd(), '../../packages', 'proto', 'notes.proto'),
    NOTI: path.join(process.cwd(), '../../packages', 'proto', 'notifications.proto'),
  },
};
