import {
  findAll,
  create,
  update,
  destroy,
  generateCandidates,
  addToCandidates,
  removeFromCandidates,
  setProfile,
  findOneWithProfile,
} from 'services/positions';
import { logger } from 'index';

export const getAll = async (req, res, next) => {
  try {
    const positions = await findAll(req.query || {});
    logger.info('GET all positions', positions);
    res.send(positions);
  } catch (e) {
    res.status(500).send({ message: 'Server error' });
    logger.error(e);
  }
};

export const getById = async (req, res, next) => {
  try {
    const { positionId } = req.params;
    const result = await findOneWithProfile(positionId);
    //@ts-ignore
    const position = result;
    logger.info('GET position by id', position);
    res.send(position);
  } catch (e) {
    res.status(500).send({ message: 'Server error' });
    logger.error(e);
  }
};

export const post = async (req, res, next) => {
  try {
    const { positionData } = req.body;
    const position = await create(positionData);
    logger.info('POST position', position);
    res.send(position);
  } catch (e) {
    res.status(500).send({ message: 'Server error' });
    logger.error(e);
  }
};

export const put = async (req, res, next) => {
  try {
    const { positionData } = req.body;
    const position = await update(positionData);
    logger.info('update position', position);
    res.send(position);
  } catch (e) {
    res.status(500).send({ message: 'Server error' });
    logger.error(e);
  }
};

export const deleteOne = async (req, res, next) => {
  try {
    const { positionId } = req.params;
    await destroy(positionId);
    logger.info('delete position ', positionId);
    res.send();
  } catch (e) {
    res.status(500).send({ message: 'Server error' });
    logger.error(e);
  }
};

export const getCandidates = async (req, res, next) => {
  try {
    const { positionId } = req.params;
    const candidates = await generateCandidates(positionId);
    logger.info('GET candidates', candidates);
    res.send(candidates);
  } catch (e) {
    res.status(500).send({ message: 'Server error' });
    logger.error(e);
  }
};

export const addCandidate = async (req, res, next) => {
  try {
    const { positionId, profileId } = req.params;
    const { koef } = req.body;
    const updatedPosition = await addToCandidates(positionId, profileId, koef);
    logger.info('Add to candidates', updatedPosition);
    res.send(updatedPosition);
  } catch (e) {
    res.status(500).send({ message: 'Server error' });
    logger.error(e);
  }
};

export const removeCandidate = async (req, res, next) => {
  try {
    const { positionId, profileId } = req.params;
    const updatedPosition = await removeFromCandidates(positionId, profileId);
    logger.info('delete candidate', updatedPosition);
    res.send(updatedPosition);
  } catch (e) {
    res.status(500).send({ message: 'Server error' });
    logger.error(e);
  }
};

export const setSpecialist = async (req, res, next) => {
  try {
    const { positionId, profileId } = req.params;
    const updatedPosition = await setProfile(positionId, profileId);
    logger.info('set candidate', updatedPosition);
    res.send(updatedPosition);
  } catch (e) {
    res.status(500).send({ message: 'Server error' });
    logger.error(e);
  }
};
