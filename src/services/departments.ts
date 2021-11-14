import { Department } from 'models/main';

export const findAll = (): any => {
  return Department.findAll({ attributes: ["name", "id"] });
};