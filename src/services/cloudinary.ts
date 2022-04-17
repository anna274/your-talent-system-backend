import {cloudinary} from 'config'

function uploadImage(image) {
  return cloudinary.uploader.upload(image);
}

export { uploadImage };
