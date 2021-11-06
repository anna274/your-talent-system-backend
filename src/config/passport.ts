import * as jwt from 'passport-jwt';
import { keys } from 'config';
import { AUTH_STRATEGY, REFRESH_STRATEGY } from 'consts';
import { logger } from 'index';

const opts : jwt.StrategyOptions = {
  secretOrKey: keys.secretOrKey,
  jwtFromRequest: jwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const refershOpts : jwt.StrategyOptions = {
  jwtFromRequest: jwt.ExtractJwt.fromBodyField('refreshToken'),
  secretOrKey: keys.refreshSecretOrKey
};

const passportConfig = passport => {
  passport.use(
    AUTH_STRATEGY,
    new jwt.Strategy(opts, async (jwt_payload, done) => {
      try {
        // const user = await getUserById(jwt_payload.id);
        const user = {}
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch(e) {
        logger.error(e);
      }
    })
  );
  passport.use(
    REFRESH_STRATEGY,
    new jwt.Strategy(refershOpts, async (jwt_payload, done) => {
      return done(null, jwt_payload.id);
    })
  );
};

export { passportConfig };