import { Role } from 'models/main';

export const getSpecialistRole = (): any => {
  return Role.findOne({ where: { name: 'specialist' } });
};