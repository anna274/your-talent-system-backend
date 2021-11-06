import * as dotenv from 'dotenv';
dotenv.config();

const keys = {
  PORT: process.env.PORT,
  REDIS_URL: process.env.REDIS_URL,
  DB: process.env.DB,
  secretOrKey: process.env.SECRET_OR_KEY,
  refreshSecretOrKey: process.env.REFRESH_SECRET_OR_KEY,
  cloudName: process.env.CLOUD_NAME,
  cloudApiKey: process.env.CLOUD_API_KEY,
  cloudApiSecret: process.env.CLOUD_API_SECRET,
};

export { keys };