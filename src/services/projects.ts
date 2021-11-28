import { Op } from 'sequelize';
import { Project, Scope, Technology, Position } from 'models/main';

export const findAll = (filters): any => {
  const query = buildQuery(filters);
  const scopesQuery = buildScopesQuery(filters);
  return Project.findAll({
    where: query,
    include: [
      {
        model: Scope,
        attributes: ['id', 'name'],
        through: {
          attributes: [],
        },
        where: scopesQuery
      },
      {
        model: Technology,
        attributes: ['id', 'name'],
        through: {
          attributes: [],
        },
      },
      {
        model: Position,
        attributes: ['id'],
      },
    ],
  });
};

export const findById = (id: string) => {
  return Project.findOne({
    where: { id },
    include: [
      {
        model: Scope,
        attributes: ['id', 'name'],
        through: {
          attributes: [],
        },
      },
      {
        model: Technology,
        attributes: ['id', 'name'],
        through: {
          attributes: [],
        },
      },
      {
        model: Position,
        attributes: ['id'],
      },
    ],
  });
};

export const create = async (projectData) => {
  const { technologies, scopes, ...dataToSave } = projectData;
  return (
    Project.create(dataToSave)
      .then(async (project) => {
        // @ts-ignore
        await project.setScopes(scopes.map(({ id }) => id));
        // @ts-ignore
        await project.setTechnologies(technologies.map(({ id }) => id));
        return project;
      })
      // @ts-ignore
      .then((project) => findById(project.id))
  );
};

export const update = async (projectData) => {
  const { id, technologies, scopes, ...dataToUpdate } = projectData;
  return findById(id)
    .then(async (project) => {
      await project.update(dataToUpdate);
      // @ts-ignore
      await project.setScopes(scopes.map(({ id }) => id));
      // @ts-ignore
      await project.setTechnologies(technologies.map(({ id }) => id));
    })
    .then(() => findById(id));
};

export const destroy = async (id: string) => {
  return Project.destroy({ where: { id } });
};

const buildQuery = (queryParams) => {
  let query = {};
  if (queryParams?.filters?.isOpen === 'true' || queryParams?.filters?.isOpen === 'false') {
    query = {
      ...query,
      endDate: queryParams?.filters?.isOpen === 'true'
        ? { [Op.is]: null }
        : { [Op.not]: null },
    };
  }
  if(queryParams?.filters?.name) {
    query = {
      ...query,
      name: { [Op.like]: `%${queryParams?.filters?.name}%` }
    }
  }
  return query;
};

const buildScopesQuery = (queryParams) => {
  let query = {};
  if(queryParams?.filters?.scopes) {
    const scopeIds = JSON.parse(queryParams?.filters?.scopes);
    query = {
      ...query,
      id: { [Op.in]: scopeIds }
    }
  }
  return query;
};
