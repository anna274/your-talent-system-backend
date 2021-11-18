import { Requirement } from 'models/main';

export const createRequirements = (requirementsData) => {
  return Requirement.bulkCreate(requirementsData);
}

export const deleteRequirementsByPositionId = (positionId) => {
  return Requirement.destroy({ where: { positionId } })
}

