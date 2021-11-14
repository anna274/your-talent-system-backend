import { JobFunction } from 'models/main';

export const findAll = (): any => {
  return JobFunction.findAll({ attributes: ["name", "id"] });
};