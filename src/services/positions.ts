import {
  Position,
  JobFunction,
  Technology,
  Level,
  Priority,
  Project,
  Profile,
  Status,
  Requirement,
} from 'models/main';
import { createRequirements, deleteRequirementsByPositionId } from 'services/requirement';

export const findAll = (): any => {
  return Position.findAll({
    include: [
      {
        model: Project,
        attributes: ['id', 'name'],
      },
      {
        model: JobFunction,
        attributes: ['id', 'name'],
      },
      {
        model: Status,
        attributes: ['id', 'name'],
      },
      {
        model: Profile,
      },
      {
        model: Requirement,
        attributes: ['id'],
        include: [
          {
            model: Level,
            attributes: ['id', 'value'],
          },
          {
            model: Technology,
            attributes: ['id', 'name'],
          },
          {
            model: Priority,
            attributes: ['id', 'value', 'name'],
          },
        ],
      },
    ],
  });
};

export const findById = (id: string): any => {
  return Position.findOne({
    where: { id },
    include: [
      {
        model: Project,
        attributes: ['id', 'name'],
      },
      {
        model: JobFunction,
        attributes: ['id', 'name'],
      },
      {
        model: Status,
        attributes: ['id', 'name'],
      },
      {
        model: Profile,
      },
      {
        model: Requirement,
        attributes: ['id'],
        include: [
          {
            model: Level,
            attributes: ['id', 'value'],
          },
          {
            model: Technology,
            attributes: ['id', 'name'],
          },
          {
            model: Priority,
            attributes: ['id', 'value', 'name'],
          },
        ],
      },
    ],
  });
};

export const create = async (positionData) => {
  const { requirements, project, job_function, status, ...restInfo } = positionData;
  const changedRequirements = requirements.map(({ technology, level, priority }) => ({
    technologyId: technology.id,
    levelId: level.id,
    priority: priority.id,
  }));
  return Position.create(
    {
      ...restInfo,
      statusId: status.id,
      projectId: project.id,
      jobFunctionId: job_function.id,
      requirements: changedRequirements,
    },
    { include: [Requirement] }
    //@ts-ignore
  ).then((profile) => findById(profile.id));
};

export const update = async (positionData) => {
  const { id, requirements, project, job_function, status, ...restInfo } = positionData;
  const changedRequirements = requirements.map(({ technology, level, priority }) => ({
    technologyId: technology.id,
    levelId: level.id,
    priority: priority.id,
  }));
  const savedRequirements = await createRequirements(changedRequirements);
  return findById(id)
    .then(async (project) => {
      await project.update({
        ...restInfo,
        statusId: status.id,
        projectId: project.id,
        jobFunctionId: job_function.id,
      });
      await deleteRequirementsByPositionId(id);
      // @ts-ignore
      await project.setRequirements(savedRequirements.map(({id}) => id));
    })
    .then(() => findById(id));
};

export const destroy = async (id: string) => {
  await deleteRequirementsByPositionId(id);
  const profile = await Position.findOne({ where: {id} });
  return profile.destroy();
};
