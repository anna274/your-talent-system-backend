import { StatisticsType } from 'models/main';

export const findAll = (): any => {
  return StatisticsType.findAll({ attributes: ["name", "id"] });
};