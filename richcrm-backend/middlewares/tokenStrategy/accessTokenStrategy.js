const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const crypto = require('crypto');
const accessKey =  process.env.ACCESS_TOKEN_KEY || crypto.randomBytes(64).toString('hex');

passport.use(
    'user-jwtStrategy', new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: accessKey,
        },
        async function (jwtPayload, done) {
            if (jwtPayload === null || jwtPayload === undefined) {
                done(null, false, { message: 'Token missing' });
            }
        
            if (jwtPayload.exp <= Date.now() / 1000) {
                done(null, false, { message: 'Token expired' });
            }
        
            done(null, jwtPayload);
        }
    )
);

module.exports = passport;