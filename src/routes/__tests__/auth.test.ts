import * as express from 'express';
import * as passport from 'passport';
import * as request from 'supertest';
import authRouter from 'routes/auth';
import { getAccountByLogin } from 'services';
import * as bodyParser from 'body-parser';
import { isMatch } from 'helpers';


jest.mock('index', () => ({
  passport,
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
  redisClient: {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  },
}));

jest.mock('services', () => ({
  getAccountByLogin: jest.fn(),
}));

jest.mock('helpers', () => ({
  isMatch: jest.fn(),
  generateToken: () => 'testToken',
  generateRefreshToken: () => 'testRefreshToken',
}));

const accountData = { login: 'test', password: '12345' };
const mockedAccount = { id: 'test', login: 'test', password: 'test' };

const app = express();
app.use(bodyParser.json());
app.use(authRouter);
app.use(passport.initialize());

describe('auth API', () => {
  describe('POST /login', () => {
    it('Returns account data', async () => {
      //@ts-ignore
      getAccountByLogin.mockImplementationOnce(() => ({
        dataValues: mockedAccount,
      }));
      //@ts-ignore
      isMatch.mockImplementationOnce(() => true);
      const response = await request(app).post('/login').send(accountData);
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        success: true,
        token: 'Bearer testToken',
        refreshToken: 'testRefreshToken',
        account: mockedAccount,
      });
    });

    it('Returns 401 error if login is not correct', async () => {
      //@ts-ignore
      getAccountByLogin.mockImplementationOnce(() => null);
      const response = await request(app).post('/login').send(accountData);
      expect(response.status).toEqual(401);
      expect(response.body).toEqual({
        incorrectAuthData: true,
        message: 'Логин или пароль неправильный',
      });
    });

    it('Returns 401 error if login or password is not correct', async () => {
      //@ts-ignore
      getAccountByLogin.mockImplementationOnce(() => ({
        dataValues: mockedAccount,
      }));
      //@ts-ignore
      isMatch.mockImplementationOnce(() => false);
      const response = await request(app).post('/login').send(accountData);
      expect(response.status).toEqual(401);
      expect(response.body).toEqual({
        incorrectAuthData: true,
        message: 'Логин или пароль неправильный',
      });
    });

    it('Returns 400 error if login or password is not passed', async () => {
      const response = await request(app).post('/login').send({});
      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ message: 'Логин и пароль обязательны' });
    });
  });

  describe('DELETE /logout/:userId', () => {
    it('Deletes refresh token', async () => {
      const response = await request(app).delete('/logout/2');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ message: 'Logout completed' });
    });
  });
});
