import { Duty } from 'models/main';

export const createDuties = (requirementsData) => {
  return Duty.bulkCreate(requirementsData);
}

export const deleteDutiesByPositionId = (positionId) => {
  return Duty.destroy({ where: { positionId } })
}

