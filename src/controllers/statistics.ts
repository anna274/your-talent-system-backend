import { findAll, findById, create, update, destroy } from 'services/statistics' 
import { logger } from 'index';

export const getAll = async(req, res, next) => {
  try {
    const result = await findAll(req.query || {});
    logger.info('GET all statistics', result)
    res.send(result);
  } catch(e) {
    res.status(500).send({ message: 'Server error' });
    logger.error(e);
  }
}

export const getById = async(req, res, next) => {
  try {
    const { statisticsId } = req.params;
    const result = await findById(statisticsId);
    //@ts-ignore
    const statistics = result.dataValues;
    if(!statistics) {
      res.status(404).send({ message: 'ОТчёт не найден' });
    } else {
      res.send(statistics);
    }
    logger.info('GET statistics by id', statistics)
  } catch(e) {
    res.status(500).send({ message: e.message });
    logger.error(e);
  }
}

export const post = async (req, res, next) => {
  try {
    const { statisticsData } = req.body;
    if(!statisticsData) {
      res.status(400).send({ message: 'Данные о отчёте отсутствуют' });
      return;
    }
    const statistics = await create(statisticsData);
    logger.info('POST statistics', statistics);
    res.send(statistics);
  } catch (e) {
    res.status(500).send({ message: e.message });
    logger.error(e);
  }
};

export const put = async(req, res, next) => {
  try {
    const { statisticsData } = req.body;
    if(!statisticsData) {
      res.status(400).send({ message: 'Данные о статистике отсутствуют' });
      return;
    }
    const statistics = await update(statisticsData);
    logger.info('update statistics', statistics)
    res.send(statistics);
  } catch(e) {
    res.status(500).send({ message: e.message });
    logger.error(e);
  }
}

export const deleteOne = async(req, res, next) => {
  try {
    const { statisticsId } = req.params;
    await destroy(statisticsId);
    logger.info('delete statistics')
    res.send();
  } catch(e) {
    res.status(500).send({ message: e.message });
    logger.error(e);
  }
}