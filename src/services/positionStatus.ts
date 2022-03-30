import { PositionStatus } from 'models/main';

export const findAll = (): any => {
  return PositionStatus.findAll({ attributes: ["label", "value", "id"] });
};

export const findByValue = (value: string): any => {
  return PositionStatus.findOne({ where: { value } });
};