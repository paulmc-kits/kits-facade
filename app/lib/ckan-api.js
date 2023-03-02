const logger = require('./logger')

const ckanApiUrl = process.env.CKAN_API_URL
const apiUrl = ckanApiUrl + '/api/3'
const apiKey = process.env.CKAN_API_KEY

function getOrganizationsList(){
    return callApiGet('/action/organization_list?all_fields=True')
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
    // @TODO error handling ?
    const response = await fetch(url, headers)

    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }

    // @TODO error handling ?
    const jsonResponse = await response.json()
    const parsedCKANResponse = parseCKANResponse(jsonResponse)

    return parsedCKANResponse
}

async function callApiPost(path, elevated = false, userApiKey, body) {
    const url = apiUrl + path

    let headers = {}
    if (elevated) {
        headers = {
            'X-CKAN-API-Key': userApiKey || apiKey,
            "Content-Type": "application/json"
        }
    }

    const requestOptions = {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        redirect: 'follow'
    };

    logger.info(`callApiPost: ${url}`)
    // @TODO error handling ?
    const response = await fetch(url, requestOptions)

    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        if (response.status != 400) {
            const jsonResponse = await response.json()
            throw new Error(JSON.stringify({ status: response.status, info: jsonResponse.error }))
        } else throw new Error(message);
    }

    // @TODO error handling ?
    const jsonResponse = await response.json()

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
    callApiGet,
    callApiPost,
    getOrganizationsList
}