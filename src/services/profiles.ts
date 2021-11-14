import { Profile, Department, JobFunction, Account } from 'models/main';

export const findAll = (): any => {
  return Profile.findAll({
    include: [
      {
        model: Department,
        attributes: ['id', 'name'],
      },
      {
        model: JobFunction,
        attributes: ['id', 'name'],
      },
    ],
  });
};

export const findById = (id: string): any => {
  return Profile.findOne({
    where: { id },
    include: [
      {
        model: Department,
        attributes: ['id', 'name'],
      },
      {
        model: JobFunction,
        attributes: ['id', 'name'],
      },
    ],
  });
};
