const { callApiPost, callApiGet } = require("../ckan-api");


const getDatasetDetails = (datasetName) => callApiGet(`/action/package_show?id=${datasetName}`)
const createDataset = (userApiKey, datasetPayload) => callApiPost(`/action/package_create`, true, userApiKey, datasetPayload)
const searchDatasets = (q="",sort="",rows=20) => callApiGet(`/action/package_search?q=${q}&rows=${rows}&sort=${sort}`)

module.exports = {
    getDatasetDetails,
    createDataset,
    searchDatasets
}