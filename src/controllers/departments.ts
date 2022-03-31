import { findAll, create, update, destroy } from 'services/departments' 
import { logger } from 'index';

export const getAll = async(req, res, next) => {
  try {
    const result = await findAll();
    logger.info('GET all departments', result)
    res.send(result);
  } catch(e) {
    res.status(500).send({ message: 'Server error' });
    logger.error(e);
  }
}

export const post = async(req, res, next) => {
  try {
    const { departmentData } = req.body;
    if(!departmentData) {
      res.status(400).send({ message: 'Данные о департаменте отсутствуют' });
      return;
    }
    const department = await create(departmentData);
    logger.info('create department', department)
    res.send(department);
  } catch(e) {
    res.status(500).send({ message: e.message });
    logger.error(e);
  }
}

export const put = async(req, res, next) => {
  try {
    const { departmentData } = req.body;
    if(!departmentData) {
      res.status(400).send({ message: 'Данные о департаменте отсутствуют' });
      return;
    }
    const department = await update(departmentData);
    logger.info('update department', department)
    res.send(department);
  } catch(e) {
    res.status(500).send({ message: e.message });
    logger.error(e);
  }
}

export const deleteOne = async(req, res, next) => {
  try {
    const { departmentId } = req.params;
    await destroy(departmentId);
    logger.info('delete department')
    res.send();
  } catch(e) {
    res.status(500).send({ message: e.message });
    logger.error(e);
  }
}