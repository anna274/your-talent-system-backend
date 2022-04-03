import { findById, updateAccountPassword } from 'services/accounts' 
import { logger } from 'index';
import { INCORRECT_PASSWORD_ERROR } from 'consts'

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
export const putPassword = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;
    const updatedUserPsw = await updateAccountPassword(userId, currentPassword, newPassword);
    res.send(updatedUserPsw);
  } catch(e) {
    logger.error(e);
    if(e.message === INCORRECT_PASSWORD_ERROR) {
      res.status(400).send({ message: e.message });
    } else {
      res.status(500).send({ message: 'Ошибка при обновлении пароля' });
    }
  }
}