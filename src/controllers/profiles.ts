import * as formidable from 'formidable';
import {
  findAll,
  findById,
  findByAccountId,
  create,
  update,
  destroy,
} from 'services/profiles';
import { logger } from 'index';

export const getAll = async (req, res, next) => {
  try {
    const profiles = await findAll();
    logger.info('GET all profiles', profiles);
    res.send(profiles);
  } catch (e) {
    res
      .status(500)
      .send({ message: 'Ошибка при получении записей о профилях' });
    logger.error(e);
  }
};

export const getById = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const result = await findById(profileId);
    const profile = result.dataValues;
    if (!profile) {
      res.status(404).send({ message: 'Профиль не найден' });
    } else {
      res.send(profile);
    }
    logger.info('GET profile by id', profile);
  } catch (e) {
    res.status(500).send({ message: 'Ошибка при получении записи о профиле' });
    logger.error(e);
  }
};

export const getByAccountId = async (req, res, next) => {
  try {
    const { accountId } = req.params;
    const result = await findByAccountId(accountId);
    const profile = result?.dataValues;
    if (!profile) {
      res.status(404).send({ message: 'Профиль не найден' });
    } else {
      res.send(profile);
    }
    logger.info('GET profile by id', profile);
  } catch (e) {
    res.status(500).send({ message: 'Ошибка при получении записи о профиле' });
    logger.error(e);
  }
};

export const post = async (req, res, next) => {
  try {
    const form = formidable({ multiples: true });
    form.parse(req, async (err, fields, files) => {
      const profile = await create(fields, files);
      res.send(profile);
    });
  } catch (e) {
    res.status(500).send({ message: 'Ошибка при создании записи о профиле' });
    logger.error(e);
  }
};

export const put = async (req, res, next) => {
  try {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      const profile = await update(fields, files);
      res.send(profile);
    });
  } catch (e) {
    res.status(500).send({ message: 'Ошибка при обновлении записи о профиле' });
    logger.error(e);
  }
};

export const deleteOne = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    await destroy(profileId);
    logger.info('delete profile');
    res.send();
  } catch (e) {
    res.status(500).send({ message: 'Ошибка при удалении записи о профиле' });
    logger.error(e);
  }
};
