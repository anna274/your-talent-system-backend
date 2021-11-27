import { findAll, findById, create, update, destroy } from 'services/profiles' 
import { logger } from 'index';
import { getErrorMessage } from 'helpers';

export const getAll = async(req, res, next) => {
  try {
    const profiles = await findAll();
    logger.info('GET all profiles', profiles)
    res.send(profiles);
  } catch(e) {
    res.status(500).send({ message: 'Server error' });
    logger.error(e);
  }
}

export const getById = async(req, res, next) => {
  try {
    const { profileId } = req.params;
    const result = await findById(profileId);
    //@ts-ignore
    const profile = result.dataValues;
    logger.info('GET profile by id', profile)
    res.send(profile);
  } catch(e) {
    res.status(500).send({ message: 'Server error' });
    logger.error(e);
  }
}

export const post = async(req, res, next) => {
  try {
    const { accountData, profileData } = req.body;
    const profile = await create(accountData, profileData);
    logger.info('POST profile', profile)
    res.send(profile);
  } catch(e) {
    res.status(500).send({ message: getErrorMessage(e) });
    logger.error(e);
  }
}

export const put = async(req, res, next) => {
  try {
    const { profileData } = req.body;
    const profile = await update(profileData);
    logger.info('update profile', profile)
    res.send(profile);
  } catch(e) {
    res.status(500).send({ message: 'Server error' });
    logger.error(e);
  }
}

export const deleteOne = async(req, res, next) => {
  try {
    const { profileId } = req.params;
    await destroy(profileId);
    logger.info('delete profile')
    res.send();
  } catch(e) {
    res.status(500).send({ message: 'Server error' });
    logger.error(e);
  }
}