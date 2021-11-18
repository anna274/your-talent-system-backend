import { Status } from 'models/main';

export const findAll = (): any => {
  return Status.findAll({ attributes: ["name", "id"] });
};