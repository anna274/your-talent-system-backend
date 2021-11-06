import { keys } from 'config';
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: keys.cloudName,
  api_key: keys.cloudApiKey,
  api_secret: keys.cloudApiSecret
});

export {cloudinary};