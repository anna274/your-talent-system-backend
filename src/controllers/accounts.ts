import { findById } from 'services/accounts' 
import { logger } from 'index';

export const getById = async(req, res, next) => {
  const {accountId} = req.params;
  try {
    const result = await findById(accountId);
    const account = result.dataValues;
    logger.info('GET account by id', account)
    if(!account) {
      res.status(404).send({ message: 'User not found' });
    } else {
      res.send(account);
    }
  } catch(e) {
    res.status(500).send({ message: 'Server error' });
    logger.error(e);
  }
}