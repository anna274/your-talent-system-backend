import { findAll, findById, create, update, destroy } from 'services/jobFunctions' 
import { logger } from 'index';

export const getAll = async(req, res, next) => {
  try {
    const result = await findAll(req.query || {});
    logger.info('GET all jobFunctions', result)
    res.send(result);
  } catch(e) {
    res.status(500).send({ message: 'Server error' });
    logger.error(e);
  }
}

export const getById = async(req, res, next) => {
  try {
    const { jobFunctionId } = req.params;
    const result = await findById(jobFunctionId);
    //@ts-ignore
    const jobFunction = result.dataValues;
    if(!jobFunction) {
      res.status(404).send({ message: 'Департамент не найден' });
    } else {
      res.send(jobFunction);
    }
    logger.info('GET jobFunction by id', jobFunction)
  } catch(e) {
    res.status(500).send({ message: e.message });
    logger.error(e);
  }
}

export const post = async(req, res, next) => {
  try {
    const { jobFunctionData } = req.body;
    if(!jobFunctionData) {
      res.status(400).send({ message: 'Данные о должности отсутствуют' });
      return;
    }
    const jobFunction = await create(jobFunctionData);
    logger.info('create jobFunction', jobFunction)
    res.send(jobFunction);
  } catch(e) {
    res.status(500).send({ message: e.message });
    logger.error(e);
  }
}

export const put = async(req, res, next) => {
  try {
    const { jobFunctionData } = req.body;
    if(!jobFunctionData) {
      res.status(400).send({ message: 'Данные о должности отсутствуют' });
      return;
    }
    const jobFunction = await update(jobFunctionData);
    logger.info('update jobFunction', jobFunction)
    res.send(jobFunction);
  } catch(e) {
    res.status(500).send({ message: e.message });
    logger.error(e);
  }
}

export const deleteOne = async(req, res, next) => {
  try {
    const { jobFunctionId } = req.params;
    await destroy(jobFunctionId);
    logger.info('delete jobFunction')
    res.send();
  } catch(e) {
    res.status(500).send({ message: e.message });
    logger.error(e);
  }
}