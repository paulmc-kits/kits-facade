const logger = require("../logger")
const { callApiPost, callApiGet } = require("../ckan-api");


const getDatasetDetails = (datasetName) => callApiGet(`/action/package_show?id=${datasetName}`)
const createDataset = (userApiKey, datasetPayload) => callApiPost(`/action/package_create`, true, userApiKey, datasetPayload)
const searchDatasets = (q="",selectedTopics=[], selectedTransportModes=[],selectedRoadNetworks=[],selectedLocations=[],selectedRegions=[],startDate,endDate,selectedUpdateFrequencies=[],selectedOrganisations=[], sort="metadata_modified desc",rows,start=0) => {
    let queryFilters = "";
    queryFilters = appendSelectedTopicsToQuery(selectedTopics, queryFilters);
    queryFilters = appendSelectedTransportModesToQuery(selectedTransportModes,queryFilters);
    queryFilters = appendSelectedRoadNetworksToQuery(selectedRoadNetworks,queryFilters);
    queryFilters = appendSelectedLocationsToQuery(selectedLocations,queryFilters);
    queryFilters = appendSelectedRegionsToQuery(selectedRegions,queryFilters);
    queryFilters = appendSelectedUpdateFrequenciesToQuery(selectedUpdateFrequencies,queryFilters);
    queryFilters = appendSelectedOrganisationsToQuery(selectedOrganisations,queryFilters);
    let timePeriod = buildTimePeriodQueryParameter(startDate,endDate);
    
    const searchUrl = `/action/package_search?q=${q}&fq=${queryFilters}${timePeriod}&rows=${rows}&sort=${sort}&start=${start}`;
    return callApiGet(searchUrl)
}
const updateDataset = (userApiKey,id,datasetPayload) => callApiPost(`/action/package_update?id=${id}&return_package_dict=true`,true,userApiKey,datasetPayload)
const deleteDataset = (id="",userApiKey) => callApiPost(`/action/package_delete`, true, userApiKey, {id})

module.exports = {
    getDatasetDetails,
    createDataset,
    searchDatasets,
    updateDataset,
    deleteDataset
}

function appendSelectedTopicsToQuery(selectedTopics, query) {
    let topics = [];
    if (Array.isArray(selectedTopics) && selectedTopics.length > 0) {
        topics = selectedTopics;
    } else if (selectedTopics !== undefined && selectedTopics.length > 0) {
        topics = selectedTopics.split(",");
    }
    if (topics.length > 0) {
        query = query + 'vocab_nap_topics:"' + topics.join('" vocab_nap_topics:"') + '"';
    }
    return query;
}

function appendSelectedTransportModesToQuery(selectedTransportModes, query) {
    let transportModes = [];
    if (Array.isArray(selectedTransportModes) && selectedTransportModes.length > 0) {
        transportModes = selectedTransportModes;
    } else if (selectedTransportModes !== undefined && selectedTransportModes.length > 0) {
        transportModes = selectedTransportModes.split(",");
    }
    if (transportModes.length > 0) {
        if (query != ""){
            query = query + " ";
        }
        query = query + 'vocab_nap_transport_modes:"' + transportModes.join('" vocab_nap_transport_modes:"') + '"';
    }
    return query;
}

function appendSelectedRoadNetworksToQuery(selectedRoadNetworks, query) {
    let roadNetworks = [];
    if (Array.isArray(selectedRoadNetworks) && selectedRoadNetworks.length > 0) {
        roadNetworks = selectedRoadNetworks;
    } else if (selectedRoadNetworks !== undefined && selectedRoadNetworks.length > 0) {
        roadNetworks = selectedRoadNetworks.split(",");
    }
    if (roadNetworks.length > 0) {
        if (query != ""){
            query = query + " ";
        }
        query = query + 'vocab_nap_road_networks:"' + roadNetworks.join('" vocab_nap_road_networks:"') + '"';
    }
    return query;
}

function appendSelectedLocationsToQuery(selectedLocations, query) {
    let locations = [];
    if (Array.isArray(selectedLocations) && selectedLocations.length > 0) {
        locations = selectedLocations;
    } else if (selectedLocations !== undefined && selectedLocations.length > 0) {
        locations = selectedLocations.split(",");
    }
    if (locations.length > 0) {
        if (query != ""){
            query = query + " ";
        }
        query = query + 'vocab_nap_locations:"' + locations.join('" vocab_nap_locations:"') + '"';
    }
    return query;
}

function appendSelectedRegionsToQuery(selectedRegions, query) {
    let regions = [];
    if (Array.isArray(selectedRegions) && selectedRegions.length > 0) {
        regions = selectedRegions;
    } else if (selectedRegions !== undefined && selectedRegions.length > 0) {
        regions = selectedRegions.split(",");
    }
    if (regions.length > 0) {
        if (query != ""){
            query = query + " ";
        }
        query = query + 'vocab_nap_regions:"' + regions.join('" vocab_nap_regions:"') + '"';
    }
    return query;
}

function appendSelectedUpdateFrequenciesToQuery(selectedUpdateFrequencies, query) {
    let updateFrequencies = [];
    if (Array.isArray(selectedUpdateFrequencies) && selectedUpdateFrequencies.length > 0) {
        updateFrequencies = selectedUpdateFrequencies;
    } else if (selectedUpdateFrequencies !== undefined && selectedUpdateFrequencies.length > 0) {
        updateFrequencies = selectedUpdateFrequencies.split(",");
    }
    if (updateFrequencies.length > 0) {
        if (query != ""){
            query = query + " ";
        }
        query = query + 'update_frequency:"' + updateFrequencies.join('" update_frequency:"') + '"';
    }
    return query;
}

function appendSelectedOrganisationsToQuery(selectedOrganisations, query) {
    let organisations = [];
    if (Array.isArray(selectedOrganisations) && selectedOrganisations.length > 0) {
        organisations = selectedOrganisations;
    } else if (selectedOrganisations !== undefined && selectedOrganisations.length > 0) {
        organisations = selectedOrganisations.split(",");
    }
    if (organisations.length > 0) {
        if (query != ""){
            query = query + " ";
        }
        query = query + 'organization:"' + organisations.join('" organization:"') + '"';
    }
    return query;
}

function buildTimePeriodQueryParameter(startDate, endDate){
    let timePeriodQuery = '';
    if (startDate !== undefined && endDate !== undefined ){
        timePeriodQuery = '&ext_startdate='+startDate+'&ext_enddate='+endDate;
    }
    return timePeriodQuery;
}