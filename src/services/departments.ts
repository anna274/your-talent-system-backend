import { Department } from 'models/main';
import { Op } from 'sequelize';

export const findAll = (filters = {}): any => {
  const query = buildQuery(filters);
  return Department.findAll({ where: query, attributes: ["name", "id"] });
};

export const create = async (departmentData) => {
  return Department.create(departmentData)
};

export const update = async (departmentData) => {
  const { id, ...dataToUpdate } = departmentData;
  return Department.update(dataToUpdate, { where: id })
};

export const destroy = async (id: string) => {
  return Department.destroy({ where: { id } });
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
