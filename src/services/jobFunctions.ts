import { Op } from 'sequelize';
import { JobFunction } from 'models/main';

export const findAll = (filters = {}): any => {
  const query = buildQuery(filters);
  return JobFunction.findAll({ attributes: ["name", "id"] });
};

export const create = async (jobFunctionData) => {
  return JobFunction.create(jobFunctionData)
};

export const update = async (jobFunctionData) => {
  const { id, ...dataToUpdate } = jobFunctionData;
  return JobFunction.update(dataToUpdate, { where: id })
};

export const destroy = async (id: string) => {
  return JobFunction.destroy({ where: { id } });
};

const buildQuery = (queryParams) => {
  let query = {};
  if(queryParams?.filters?.name) {
    query = {
      ...query,
      name: { [Op.like]: `%${queryParams?.filters?.name}%` }
    }
  }
  return query;
};