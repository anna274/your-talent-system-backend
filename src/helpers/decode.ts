import * as bcrypt from 'bcryptjs';

export const decode = async (word) => {
  const salt = await bcrypt.genSalt(10);
  const decodedPassword = await bcrypt.hash(word, salt);
  return decodedPassword;
}

export const isMatch = async (word, decodedWord) => {
  return bcrypt.compare(word, decodedWord);;
}