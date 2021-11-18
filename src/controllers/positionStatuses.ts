import { findAll } from 'services/positionStatuses' 
import { logger } from 'index';

export const getAll = async(req, res, next) => {
  try {
    const result = await findAll();
    logger.info('GET all statuses', result)
    res.send(result);
  } catch(e) {
    res.status(500).send({ message: 'Server error' });
    logger.error(e);
  }
}