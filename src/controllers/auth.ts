import * as jwt from 'jsonwebtoken';
import { keys } from 'config';
import { redisClient } from 'index';
import { TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from 'consts';
import { isMatch } from 'helpers';

function generateToken({ id, role}) {
  return jwt.sign( { id, role } , keys.secretOrKey, { expiresIn: TOKEN_EXPIRES_IN });
}

function generateRefreshToken({ id, role}) {
  return jwt.sign( { id, role } , keys.refreshSecretOrKey, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
}

async function login(req, res, next){
  // const { login, password } = req.body;
  // if(!login || !password) {
  //   return res.status(400).json({ message: "Bad request. Login and password are requested." });
  // }
  // // const userDoc = await getUserByLogin(login);
  // const userDoc = {};
  // const user = {};
  // if (!userDoc) {
  //   return res.status(401).send({ incorrectAuthData: true, message: "Login or password is incorrect." });
  // }
  // if (await isMatch(password, user.password)) {
  //   const token = generateToken(user);
  //   const refreshToken = generateRefreshToken(user);
  //   redisClient.set(user.id, refreshToken);
  //   res.status(200).json({
  //     success: true,
  //     token: "Bearer " + token,
  //     refreshToken: refreshToken,
  //     user
  //   });
  // } else {
  //   res.status(401).send({ incorrectAuthData: true, message: "Login or password is incorrect" });
  // }
};

function refresh(req,res) {
  // try {
  //   const { refreshToken, user } = req.body;
  //   if(!user || !refreshToken) {
  //     return res.status(400).send({ message: "Bad request" });
  //   }
  //   redisClient.get(user.id, (err, value) => {
  //     if(value === refreshToken) {
  //       const token = generateToken(user);
  //       const newRefreshToken = generateRefreshToken(user);
  //       redisClient.set(user.id, newRefreshToken);
  //       res.status(200).json({
  //         token: "Bearer " + token,
  //         refreshToken: newRefreshToken,
  //       });     
  //     } else {  
  //       res.status(403).send({ message: 'No refresh token' })
  //     }
  //   });
  // } catch(e) {
  //   res.status(500).send({ message: 'Server error' })
  // }
}

function logout(req, res) {
  // const { userId } = req.params;
  // redisClient.del(userId);
  return res.status(200).send({ message: 'Logout completed'});
}

export { login, refresh, logout };
