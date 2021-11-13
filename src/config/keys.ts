import * as dotenv from 'dotenv';
dotenv.config();
// require('dotenv').config()

export const keys = {
  PORT: process.env.PORT,
  REDIS_URL: process.env.REDIS_URL,
  secretOrKey: process.env.SECRET_OR_KEY,
  refreshSecretOrKey: process.env.REFRESH_SECRET_OR_KEY,
  cloudName: process.env.CLOUD_NAME,
  cloudApiKey: process.env.CLOUD_API_KEY,
  cloudApiSecret: process.env.CLOUD_API_SECRET,
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
};
