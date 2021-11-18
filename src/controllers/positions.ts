import { findAll, findById, create, update, destroy } from 'services/positions' 
import { logger } from 'index';

export const getAll = async(req, res, next) => {
  try {
    const positions = await findAll();
    logger.info('GET all positions', positions)
    res.send(positions);
  } catch(e) {
    res.status(500).send({ message: 'Server error' });
    logger.error(e);
  }
}

export const getById = async(req, res, next) => {
  try {
    const { positionId } = req.params;
    const result = await findById(positionId);
    //@ts-ignore
    const position = result.dataValues;
    logger.info('GET position by id', position)
    res.send(position);
  } catch(e) {
    res.status(500).send({ message: 'Server error' });
    logger.error(e);
  }
}

export const post = async(req, res, next) => {
  try {
    const { positionData } = req.body;
    const position = await create(positionData);
    logger.info('POST position', position)
    res.send(position);
  } catch(e) {
    res.status(500).send({ message: 'Server error' });
    logger.error(e);
  }
}

export const put = async(req, res, next) => {
  try {
    const { positionData } = req.body;
    const position = await update(positionData);
    logger.info('update position', position)
    res.send(position);
  } catch(e) {
    res.status(500).send({ message: 'Server error' });
    logger.error(e);
  }
}

export const deleteOne = async(req, res, next) => {
  try {
    const { positionId } = req.params;
    await destroy(positionId);
    logger.info('delete position')
    res.send();
  } catch(e) {
    res.status(500).send({ message: 'Server error' });
    logger.error(e);
  }
}