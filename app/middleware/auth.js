const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy

const { SECRET_KEY } = require('../config');
const { getUserDetail, getUserOrganizations } = require('../lib/services/ckan-user-apis');
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
        return done(null, { ...jwt_payload, userObj: { ...userObj } })
    } else {
        return done(true, false)
    }
}));

const initialize = () => passport.initialize()

const authenticate = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err || !user) {
            res.locals = appendDataForAppLocals(res.locals, { authenticated: false })
        } else {
            // info used in next middleware
            const { id, name, sysadmin } = user.userObj;
            const organizations_available = await getUserOrganizations(name, 'create_dataset')

            const userInfo = { id, name, sysadmin, authorisedUser: organizations_available?.length ? true : false, organisationName: organizations_available?.length ? organizations_available[0].name : undefined }
            res.locals = appendDataForAppLocals(res.locals, { authenticated: true, user: userInfo })
        }
        return next()
    })(req, res, next)
}

// passport related functions finish 

module.exports = {
    initialize,
    authenticate
}