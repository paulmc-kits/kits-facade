const { callApiGet, callApiPost } = require("../ckan-api");


const getUserDatasets = (name) => callApiGet(`/action/user_show?id=${name}&include_datasets=true`)
const getUserDetail = (name, passwordHash = false) => callApiGet(`/action/user_show?id=${name}&include_password_hash=${passwordHash}`,true)
const getUserNameByEmail = (email) => callApiGet(`/action/user_list?email=${email}`,true)
const getUserOrganizations = (userId, permission) => callApiGet(`/action/organization_list_for_user?id=${userId}&permission=${permission}`)
const getUserApiKey = (name) => callApiPost(`/action/user_generate_apikey`, true, "", { id:name })


module.exports = {
    getUserDatasets,
    getUserDetail,
    getUserNameByEmail,
    getUserOrganizations,
    getUserApiKey

}