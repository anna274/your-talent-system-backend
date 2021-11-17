import { Level } from 'models/main';

export const findAll = (): any => {
  return Level.findAll({ attributes: ["value", "id"] });
};