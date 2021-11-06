import { addAliases } from "module-alias";

addAliases({
  "routes": `${__dirname}/routes`,
  "models": `${__dirname}/models`,
  "controllers": `${__dirname}/controllers`,
  "services": `${__dirname}/services`,
  "helpers": `${__dirname}/helpers`,
  "config": `${__dirname}/config`,
  "consts": `${__dirname}/consts`,
  "index": `${__dirname}/index`,
});

import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import * as redis from 'redis';
import * as http from 'http';
import { getLogger } from 'log4js';
import { keys, passportConfig } from 'config';
import { default as indexRouter } from 'routes'

const app = express();
const server = http.createServer(app);
const logger = getLogger();
logger.level = "debug";

app.use(cors());
app.use(bodyParser.urlencoded(
  {
  extended: true
  }
));
app.use(bodyParser.json());
app.use(passport.initialize());
passportConfig(passport);

const redisClient = redis.createClient(keys.REDIS_URL);
redisClient.on("connect", () => logger.debug("Redis plugged in."));
redisClient.on("error", (error) => logger.error(error));

async function start(){
  try {
    server.listen(keys.PORT, () => {
      logger.debug(`listening on the port ${ keys.PORT }`);
    });

  } catch(e) {
    logger.error(e);
  }
}

start();

app.use('/api', indexRouter);

export { passport, redisClient, logger };

