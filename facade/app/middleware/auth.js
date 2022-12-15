const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy

const { SECRET_KEY } = require('../config');
const { getUserDetail } = require('../lib/services/ckan-user-apis');
const { appendDataForAppLocals } = require('../lib/common/utils');
const { errors, errorsMessage } = require('../lib/error-constants');

// passport related functions  

const getCookieFromHeader = (req) => {
    let cookies = {}
    req.headers.cookie.split(";").forEach((cookie) => {
        cookie.trim()
        const splitCookie = cookie.split('=')
        cookies = { ...cookies, [splitCookie[0].trim()]: splitCookie[1].trim() }
    })
    return cookies
}

const extractJwtFromCookie = req => {
    let jwt = null 

    if (req && req.headers.cookie) {
      jwt = getCookieFromHeader(req)['jwt']
    }
    return jwt
}

const opts = {
    jwtFromRequest: extractJwtFromCookie,
    secretOrKey: SECRET_KEY
}

passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
    const userObj = await getUserDetail(jwt_payload.loginUsername)
    if (!Array.isArray(userObj) && Object.keys(userObj).length && jwt_payload.name === userObj.name) {
        return done(null, { ...jwt_payload, userObj: { name: userObj.name } })
    } else {
        return done(true, false)
    }
}));

const initialize = () => passport.initialize()

const authenticate = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err || !user) {
            res.app.locals = appendDataForAppLocals(res.app.locals, { error_summary: [errorsMessage[errors.NOT_AUTHORISED]] })
            return res.redirect('/login')
        }
        // info used in next middleware
        res.locals = appendDataForAppLocals(res.locals, { user: user.userObj })
        return next()
    })(req, res, next)
}

// passport related functions finish 

module.exports = {
    initialize,
    authenticate
}