import { findAll, create, update, destroy } from 'services/technologies' 
import { logger } from 'index';

export const getAll = async(req, res, next) => {
  try {
    const result = await findAll();
    logger.info('GET all technologies', result)
    res.send(result);
  } catch(e) {
    res.status(500).send({ message: 'Server error' });
    logger.error(e);
  }
}

export const post = async(req, res, next) => {
  try {
    const { technologyData } = req.body;
    if(!technologyData) {
      res.status(400).send({ message: 'Данные о технологии отсутствуют' });
      return;
    }
    const technology = await create(technologyData);
    logger.info('create technology', technology)
    res.send(technology);
  } catch(e) {
    res.status(500).send({ message: e.message });
    logger.error(e);
  }
}

export const put = async(req, res, next) => {
  try {
    const { technologyData } = req.body;
    if(!technologyData) {
      res.status(400).send({ message: 'Данные о технологии отсутствуют' });
      return;
    }
    const technology = await update(technologyData);
    logger.info('update technology', technology)
    res.send(technology);
  } catch(e) {
    res.status(500).send({ message: e.message });
    logger.error(e);
  }
}

export const deleteOne = async(req, res, next) => {
  try {
    const { technologyId } = req.params;
    await destroy(technologyId);
    logger.info('delete technology')
    res.send();
  } catch(e) {
    res.status(500).send({ message: e.message });
    logger.error(e);
  }
}