import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from 'consts';
import { keys } from 'config';

export const decode = async (word) => {
  const salt = await bcrypt.genSalt(10);
  const decodedPassword = await bcrypt.hash(word, salt);
  return decodedPassword;
}

export const isMatch = async (word, decodedWord) => {
  return bcrypt.compare(word, decodedWord);;
}

export const generateToken = ({ id, role }) => {
  return jwt.sign({ id, role }, keys.secretOrKey, {
    expiresIn: TOKEN_EXPIRES_IN,
  });
}

export const generateRefreshToken = ({ id, role }) => {
  return jwt.sign({ id, role }, keys.refreshSecretOrKey, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
};