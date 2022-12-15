const { verify } = require("node-passlib");

const { getUserDetail } = require("../services/ckan-user-apis");
const logger = require("../logger");

async function verifyNameAndPassword(name, password) {
    try {
        const userObj = await getUserDetail(name, true)
        return { success: verify(password, userObj.password_hash), userObj }
    } catch (err) {
        logger.error(`login api ERROR: ${err}`)
        return { success: false, userObj: {} }

    }
}

module.exports = {
    verifyNameAndPassword
}