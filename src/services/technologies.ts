import { Op } from 'sequelize';
import { Technology } from 'models/main';

export const findAll = (filters: any = {}): any => {
  const query = buildQuery(filters)
  return Technology.findAll({ where: query, attributes: ["name", "id"], order: [['updatedAt', 'DESC']], });
};

export const findById = (id: string): any => {
  return Technology.findOne({ where: {id}, attributes: ["name", "id"] });
};

export const create = async (technologyData) => {
  return Technology.create(technologyData)
};

export const update = async (technologyData) => {
  const { id, ...dataToUpdate } = technologyData;
  return Technology.update(dataToUpdate, { where: {id} })
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