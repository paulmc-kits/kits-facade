const logger = require("../lib/logger")
const { searchDatasets } = require("../lib/services/ckan-dataset-apis");
const { getOrganizationsList } = require("../lib/ckan-api")
const { getAllUpdateFrequency, getLicenceDetails, getUpdateFrequency, getSortFields } = require('../lib/ckan-constants');
const { getTagList } = require("../lib/services/ckan-generic-apis");
const { getDataFromAppLocals, pagination } = require("../lib/common/utils");

const viewBrowsePage = async (req, res, next) => {
    const result = {};
    const rows = 20
    try {

        const userData = getDataFromAppLocals(res.locals, 'user')
        const topic_tags = await getTagList('nap_topics')
        const transport_mode_tags = await getTagList('nap_transport_modes')
        const road_network_tags = await getTagList('nap_road_networks')
        const location_tags = await getTagList('nap_locations')
        const region_tags = await getTagList('nap_regions')
        const organization_list = await getOrganizationsList()
        const update_frequencies = await getAllUpdateFrequency()

        const paramValues = req.query
        const { q, selectedTopics, selectedTransportModes, selectedRoadNetworks, selectedLocations, selectedRegions, startDate, endDate, selectedUpdateFrequencies, selectedOrganisations, sort, page: currentPage = 1 } = paramValues
        const start = rows * (currentPage - 1)
        const filteredDatasets = await searchDatasets(q, selectedTopics, selectedTransportModes, selectedRoadNetworks, selectedLocations, selectedRegions, startDate, endDate, selectedUpdateFrequencies, selectedOrganisations, sort, rows, start)
        logger.info(`filteredDatasets Length: ${filteredDatasets.results.length}`)



        const sortedFilteredResult = filteredDatasets.results.map(dataset => {
            const { locations, regions, update_frequency, organization, license_id, ...rest } = dataset
            const licenceDetail = getLicenceDetails(license_id)
            const updateFrequency = getUpdateFrequency(update_frequency)
            return { ...rest, locations, regions, update_frequency: updateFrequency ? updateFrequency.name : "", organization, licence: { type: licenceDetail ? licenceDetail.type : "" } }
        })

        // Pagination functionality
        const numberOfPages = Math.ceil(filteredDatasets.count / rows)
        const neighbourPage = 2
        const pages = pagination(Number(neighbourPage), Number(currentPage), numberOfPages)

        res.render('browse.njk', { numberOfPages, pages, currentPage, userData, filteredDatasets: sortedFilteredResult, datasetCount: filteredDatasets.results.length, topic_tags, transport_mode_tags, road_network_tags, location_tags, region_tags, organization_list, update_frequencies, selectedTopics, selectedTransportModes, selectedRoadNetworks, selectedLocations, selectedRegions, startDate, endDate, selectedUpdateFrequencies, selectedOrganisations, sortFields: getSortFields(), paramValues })
    } catch (err) {
        logger.error(`All Datasets ERROR: ${err}`)
        next(err)
    }
}

module.exports = {
    viewBrowsePage
}