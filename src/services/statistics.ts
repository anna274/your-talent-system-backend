import { StatisticsInfo, StatisticsType } from 'models/main';
import { findAll as findAllProfiles } from 'services/profiles';
import { findAll as findAllPositions } from 'services/positions';
import { findAll as findAllTechnologies } from 'services/technologies';

export const findAll = (): any => {
  return StatisticsInfo.findAll({
    include: [{ model: StatisticsType, attributes: ['id', 'name'] }],
  });
};

export const findById = (id: string): any => {
  return StatisticsInfo.findOne({
    where: { id },
    include: [{ model: StatisticsType, attributes: ['id', 'name'] }],
  });
};

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

export const create = async (data: any) => {
  let statisticsInfo = {
    statisticsTypeId: data.statisticsType.id,
    isPublic: data.isPublic,
    data: '',
    label: '',
    additionalInfo: '',
  };
  if (data.statisticsType.name === 'Состояние компетенций') {
    const { departments, jobFunctions } = data;
    const profiles = await findAllProfiles({
      filters: {
        departments: departments.length ? JSON.stringify(departments.map(({id}) => id)): null,
        jobFunctions:  jobFunctions.length ? JSON.stringify(jobFunctions.map(({id}) => id)): null,
      },
    });
    const technologies = await findAllTechnologies();
    const statisticsData = technologies.reduce((res, technology) => {
      const profilesWithTechnology = profiles.filter(({ skills }) => {
        return !!skills.find(({ technology: { id } }) => id === technology.id);
      });
      return profilesWithTechnology.length > 0
        ? [
            ...res,
            { category: technology.name, value: profilesWithTechnology.length },
          ]
        : res;
    }, []);
    const stringifiedStatisticsData = JSON.stringify(statisticsData);
    const label = `Состояние компетенций на ${new Intl.DateTimeFormat(
      'ru',
      {}
    ).format()} `;
    const additionalInfo = `Информация по ${getDepartmentsAdditionalText(
      departments
    )}, для ${getJobFunctionsAdditionalText(jobFunctions)}.`;
    statisticsInfo = {
      ...statisticsInfo,
      label,
      data: stringifiedStatisticsData,
      additionalInfo,
    };
    return StatisticsInfo.create(statisticsInfo).then((statistics) =>
      //@ts-ignore
      findById(statistics.id)
    );
  }
  if(data.statisticsType.name === 'Востребованные технологии') {
    const { from, to, jobFunctions } = data;
    const positions = await findAllPositions({
      filters: {
        jobFunctions:  jobFunctions.length ? JSON.stringify(jobFunctions.map(({id}) => id)): null,
        applicationDate: {
          from,
          to
        }
      },
    });
    const technologies = await findAllTechnologies();
    const statisticsData = technologies.reduce((res, technology) => {
      const positionsWithTechnology = positions.filter(({ requirements }) => {
        return !!requirements.find(({ technology: { id } }) => id === technology.id)
      });
      return positionsWithTechnology.length > 0 ?[...res, { category: technology.name, value: positionsWithTechnology.length}] : res;
    }, [])
    const stringifiedStatisticsData = JSON.stringify(statisticsData);
    const label = `Востребованные технологии с ${new Intl.DateTimeFormat('ru', {  }).format(new Date(from))} по ${new Intl.DateTimeFormat('ru', {  }).format(new Date(to))}`;
    const additionalInfo = `Информация для ${getJobFunctionsAdditionalText(jobFunctions)}.`;
    statisticsInfo = {
      ...statisticsInfo,
      label,
      data: stringifiedStatisticsData,
      additionalInfo
    }
    return StatisticsInfo.create(statisticsInfo).then((statistics) =>
    //@ts-ignore
    findById(statistics.id)
  );
  }
};
