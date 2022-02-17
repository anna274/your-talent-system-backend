import * as express from 'express';
import * as request from 'supertest';
import positionsRouter from 'routes/positions';
import {
  findOneWithProfile,
  create,
  update,
  findAll,
  destroy,
  generateCandidates,
  addToCandidates,
  removeFromCandidates,
  setProfile
} from 'services/positions';
import * as bodyParser from 'body-parser';

const mockedPosition = { id: '1', jobFunctionId: 'test' };

jest.mock('services/positions', () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  findOneWithProfile: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
  generateCandidates: jest.fn(),
  addToCandidates: jest.fn(),
  removeFromCandidates: jest.fn(),
  setProfile: jest.fn()
}));
jest.mock('index', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

const app = express();
app.use(bodyParser.json());
app.use(positionsRouter);

describe('positions API', () => {
  describe('GET /', () => {
    it('Returns all positions data', async () => {
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

  describe('GET /:positionId', () => {
    it('Returns position if exists', async () => {
      //@ts-ignore
      findOneWithProfile.mockImplementationOnce(() => mockedPosition);
      const response = await request(app)
        .get('/1')
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(mockedPosition);
    });
    it('Returns 404 if position does not exists', async () => {
      //@ts-ignore
      findOneWithProfile.mockImplementationOnce(() => null);
      const response = await request(app)
        .get('/1')
        .set('Accept', 'application/json');
      expect(response.status).toEqual(404);
      expect(response.body).toEqual({ message: 'Позиция не найдена' });
    });
    it('Returns 500 if server error occuried', async () => {
      //@ts-ignore
      findOneWithProfile.mockImplementationOnce(() => {
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
    it('Returns created position data', async () => {
      //@ts-ignore
      create.mockImplementationOnce(() => mockedPosition);
      const response = await request(app)
        .post('/')
        .set('Accept', 'application/json')
        .send({ positionData: mockedPosition });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(mockedPosition);
    });

    it('Returns 400 is if there is no position data', async () => {
      const response = await request(app)
        .post('/')
        .set('Accept', 'application/json')
        .send(null);
      expect(response.status).toEqual(400);
      expect(response.body).toEqual({
        message: 'Данные о позиции отсутствуют',
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
        .send({ positionData: mockedPosition });
      expect(response.status).toEqual(500);
      expect(response.body).toEqual({ message: 'Server error' });
    });
  });

  describe('PUT /:positionId', () => {
    it('Returns updated position data', async () => {
      //@ts-ignore
      update.mockImplementationOnce(() => mockedPosition);
      const response = await request(app)
        .put('/1')
        .set('Accept', 'application/json')
        .send({ positionData: mockedPosition });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(mockedPosition);
    });

    it('Returns 400 is if there is no position data', async () => {
      const response = await request(app)
        .put('/1')
        .set('Accept', 'application/json')
        .send(null);
      expect(response.status).toEqual(400);
      expect(response.body).toEqual({
        message: 'Данные о позиции отсутствуют',
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
        .send({ positionData: mockedPosition });
      expect(response.status).toEqual(500);
      expect(response.body).toEqual({ message: 'Server error' });
    });
  });

  describe('DELETE /:positionId', () => {
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

  describe('GET /get-candidates/:positionId', () => {
    it('Returns candidates data', async () => {
      //@ts-ignore
      generateCandidates.mockImplementationOnce(() => []);
      const response = await request(app)
        .get('/get-candidates/1')
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual([]);
    });
    it('Returns 500 if server error occuried', async () => {
      //@ts-ignore
      generateCandidates.mockImplementationOnce(() => {
        throw new Error('Server error');
      });
      const response = await request(app)
        .get('/get-candidates/1')
        .set('Accept', 'application/json');
      expect(response.status).toEqual(500);
      expect(response.body).toEqual({ message: 'Server error' });
    });
  });

  describe('PUT /:positionId/add-candidate/:profileId', () => {
    it('Returns updated candidate data', async () => {
      //@ts-ignore
      addToCandidates.mockImplementationOnce(() => mockedPosition);
      const response = await request(app)
        .put('/1/add-candidate/2')
        .set('Accept', 'application/json')
        .send({ koef: 1 });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(mockedPosition);
    });

    it('Returns 400 if candidate koef is not passed', async () => {
      const response = await request(app)
        .put('/1/add-candidate/2')
        .set('Accept', 'application/json');
      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ message: 'Данные о коэфициенте соответсвия отсутствуют' });
    });

    it('Returns 500 if server error occuried', async () => {
      //@ts-ignore
      addToCandidates.mockImplementationOnce(() => {
        throw new Error('Server error');
      });
      const response = await request(app)
        .put('/1/add-candidate/2')
        .send({ koef: 1 });;
      expect(response.status).toEqual(500);
      expect(response.body).toEqual({ message: 'Server error' });
    });
  });

  describe('PUT /:positionId/remove-candidate/:profileId', () => {
    it('Returns candidates data', async () => {
      //@ts-ignore
      removeFromCandidates.mockImplementationOnce(() => mockedPosition);
      const response = await request(app)
        .put('/1/remove-candidate/1')
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(mockedPosition);
    });
    it('Returns 500 if server error occuried', async () => {
      //@ts-ignore
      removeFromCandidates.mockImplementationOnce(() => {
        throw new Error('Server error');
      });
      const response = await request(app)
        .put('/1/remove-candidate/1')
        .set('Accept', 'application/json');
      expect(response.status).toEqual(500);
      expect(response.body).toEqual({ message: 'Server error' });
    });
  });

    describe('PUT /:positionId/set-specialist/:profileId', () => {
    it('Returns updated position data', async () => {
      //@ts-ignore
      setProfile.mockImplementationOnce(() => mockedPosition);
      const response = await request(app)
        .put('/1/set-specialist/2');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(mockedPosition);
    });
    it('Returns 500 if server error occuried', async () => {
      //@ts-ignore
      setProfile.mockImplementationOnce(() => {
        throw new Error('Server error');
      });
      const response = await request(app)
        .put('/1/set-specialist/2');
      expect(response.status).toEqual(500);
      expect(response.body).toEqual({ message: 'Server error' });
    });
  });
});
