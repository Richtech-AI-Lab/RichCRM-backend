const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const crypto = require('crypto');


beforeAll(() => {
    process.env.ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY || crypto.randomBytes(32).toString('hex');
});


passport.use(
    'user-jwtStrategy', new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.ACCESS_TOKEN_KEY
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