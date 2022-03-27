import { Op } from 'sequelize';
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
  Candidate,
  Skill,
  Department,
} from 'models/main';
import {
  createRequirements,
  deleteRequirementsByPositionId,
} from 'services/requirement';
import { createDuties, deleteDutiesByPositionId } from 'services/duties';
import {
  findProfilesByJobFunction,
  findById as findProfileById,
} from 'services/profiles';
import {
  calculateThresholds,
  calculateMaxInterval,
  calculateInterval,
  sortCandidatesByKoef,
} from 'helpers/positions';

export const findAll = (filters): any => {
  const query = buildQuery(filters);
  const jobFunctionsQuery = buildJobFunctionsQuery(filters);
  const projectsQuery = buildProjectsQuery(filters);
  const requirementsQuery = buildRequirementQuery(filters);
  return Position.findAll({
    where: query,
    include: [
      {
        model: Project,
        attributes: ['id', 'name'],
        where: projectsQuery,
      },
      {
        model: JobFunction,
        attributes: ['id', 'name'],
        where: jobFunctionsQuery,
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
        where: requirementsQuery,
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
    order: [['updatedAt', 'DESC']]
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
        include: [
          {
            model: Skill,
            attributes: ['id'],
            include: [
              {
                model: Technology,
                attributes: ['id', 'name'],
              },
              {
                model: Level,
                attributes: ['id', 'value'],
              },
            ],
          },
          {
            model: Department,
            attributes: ['id', 'name'],
          },
        ],
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
            attributes: ['id', 'value', 'name', 'deviation'],
          },
        ],
      },
    ],
  });
};

export const findOneWithProfile = async (id) => {
  const { dataValues: position } = await findById(id);
  if (!position.profileId) {
    return position;
  }
  const { dataValues: profile } = await findProfileById(position.profileId);
  return { ...position, profile };
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
  ).then((profile) => findOneWithProfile(profile.id));
};

export const update = async (positionData) => {
  const { id, requirements, project, duties, job_function, ...restInfo } =
    positionData;
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
    .then(() => findOneWithProfile(id));
};

export const destroy = async (id: string) => {
  const profile = await Position.findOne({ where: { id } });
  return profile.destroy();
};

export const generateCandidates = async (positionId: string) => {
  const { dataValues: position } = await findById(positionId);
  const possibleCandidates = await findProfilesByJobFunction(
    position.jobFunctionId
  );
  const requirementsThresholds = calculateThresholds(position);

  let maxInterval = calculateMaxInterval(requirementsThresholds);
  const intervals = possibleCandidates.map((possibleCandidate) =>
    calculateInterval(requirementsThresholds, possibleCandidate)
  );
  const candidates = possibleCandidates.map((possibleCandidate, i) => {
    const koef = 1 - (maxInterval !== 0 ? intervals[i] / maxInterval : 1);
    return { profile: possibleCandidate, koef, positionId: position.id };
  });
  return sortCandidatesByKoef(
    candidates.filter((candidate) => candidate.koef > 0)
  );
};

export const addToCandidates = async (positionId, profileId, koef) => {
  await Candidate.create({ positionId, profileId, koef });
  return findOneWithProfile(positionId);
};

export const removeFromCandidates = async (positionId, profileId) => {
  await Candidate.destroy({ where: { profileId, positionId } });
  return findOneWithProfile(positionId);
};

export const setProfile = async (positionId, profileId) => {
  await Candidate.destroy({ where: { positionId } });
  await Position.update(
    { profileId, isOpen: false, closeDate: new Date() },
    { where: { id: positionId } }
  );
  return findOneWithProfile(positionId);
};

const buildQuery = (queryParams) => {
  let query = {};
  if (
    queryParams?.filters?.isOpen === 'true' ||
    queryParams?.filters?.isOpen === 'false'
  ) {
    query = {
      ...query,
      isOpen:
        queryParams?.filters?.isOpen === 'true'
          ? { [Op.is]: true }
          : { [Op.is]: false },
    };
  }
  if (queryParams?.filters?.applicationDate) {
    query = {
      ...query,
      applicationDate: {
        [Op.between]: [
          queryParams?.filters?.applicationDate.from,
          queryParams?.filters?.applicationDate.to,
        ],
      },
    };
  }
  return query;
};

const buildJobFunctionsQuery = (queryParams) => {
  let query = {};
  if (queryParams?.filters?.jobFunctions) {
    const jobFunctionsIds = JSON.parse(queryParams?.filters?.jobFunctions);
    query = {
      ...query,
      id: { [Op.in]: jobFunctionsIds },
    };
  }
  return query;
};

const buildProjectsQuery = (queryParams) => {
  let query = {};
  if (queryParams?.filters?.projects) {
    const projectsIds = JSON.parse(queryParams?.filters?.projects);
    query = {
      ...query,
      id: { [Op.in]: projectsIds },
    };
  }
  return query;
};

const buildRequirementQuery = (queryParams) => {
  let query = {};
  if (queryParams?.filters?.technologies) {
    const technologiesIds = JSON.parse(queryParams?.filters?.technologies);
    query = {
      ...query,
      technologyId: { [Op.in]: technologiesIds },
    };
  }
  return query;
};
