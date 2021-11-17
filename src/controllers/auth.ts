import * as jwt from 'jsonwebtoken';
import { keys } from 'config';
import { redisClient } from 'index';
import { TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from 'consts';
import { isMatch } from 'helpers';
import { getAccountByLogin } from 'services';

function generateToken({ id, role }) {
  return jwt.sign({ id, role }, keys.secretOrKey, {
    expiresIn: TOKEN_EXPIRES_IN,
  });
}

const generateRefreshToken = ({ id, role }) => {
  return jwt.sign({ id, role }, keys.refreshSecretOrKey, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
};

export const login = async (req, res, next) => {
  const { login, password } = req.body;
  if (!login || !password) {
    return res
      .status(400)
      .json({ message: 'Bad request. Login and password are requested.' });
  }
  const result = await getAccountByLogin(login);
  if (!result) {
    return res
      .status(401)
      .send({
        incorrectAuthData: true,
        message: 'Login or password is incorrect.',
      });
  }
  const account = result.dataValues;
  if (await isMatch(password, account.password)) {
    const token = generateToken(account);
    const refreshToken = generateRefreshToken(account);
    redisClient.set(account.id, refreshToken);
    res.status(200).json({
      success: true,
      token: 'Bearer ' + token,
      refreshToken: refreshToken,
      account,
    });
  } else {
    res
      .status(401)
      .send({
        incorrectAuthData: true,
        message: 'Login or password is incorrect',
      });
  }
};

export const refresh = (req, res) => {
  try {
    const { refreshToken, account } = req.body;
    if(!account || !refreshToken) {
      return res.status(400).send({ message: "Bad request" });
    }
    redisClient.get(account.id, (err, value) => {
      if(value === refreshToken) {
        const token = generateToken(account);
        const newRefreshToken = generateRefreshToken(account);
        redisClient.set(account.id, newRefreshToken);
        res.status(200).json({
          token: "Bearer " + token,
          refreshToken: newRefreshToken,
        });
      } else {
        res.status(403).send({ message: 'No refresh token' })
      }
    });
  } catch(e) {
    res.status(500).send({ message: 'Server error' })
  }
};

export const logout = (req, res) => {
  const { accountId } = req.params;
  redisClient.del(accountId);
  return res.status(200).send({ message: 'Logout completed' });
};
