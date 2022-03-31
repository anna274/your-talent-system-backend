import { Op } from 'sequelize';
import { Technology } from 'models/main';

export const findAll = (): any => {
  return Technology.findAll({ attributes: ["name", "id"] });
};

export const create = async (technologyData) => {
  return Technology.create(technologyData)
};

export const update = async (technologyData) => {
  const { id, ...dataToUpdate } = technologyData;
  return Technology.update(dataToUpdate, { where: id })
};

export const destroy = async (id: string) => {
  return Technology.destroy({ where: { id } });
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