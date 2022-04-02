import { findAll, findById, create, update, destroy } from 'services/technologies' 
import { logger } from 'index';

export const getAll = async(req, res, next) => {
  try {
    const result = await findAll(req.query || {});
    logger.info('GET all technologies', result)
    res.send(result);
  } catch(e) {
    res.status(500).send({ message: 'Ошибка при получении записей о технологиях' });
    logger.error(e);
  }
}

export const getById = async(req, res, next) => {
  try {
    const { technologyId } = req.params;
    const result = await findById(technologyId);
    //@ts-ignore
    const technology = result.dataValues;
    if(!technology) {
      res.status(404).send({ message: 'Технология не найдена' });
    } else {
      res.send(technology);
    }
    logger.info('GET technology by id', technology)
  } catch(e) {
    res.status(500).send({ message: 'Ошибка при получении записи о технологии' });
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
    res.status(500).send({ message: 'Ошибка при создании записи о технологии' });
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
    res.status(500).send({ message: 'Ошибка при обновлении записи о технологии' });
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
    res.status(500).send({ message: 'Ошибка при удалени записи о технологии' });
    logger.error(e);
  }
}