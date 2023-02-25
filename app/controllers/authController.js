const jwt  = require("jsonwebtoken")

const { SECRET_KEY } = require("../config")
const { errors, errorsMessage } = require("../lib/error-constants")
const { feedbackUrls } = require('../lib/constants')

const { verifyNameAndPassword } = require("../lib/services/ckan-auth-api");
const { getRedisCacheValue, saveRedisValue, deleteRedisValue } = require("../lib/redis-util");
const { generateQueryParamString, extractError, createError, extractForwardedData } = require("../lib/helper");



const viewLoginPage = async (req, res, next) => {
        const {error,info} = req.query
        let error_summary = {}
        let form_data = {}

        if(error){
            const errorResponse = await getRedisCacheValue(error)
            error_summary= extractError(errorResponse,"error_summary")
            await deleteRedisValue(error)
        }

        if(info){
            const formDataResponse = await getRedisCacheValue(info)
            form_data= extractForwardedData(formDataResponse,"form_data")
            await deleteRedisValue(info)
        }
        
        res.render('login.njk',{error_summary,feedbackUrls, form_data})
}

const login = async (req, res, next) => {
    try{
        const {success, userObj} = await verifyNameAndPassword(req.body.username, req.body.password)
        if(success){
            const { name } = userObj

            const token = jwt.sign({loginUsername:name,name}, SECRET_KEY, { expiresIn: "1d"}) 
            res.cookie('jwt',token)
            return res.redirect("/user/dashboard")
        }
        else throw errors.AUTH_FAILED
    }catch (error){
        if(error==errors.AUTH_FAILED){
            const [uniqueErrorId,error_summary] = createError({username_password: errorsMessage[errors.AUTH_FAILED]})
            const save = await saveRedisValue(uniqueErrorId, error_summary);

            return res.redirect(`/login${generateQueryParamString({"error":uniqueErrorId})}`)
        }
    }
}

const logout = (req, res) => {
    res.clearCookie('jwt')
    res.render("logout.njk",{feedbackUrls})
}

module.exports = {
    login,
    viewLoginPage,
    logout
}