const jwt  = require("jsonwebtoken")

const { SECRET_KEY } = require("../config")
const { appendDataForAppLocals, getDataFromAppLocals, removeDataFromLocals } = require("../lib/common/utils")
const { errors, errorsMessage } = require("../lib/error-constants")
const { feedbackUrls } = require('../lib/constants')

const logger = require("../lib/logger")
const { verifyNameAndPassword } = require("../lib/services/ckan-auth-api")

const viewLoginPage = async (req, res, next) => {
    const error_summary = getDataFromAppLocals(res.app.locals,"error_summary")
    res.app.locals = removeDataFromLocals(res.app.locals,'error_summary')
    res.render('login.njk',{error_summary,feedbackUrls})
}

const login = async (req, res, next) => {
    try{
        const {success, userObj} = await verifyNameAndPassword(req.body.username, req.body.password)
        if(success){
            const { name } = userObj
            // save user data
            res.app.locals = appendDataForAppLocals(res.app.locals,{user:{name}})
            const token = jwt.sign({loginUsername:req.body.username,name}, SECRET_KEY, { expiresIn: "1d"}) 
            res.cookie('jwt',token)
            return res.redirect("/user/dashboard")
        }
        else throw errors.AUTH_FAILED
    }catch (error){
        if(error==errors.AUTH_FAILED){
            res.app.locals = appendDataForAppLocals(res.app.locals,{error_summary:[errorsMessage[errors.AUTH_FAILED]]})
            return res.redirect('/login')
        }
    }
}

const logout = (req, res) => {
    res.clearCookie('jwt')
    res.app.locals = removeDataFromLocals(res.app.locals,"user")
    res.render("logout.njk",{feedbackUrls})
}

module.exports = {
    login,
    viewLoginPage,
    logout
}