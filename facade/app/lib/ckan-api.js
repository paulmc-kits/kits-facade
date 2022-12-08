const logger = require('./logger')

const ckanApiUrl = process.env.CKAN_API_URL
const apiUrl = ckanApiUrl + '/api/3'
const apiKey = process.env.CKAN_API_KEY

function getDatasetDetails(datasetName) {
    return callApiGet('/action/package_show?id=' + datasetName)
}

async function callApiGet(path, elevated = false) {
    const url = apiUrl + path

    let headers = {}
    if (elevated) {
        headers = {
            headers: { 'X-CKAN-API-Key': apiKey }
        }
    }

    logger.info(`callApiGet: ${url}`)
    const response = await fetch(url, headers)

    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }

    const jsonResponse = await response.json()
    logger.info(`jsonResponse: ${JSON.stringify(jsonResponse)}`)
    const parsedCKANResponse = parseCKANResponse(jsonResponse)

    return parsedCKANResponse
}

function parseCKANResponse(response) {
    if (response.success) {
        return response.result
    } else {
        return []
    }
}

module.exports = {
    getDatasetDetails
}