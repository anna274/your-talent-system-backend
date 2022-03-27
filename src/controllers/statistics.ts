import { findAll, create } from 'services/statistics' 
import { logger } from 'index';

export const getAll = async(req, res, next) => {
  try {
    const result = await findAll();
    logger.info('GET all statistics', result)
    res.send(result);
  } catch(e) {
    res.status(500).send({ message: 'Server error' });
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