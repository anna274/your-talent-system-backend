import {
  Position,
  JobFunction,
  Technology,
  Level,
  Priority,
  Project,
  Profile,
  Requirement,
  Duty,
} from 'models/main';
import {
  createRequirements,
  deleteRequirementsByPositionId,
} from 'services/requirement';
import { createDuties, deleteDutiesByPositionId } from 'services/duties';

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
        model: Duty,
        attributes: ['id', 'text'],
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
        model: Profile,
      },
      {
        model: Duty,
        attributes: ['id', 'text'],
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
  const { requirements, project, job_function, ...restInfo } = positionData;
  const changedRequirements = requirements.map(
    ({ technology, level, priority }) => ({
      technologyId: technology.id,
      levelId: level.id,
      priorityId: priority.id,
    })
  );

  return Position.create(
    {
      ...restInfo,
      projectId: project.id,
      jobFunctionId: job_function.id,
      requirements: changedRequirements,
    },
    { include: [Requirement, Duty] }
    //@ts-ignore
  ).then((profile) => findById(profile.id));
};

export const update = async (positionData) => {
  const { id, requirements, project, duties, job_function, ...restInfo } = positionData;
  const changedRequirements = requirements.map(
    ({ technology, level, priority }) => ({
      technologyId: technology.id,
      levelId: level.id,
      priorityId: priority.id,
      positionId: id,
    })
  );
  const changedDuties = duties.map(({ text }) => ({
    text,
    positionId: id,
  }));
  await deleteDutiesByPositionId(id);
  await deleteRequirementsByPositionId(id);
  await createRequirements(changedRequirements);
  await createDuties(changedDuties);
  return findById(id)
    .then(async (position) => {
      await position.update({
        ...restInfo,
        projectId: project.id,
        jobFunctionId: job_function.id,
      });
    })
    .then(() => findById(id));
};

export const destroy = async (id: string) => {
  const profile = await Position.findOne({ where: { id } });
  return profile.destroy();
};
