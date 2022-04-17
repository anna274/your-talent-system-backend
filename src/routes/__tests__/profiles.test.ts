import * as express from 'express';
import * as request from 'supertest';
import profilesRouter from 'routes/profiles';
import { findById, create, update, findAll, destroy } from 'services/profiles';
import * as bodyParser from 'body-parser';

const mockedProfile = { id: '1', name: 'test' };
const mockedAccount = { login: 'test', password: 'test' };

jest.mock('services/profiles', () => ({
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
app.use(profilesRouter);

describe('profiles API', () => {
  describe('GET /', () => {
    it('Returns all profiles data', async () => {
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

  describe('GET /:profileId', () => {
    it('Returns profile if exists', async () => {
      //@ts-ignore
      findById.mockImplementationOnce(() => ({ dataValues: { id: '1' } }));
      const response = await request(app)
        .get('/1')
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ id: '1' });
    });
    it('Returns 404 if profile does not exists', async () => {
      //@ts-ignore
      findById.mockImplementationOnce(() => ({ dataValues: null }));
      const response = await request(app)
        .get('/1')
        .set('Accept', 'application/json');
      expect(response.status).toEqual(404);
      expect(response.body).toEqual({ message: 'Профиль не найден' });
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
    it('Returns created profile data', async () => {
      //@ts-ignore
      create.mockImplementationOnce(() => mockedProfile);
      const response = await request(app)
        .post('/')
        .set('Accept', 'application/json')
        .send({ profileData: mockedProfile, accountData: mockedAccount });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(mockedProfile);
    });

    it('Returns 500 if server error occuried', async () => {
      //@ts-ignore
      create.mockImplementationOnce(() => {
        throw new Error('Server error');
      });
      const response = await request(app)
        .post('/')
        .set('Accept', 'application/json')
        .send({ profileData: mockedProfile, accountData: mockedAccount });
      expect(response.status).toEqual(500);
      expect(response.body).toEqual({ message: 'Server error' });
    });
  });

  describe('PUT /:profileId', () => {
    it('Returns updated profile data', async () => {
      //@ts-ignore
      update.mockImplementationOnce(() => mockedProfile);
      const response = await request(app)
        .put('/1')
        .set('Accept', 'application/json')
        .send({ profileData: mockedProfile });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(mockedProfile);
    });

    it('Returns 500 if server error occuried', async () => {
      //@ts-ignore
      update.mockImplementationOnce(() => {
        throw new Error('Server error');
      });
      const response = await request(app)
        .put('/1')
        .set('Accept', 'application/json')
        .send({ profileData: mockedProfile });
      expect(response.status).toEqual(500);
      expect(response.body).toEqual({ message: 'Server error' });
    });
  });

  describe('DELETE /:profileId', () => {
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
