import { Op } from 'sequelize';
import {
  Profile,
  Department,
  JobFunction,
  Account,
  Skill,
  Technology,
  Level,
  Position,
  Project,
  PositionStatus
} from 'models/main';
import { createAccount } from 'services/accounts';
import { createSkills, deleteSkillsByProfileId } from 'services/skills';
import { uploadImage } from 'services/cloudinary';

export const findAll = (filters = {}): any => {
  const jobFunctionsQuery = buildJobFunctionsQuery(filters);
  const departmentsQuery = buildDepartmentsQuery(filters);
  return Profile.findAll({
    include: [
      {
        model: Department,
        attributes: ['id', 'name'],
        where: departmentsQuery,
      },
      {
        model: JobFunction,
        attributes: ['id', 'name'],
        where: jobFunctionsQuery,
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
      }
    ],
    order: [['updatedAt', 'DESC']]
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
      {
        model: Position,
        attributes: ['id'],
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
            model: PositionStatus,
            attributes: ['id', 'value'],
          },
        ],
      }
      
    ],
  });
};

export const findByAccountId = (accountId: string): any => {
  return Profile.findOne({
    where: { accountId },
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
      {
        model: Position,
        attributes: ['id'],
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
            model: PositionStatus,
            attributes: ['id', 'value'],
          },
        ],
      }
    ],
  });
};

export const create = async (fields, files) => {
  const { accountData, profileData } = fields;
  const { login, password } = JSON.parse(accountData);
  const profileAccount = await createAccount(login, password);
  const { skills, department, jobFunction, ...restInfo } = JSON.parse(profileData);
  const changedSkills = skills.map(({ technology, level }) => ({
    technologyId: technology.id,
    levelId: level.id,
  }));
  let photoLink = '';
  if(!!files.photoLink) {
    const uploadResponse = await uploadImage(files.photoLink.filepath);
    photoLink = uploadResponse.secure_url;
  }
  return Profile.create(
    {
      ...restInfo,
      accountId: profileAccount.id,
      skills: changedSkills,
      departmentId: department.id,
      jobFunctionId: jobFunction.id,
      photoLink
    },
    { include: [Skill] }
    //@ts-ignore
  ).then((profile) => findById(profile.id));
};

export const update = async (fields, files) => {
  const { id, skills, department, job_function, ...restInfo } = JSON.parse(fields.profileData);
  const changedSkills = skills.map(({ technology, level }) => ({
    technologyId: technology.id,
    levelId: level.id,
  }));
  let photoLink = '';
  if(!!files.photoLink) {
    const uploadResponse = await uploadImage(files.photoLink.filepath);
    photoLink = uploadResponse.secure_url;
  } else {
    photoLink = fields.oldAvatarURL;
  }
  
  const savedSkills = await createSkills(changedSkills);
  return findById(id)
    .then(async (project) => {
      await project.update({
        ...restInfo,
        departmentId: department.id,
        jobFunctionId: job_function.id,
        photoLink
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

const buildJobFunctionsQuery = (queryParams) => {
  let query = {};
  if(queryParams?.filters?.jobFunctions) {
    const jobFunctionsIds = JSON.parse(queryParams?.filters?.jobFunctions);
    query = {
      ...query,
      id: { [Op.in]: jobFunctionsIds }
    }
  }
  return query;
};

const buildDepartmentsQuery = (queryParams) => {
  let query = {};
  if(queryParams?.filters?.departments) {
    const departmentsIds = JSON.parse(queryParams?.filters?.departments);
    query = {
      ...query,
      id: { [Op.in]: departmentsIds }
    }
  }
  return query;
};

