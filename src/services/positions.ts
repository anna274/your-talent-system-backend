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
import { findProfilesByJobFunction, findById as findProfileById } from 'services/profiles';

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
  if(!position.profileId) {
    return position;
  }
  const { dataValues: profile } = await findProfileById(position.profileId);
  console.log('position', position)
  return { ...position, profile };
}

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

export const calculateThresholds = (position) => {
  const { requirements } = position;
  return requirements.map(({ technology, level, priority }) => {
    const { id: technologyId } = technology;
    const { value: levelValue } = level;
    const { deviation } = priority;
    let threshold = levelValue - deviation;
    if (threshold < 0) {
      threshold = 0;
    }
    return { technologyId, threshold };
  });
};

export const isCandidateIdeal = (requirementsThresholds, profile) => {
  return requirementsThresholds.every(({ threshold, technologyId }) => {
    const { skills } = profile;
    const requiredSkill = skills.find(
      ({ technology: { id } }) => id === technologyId
    );
    return requiredSkill ? requiredSkill.level.value >= threshold : false;
  });
};

export const calculateMaxInterval = (reqThresholds) => {
  const sum = reqThresholds.reduce(
    (res, { threshold }) => res + threshold * threshold,
    0
  );
  return Math.sqrt(sum);
};

export const calculateInterval = (reqThresholds, profile) => {
  if (isCandidateIdeal(reqThresholds, profile)) {
    return 0;
  }
  const { skills } = profile;
  const sum = reqThresholds.reduce((res, { technologyId, threshold }) => {
    const requiredSkill = skills.find(
      ({ technology: { id } }) => id === technologyId
    );
    const level = requiredSkill ? requiredSkill.level.value : 0;
    return res + (threshold - level) * (threshold - level);
  }, 0);
  return Math.sqrt(sum);
};

const compare = (a, b) => {
  if (a.koef > b.koef) {
    return -1;
  }
  if (a.koef < b.koef) {
    return 1;
  }
  return 0;
};

export const sortCandidatesByKoef = (candidates) => candidates.sort(compare);

export const generateCandidates = async (positionId: string) => {
  const { dataValues: position } = await findById(positionId);
  const possibleCandidates = await findProfilesByJobFunction(
    position.jobFunctionId
  );
  const requirementsThresholds = calculateThresholds(position);
  // let maxInterval = 0;
  // const intervals = possibleCandidates.map(possibleCandidate => {
  //   const interval = calculateInterval(requirementsThresholds, possibleCandidate);
  //   if(maxInterval < interval) {
  //     maxInterval = interval;
  //   };
  //   return interval;
  // });
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
