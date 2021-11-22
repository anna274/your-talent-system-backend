import {
  Profile,
  Department,
  JobFunction,
  Account,
  Skill,
  Technology,
  Level,
} from 'models/main';
import { createAccount } from 'services/accounts';
import { createSkills, deleteSkillsByProfileId } from 'services/skills';

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
    ],
  });
};

export const create = async (accountData, profileData) => {
  const { login, password } = accountData;
  const profileAccount = await createAccount(login, password);
  const { skills, department, jobFunction, ...restInfo } = profileData;
  const changedSkills = skills.map(({ technology, level }) => ({
    technologyId: technology.id,
    levelId: level.id,
  }));
  return Profile.create(
    {
      ...restInfo,
      accountId: profileAccount.id,
      skills: changedSkills,
      departmentId: department.id,
      jobFunctionId: jobFunction.id,
    },
    { include: [Skill] }
    //@ts-ignore
  ).then((profile) => findById(profile.id));
};

export const update = async (profileData) => {
  const { id, skills, department, job_function, ...restInfo } = profileData;
  const changedSkills = skills.map(({ technology, level }) => ({
    technologyId: technology.id,
    levelId: level.id,
  }));
  const savedSkills = await createSkills(changedSkills);
  return findById(id)
    .then(async (project) => {
      await project.update({
        ...restInfo,
        departmentId: department.id,
        jobFunctionId: job_function.id,
      });
      await deleteSkillsByProfileId(id);
      // @ts-ignore
      await project.setSkills(savedSkills.map(({ id }) => id));
    })
    .then(() => findById(id));
};

export const destroy = async (id: string) => {
  await deleteSkillsByProfileId(id);
  const profile = await Profile.findOne({ where: { id } });
  // @ts-ignore
  await Account.destroy({ where: { id: profile.dataValues.accountId } });
  return profile.destroy();
};

export const findProfilesByJobFunction = async (jobFunctionId: string) => {
  return Profile.findAll({
    where: { jobFunctionId },
    include: [
      {
        model: Department,
        attributes: ['id', 'name'],
      },
      {
        model: JobFunction,
        attributes: ['id', 'name'],
      },
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
    ],
  });
};
