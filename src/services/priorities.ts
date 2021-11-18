import { Priority } from 'models/main';

export const findAll = (): any => {
  return Priority.findAll({ attributes: ["name", "id"] });
};