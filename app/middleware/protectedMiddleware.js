const { errors, errorsMessage } = require("../lib/error-constants");
const { saveRedisValue } = require("../lib/redis-util");
const { createError, generateQueryParamString } = require("../lib/helper");

const protectedMiddleWare = async function(req,res,next){
    if(res.locals?.authenticated) next()
    else {
        const [uniqueErrorId,error_summary] = createError({username_password: errorsMessage[errors.NOT_AUTHORISED]})
        const save = await saveRedisValue(uniqueErrorId, error_summary);
        return res.redirect(`/login${generateQueryParamString({"error":uniqueErrorId})}`)
    }
}

module.exports = {protectedMiddleWare}