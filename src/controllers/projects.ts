import { findAll, create, findById, update, destroy } from 'services/projects' 
import { logger } from 'index';

export const getAll = async(req, res, next) => {
  try {
    const projects = await findAll(req.query || {});
    logger.info('GET all projects', projects)
    res.send(projects);
  } catch(e) {
    res.status(500).send({ message: e.message });
    logger.error(e);
  }
}

export const getById = async(req, res, next) => {
  try {
    const { projectId } = req.params;
    const result = await findById(projectId);
    //@ts-ignore
    const project = result.dataValues;
    if(!project) {
      res.status(404).send({ message: 'Проект не найден' });
    } else {
      res.send(project);
    }
    logger.info('GET project by id', project)
  } catch(e) {
    res.status(500).send({ message: e.message });
    logger.error(e);
  }
}

export const post = async(req, res, next) => {
  try {
    const { projectData } = req.body;
    if(!projectData) {
      res.status(400).send({ message: 'Данные о проекте отсутствуют' });
      return;
    }
    const project = await create(projectData);
    logger.info('create project', project)
    res.send(project);
  } catch(e) {
    res.status(500).send({ message: e.message });
    logger.error(e);
  }
}

export const put = async(req, res, next) => {
  try {
    const { projectData } = req.body;
    if(!projectData) {
      res.status(400).send({ message: 'Данные о проекте отсутствуют' });
      return;
    }
    const project = await update(projectData);
    logger.info('update project', project)
    res.send(project);
  } catch(e) {
    res.status(500).send({ message: e.message });
    logger.error(e);
  }
}

export const deleteOne = async(req, res, next) => {
  try {
    const { projectId } = req.params;
    await destroy(projectId);
    logger.info('delete project')
    res.send();
  } catch(e) {
    res.status(500).send({ message: e.message });
    logger.error(e);
  }
}