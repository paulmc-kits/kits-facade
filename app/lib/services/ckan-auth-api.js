const { verify } = require("node-passlib");
const logger = require("../logger");

const { getUserDetail, getUserNameByEmail } = require("../services/ckan-user-apis");

const { errors } = require("../error-constants");
const { validateEmail } = require("../helper");

async function verifyNameAndPassword(name, password) {
    try {
        let username = await checkNameIsEmail(name);
        const userObj = await getUserDetail(username, true)
        return { success: verify(password, userObj.password_hash), userObj }
    } catch (err) {
        logger.error(`login api ERROR: ${err}`)
        return { success: false, userObj: {} }
    }
}

async function checkPublisherEmailExists(email){
    if(validateEmail(email)){
        try{
            let response = await getUserNameByEmail(email);
            if (response.length > 0){
                return true;
            }
            return false;
        }catch(e) {
            throw errors.API_FAILED
        }
    }else{
        throw errors.EMAIL_NOT_VALID
    }
   
}

async function checkNameIsEmail(name){
    if (name.includes('@')){
        let response = await getUserNameByEmail(name);
        return response[0].name;
    }else{
        return name;
    }
}


module.exports = {
    verifyNameAndPassword,
    checkPublisherEmailExists
}