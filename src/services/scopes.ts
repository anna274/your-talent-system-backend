import { Scope } from 'models/main';

export const findAll = (): any => {
  return Scope.findAll({ attributes: ["name", "id"] });
};