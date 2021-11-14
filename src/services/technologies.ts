import { Technology } from 'models/main';

export const findAll = (): any => {
  return Technology.findAll({ attributes: ["name", "id"] });
};