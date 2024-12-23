import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
    USERS_PATH: process.env.USERS_PATH,
    USERS_PORT: process.env.USERS_PORT,
    SWAGGER_USERS_PATH: process.env.SWAGGER_USERS_PATH,
    GG_ID: process.env.GG_ID,
    GG_KEY: process.env.GG_KEY,
    GG_CALLBACK: process.env.GG_CALLBACK,
    FE_RENDER: process.env.FE_RENDER,
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS: {
        HOST: process.env.REDIS_HOST,
        PORT: process.env.REDIS_PORT,
        PASSWORD: process.env.REDIS_PASSWORD,
        URL: process.env.REDIS_URL,
        DB: process.env.REDIS_DB,
    },
};
