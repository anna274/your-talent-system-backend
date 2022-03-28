import { StatisticsInfo, StatisticsType } from 'models/main';
import { findById as findAccountById } from 'services/accounts';
import { findAll as findAllProfiles } from 'services/profiles';
import { findAll as findAllPositions } from 'services/positions';
import { findAll as findAllTechnologies } from 'services/technologies';
import { STATISTICS_TYPES } from 'consts';
import { formatDate } from 'helpers';

export const findAll = async (query) => {
  const { userId } = query;
  const user = await findAccountById(userId);
  console.log('user', user)
  const filter = user.dataValues.roles.find(({ name }) => name === 'admin') ? {} : {isPublic: true};
  return StatisticsInfo.findAll({
    where: filter,
    order: [['createdAt', 'DESC']],
    include: [{ model: StatisticsType, attributes: ['id', 'name'] }],
  });
};

export const findById = (id: string): any => {
  return StatisticsInfo.findOne({
    where: { id },
    include: [{ model: StatisticsType, attributes: ['id', 'name'] }],
  });
};

export const statisticsFactory = async (data) => {
  const getDepartmentsAdditionalText = (departments) => {
    if (departments.length === 0) {
      return 'всем департаментам';
    }
    const departmentsNames = departments.map(({ name }) => name).join(', ');
    return departments.length === 1
      ? departmentsNames + ' департаменту'
      : departmentsNames + ' департаментам';
  };

  const getJobFunctionsAdditionalText = (jobFunctions) => {
    if (jobFunctions.length === 0) {
      return 'всех должностей';
    }
    const jobFunctionsNames = jobFunctions.map(({ name }) => name).join(', ');
    return jobFunctions.length === 1
      ? ' должности ' + jobFunctionsNames
      : ' должностей ' + jobFunctionsNames;
  };

  const compareByAllNumber = (a, b) => {
    if (a.all > b.all) {
      return -1;
    }
    if (a.all < b.all) {
      return 1;
    }
    return 0;
  };

  const sortTechnologiesByOccurrences = (technologies) =>
    technologies.sort(compareByAllNumber);

  const getTechnologyRows = (rows, technology, fieldName) => {
    return rows.reduce(
      (res, row) => {
        const neededSkill = row[fieldName].find(
          ({ technology: { id } }) => id === technology.id
        );
        if (neededSkill) {
          const level = neededSkill.level.value;
          return {
            all: res.all + 1,
            junior: level === 1 ? res.junior + 1 : res.junior,
            middle: level === 2 ? res.middle + 1 : res.middle,
            senior: level === 3 ? res.senior + 1 : res.senior,
          };
        }
        return res;
      },
      { all: 0, junior: 0, middle: 0, senior: 0 }
    );
  };

  const getStatisticsData = async (rows, fieldName) => {
    const technologies = await findAllTechnologies();
    return technologies.reduce((res, technology) => {
      const profilesWithTechnology = getTechnologyRows(
        rows,
        technology,
        fieldName
      );
      return profilesWithTechnology.all > 0
        ? [...res, { technology: technology.name, ...profilesWithTechnology }]
        : res;
    }, []);
  };

  const {
    statisticsType: { name },
  } = data;

  if (name === STATISTICS_TYPES.TECHNOLOGIES_STATS) {
    const { from, to, jobFunctions } = data;
    const positions = await findAllPositions({
      filters: {
        jobFunctions: jobFunctions.length
          ? JSON.stringify(jobFunctions.map(({ id }) => id))
          : null,
        applicationDate: {
          from,
          to,
        },
      },
    });
    const statisticsData = await getStatisticsData(positions, 'requirements');
    const stringifiedStatisticsData = JSON.stringify(
      sortTechnologiesByOccurrences(statisticsData)
    );
    const label = `Востребованные технологии с ${formatDate(
      new Date(from)
    )} по ${formatDate(new Date(to))}`;
    const additionalInfo = `Информация для ${getJobFunctionsAdditionalText(
      jobFunctions
    )}.`;
    return {
      label,
      data: stringifiedStatisticsData,
      additionalInfo,
    };
  }
  if (name === STATISTICS_TYPES.SKILLS_STATS) {
    const { departments, jobFunctions } = data;
    const profiles = await findAllProfiles({
      filters: {
        departments: departments.length
          ? JSON.stringify(departments.map(({ id }) => id))
          : null,
        jobFunctions: jobFunctions.length
          ? JSON.stringify(jobFunctions.map(({ id }) => id))
          : null,
      },
    });
    const statisticsData = await getStatisticsData(profiles, 'skills');
    const stringifiedStatisticsData = JSON.stringify(
      sortTechnologiesByOccurrences(statisticsData)
    );
    const label = `Состояние компетенций на ${formatDate()} `;
    const additionalInfo = `Информация по ${getDepartmentsAdditionalText(
      departments
    )}, для ${getJobFunctionsAdditionalText(jobFunctions)}.`;
    return {
      statisticsTypeId: data.statisticsType.id,
      isPublic: data.isPublic,
      label,
      data: stringifiedStatisticsData,
      additionalInfo,
    };
  }
  return {};
};

export const create = async (data: any) => {
  const statsData = await statisticsFactory(data);
  return StatisticsInfo.create({
    statisticsTypeId: data.statisticsType.id,
    isPublic: data.isPublic,
    ...statsData,
  }).then((statistics) =>
    //@ts-ignore
    findById(statistics.id)
  );
};

export const update = async (statisticsData) => {
  const { id, ...dataToUpdate } = statisticsData;
  return findById(id)
    .then(async (statistics) => {
      await statistics.update(dataToUpdate);
    })
    .then(() => findById(id));
};

export const destroy = async (id: string) => {
  return StatisticsInfo.destroy({ where: { id } });
};
