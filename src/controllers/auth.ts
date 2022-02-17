import { redisClient } from 'index';
import { isMatch, generateRefreshToken, generateToken } from 'helpers';
import { getAccountByLogin } from 'services';

export const login = async (req, res, next) => {
  const { login, password } = req.body;
  if (!login || !password) {
    res.status(400).send({ message: 'Логин и пароль обязательны' });
    return;
  }
  const result = await getAccountByLogin(login);
  if (!result) {
    res.status(401).send({
      incorrectAuthData: true,
      message: 'Логин или пароль неправильный',
    });
    return;
  }
  const account = result.dataValues;
  if (await isMatch(password, account.password)) {
    const token = generateToken(account);
    const refreshToken = generateRefreshToken(account);
    redisClient.set(account.id, refreshToken);
    res.status(200).send({
      success: true,
      token: 'Bearer ' + token,
      refreshToken: refreshToken,
      account,
    });
  } else {
    res.status(401).send({
      incorrectAuthData: true,
      message: 'Логин или пароль неправильный',
    });
  }
};

export const refresh = (req, res) => {
  try {
    const { refreshToken, account } = req.body;
    if (!account || !refreshToken) {
      return res.status(400).send({ message: 'Отсутствуют данные о аккаунте или токене' });
    }
    redisClient.get(account.id, (err, value) => {
      if (value === refreshToken) {
        const token = generateToken(account);
        const newRefreshToken = generateRefreshToken(account);
        redisClient.set(account.id, newRefreshToken);
        res.status(200).json({
          token: 'Bearer ' + token,
          refreshToken: newRefreshToken,
        });
      } else {
        res.status(403).send({ message: 'No refresh token' });
      }
    });
  } catch (e) {
    res
      .status(500)
      .send({
        message: 'Упс, ошибка сервера. Попробуйте перезагрузить страницу',
      });
  }
};

export const logout = (req, res) => {
  const { accountId } = req.params;
  redisClient.del(accountId);
  return res.status(200).send({ message: 'Logout completed' });
};
