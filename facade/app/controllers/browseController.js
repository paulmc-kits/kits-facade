const logger = require("../lib/logger")
const { searchDatasets } = require("../lib/services/ckan-dataset-apis");
const {  getOrganizationsList } = require("../lib/ckan-api")
const { getAllUpdateFrequency, getLicenceDetails, getUpdateFrequency, getSortFields } = require('../lib/ckan-constants');
const { getTagList } = require("../lib/services/ckan-generic-apis");

const viewBrowsePage = async (req, res, next) => {
    const result = {};

    try{
        const topic_tags =  await getTagList('nap_topics')
        const transport_mode_tags =  await getTagList('nap_transport_modes')
        const road_network_tags =  await getTagList('nap_road_networks')
        const location_tags =  await getTagList('nap_locations')
        const region_tags =  await getTagList('nap_regions')
        const organization_list = await getOrganizationsList()
        const update_frequencies = await getAllUpdateFrequency() 

        const paramValues = req.query
        const {q, sort} = paramValues
        const filteredDatasets = await searchDatasets(q,sort)
       logger.info(`filteredDatasets Length: ${filteredDatasets.results.length}`)

       const sortedFilteredResult = filteredDatasets.results.map(dataset=> {
        const { locations , regions ,update_frequency,organization,license_id,...rest } = dataset
        const licenceDetail  = getLicenceDetails(license_id)
        const updateFrequency = getUpdateFrequency(update_frequency)
        return {...rest, locations, regions, update_frequency:updateFrequency? updateFrequency.name:"", organization, licence:{type:licenceDetail ? licenceDetail.type : ""}}
       })

        res.render('browse.njk',{filteredDatasets: sortedFilteredResult,datasetCount:filteredDatasets.count,topic_tags,transport_mode_tags,road_network_tags,location_tags,region_tags,organization_list,update_frequencies, sortFields:getSortFields(),paramValues})
    }catch (err) {
        logger.error(`All Datasets ERROR: ${err}`)
        next(err)
    }
}

module.exports={
    viewBrowsePage
}