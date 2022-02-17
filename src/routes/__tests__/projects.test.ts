import * as express from 'express';
import * as request from 'supertest';
import projectsRouter from 'routes/projects';
import { findById, create, update, findAll, destroy } from 'services/projects';
import * as bodyParser from 'body-parser';

const mockedProject = { id: '1', scopes: [], technologies: [], name: 'test' };

jest.mock('services/projects', () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));
jest.mock('index', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

const app = express();
app.use(bodyParser.json());
app.use(projectsRouter);

describe('projects API', () => {
  describe('GET /', () => {
    it('Returns all projects data', async () => {
      //@ts-ignore
      findAll.mockImplementationOnce(() => []);
      const response = await request(app).get('/');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual([]);
    });
    it('Returns 500 if server error occuried', async () => {
      //@ts-ignore
      findAll.mockImplementationOnce(() => {
        throw new Error('Server error');
      });
      const response = await request(app).get('/');
      expect(response.status).toEqual(500);
      expect(response.body).toEqual({ message: 'Server error' });
    });
  });

  describe('GET /:projectId', () => {
    it('Returns project if exists', async () => {
      //@ts-ignore
      findById.mockImplementationOnce(() => ({ dataValues: { id: '1' } }));
      const response = await request(app)
        .get('/1')
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ id: '1' });
    });
    it('Returns 404 if project does not exists', async () => {
      //@ts-ignore
      findById.mockImplementationOnce(() => ({ dataValues: null }));
      const response = await request(app)
        .get('/1')
        .set('Accept', 'application/json');
      expect(response.status).toEqual(404);
      expect(response.body).toEqual({ message: 'Проект не найден' });
    });
    it('Returns 500 if server error occuried', async () => {
      //@ts-ignore
      findById.mockImplementationOnce(() => {
        throw new Error('Server error');
      });
      const response = await request(app)
        .get('/1')
        .set('Accept', 'application/json');
      expect(response.status).toEqual(500);
      expect(response.body).toEqual({ message: 'Server error' });
    });
  });

  describe('POST /', () => {
    it('Returns created project data', async () => {
      //@ts-ignore
      create.mockImplementationOnce(() => mockedProject);
      const response = await request(app)
        .post('/')
        .set('Accept', 'application/json')
        .send({ projectData: mockedProject });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(mockedProject);
    });

    it('Returns 400 is if there is no project data', async () => {
      const response = await request(app)
        .post('/')
        .set('Accept', 'application/json')
        .send(null);
      expect(response.status).toEqual(400);
      expect(response.body).toEqual({
        message: 'Данные о проекте отсутствуют',
      });
    });

    it('Returns 500 if server error occuried', async () => {
      //@ts-ignore
      create.mockImplementationOnce(() => {
        throw new Error('Server error');
      });
      const response = await request(app)
        .post('/')
        .set('Accept', 'application/json')
        .send({ projectData: mockedProject });
      expect(response.status).toEqual(500);
      expect(response.body).toEqual({ message: 'Server error' });
    });
  });

  describe('PUT /:projectId', () => {
    it('Returns updated project data', async () => {
      //@ts-ignore
      update.mockImplementationOnce(() => mockedProject);
      const response = await request(app)
        .put('/1')
        .set('Accept', 'application/json')
        .send({ projectData: mockedProject });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(mockedProject);
    });

    it('Returns 400 is if there is no project data', async () => {
      const response = await request(app)
        .put('/1')
        .set('Accept', 'application/json')
        .send(null);
      expect(response.status).toEqual(400);
      expect(response.body).toEqual({
        message: 'Данные о проекте отсутствуют',
      });
    });

    it('Returns 500 if server error occuried', async () => {
      //@ts-ignore
      update.mockImplementationOnce(() => {
        throw new Error('Server error');
      });
      const response = await request(app)
        .put('/1')
        .set('Accept', 'application/json')
        .send({ projectData: mockedProject });
      expect(response.status).toEqual(500);
      expect(response.body).toEqual({ message: 'Server error' });
    });
  });

  describe('DELETE /:projectId', () => {
    it('Returns 200 if deleted', async () => {
      const response = await request(app)
        .delete('/1')
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
    });
    it('Returns 500 if server error occuried', async () => {
      //@ts-ignore
      destroy.mockImplementationOnce(() => {
        throw new Error('Server error');
      });
      const response = await request(app)
        .delete('/1')
        .set('Accept', 'application/json');
      expect(response.status).toEqual(500);
      expect(response.body).toEqual({ message: 'Server error' });
    });
  });
});
