const logger = require("../lib/logger")

const { getTimePeriod, formatDate } = require("../lib/formatters")
const { getDataFromAppLocals, sortError,  arrangeTagsInVerticalOrder, placeElementInLast } = require("../lib/common/utils")
const { getUpdateFrequency, getAllLicenceDetails, getAllUpdateFrequency, getLicenceDetails } = require("../lib/ckan-constants")
const { createError, extractError, generateQueryParamString, createDataToPassForward, extractForwardedData } = require("../lib/helper")
const { getRedisCacheValue, deleteRedisValue, saveRedisValue } = require("../lib/redis-util")
const { feedbackUrls } = require('../lib/constants')

const { getTagList } = require("../lib/services/ckan-generic-apis")
const { createDataset, getDatasetDetails, updateDataset ,deleteDataset} = require("../lib/services/ckan-dataset-apis")
const { getUserDatasets, getUserOrganizations, getUserDetail, getUserApiKey } = require("../lib/services/ckan-user-apis")

const dashboardView = async (req, res, next) => {
    try {
        const userData = getDataFromAppLocals(res.locals, 'user')
        const result = await getUserDatasets(userData.name)

        result.datasets = result.datasets.map((dataset) => {
            dataset.time_period = getTimePeriod(dataset)

            if (dataset.update_frequency) {
                const updateFrequency = getUpdateFrequency(dataset.update_frequency)
                dataset.update_frequency = updateFrequency ? updateFrequency.name : ""
            }
            if (dataset.license_id) {
                dataset.licence = getLicenceDetails(dataset.license_id)
            }
            if (dataset.metadata_created) {
                dataset.metadata_created_formatted = formatDate(dataset.metadata_created, "dd/MM/yyyy")
            }

            if (dataset.metadata_modified) {
                dataset.metadata_modified_formatted = formatDate(dataset.metadata_modified, "dd/MM/yyyy")
            }

            const { time_period, update_frequency, organization, licence, ...rest } = dataset
            return { ...rest, time_period, update_frequency, organization, licence }
        })
        
        res.render('dashboard.njk',{userData,user_info_with_datasets:result,feedbackUrls})
    }catch (err){
        logger.error(`Dashboard ERROR: ${err}`)
        next(err)
    }
}

const createAndUpdateDatasetPageView = async (req, res, next) => {
    try {
        const {error,info} = req.query
        let error_summary = {}
        let form_data = {}

        if(error){
            const errorResponse = await getRedisCacheValue(error)
            error_summary= extractError(errorResponse,"error_summary")
            await deleteRedisValue(error)
        }
        
        if(info){
            const formDataResponse = await getRedisCacheValue(info)
            form_data= extractForwardedData(formDataResponse,"form_data")
            await deleteRedisValue(info)
        }

        const userData = getDataFromAppLocals(res.locals, 'user')

        if(req.params.datasetId && req.params.datasetId !== "undefined"){
            const result = await getDatasetDetails(req.params.datasetId)
            form_data = result
        }

        const organizations_available = await getUserOrganizations(userData.name, 'create_dataset')
        const topic_tags = await getTagList('nap_topics')
        const transport_mode_tags = await getTagList('nap_transport_modes')
        const road_network_tags = await getTagList('nap_road_networks')
        const location_tags = await getTagList('nap_locations')
        const region_tags = await getTagList('nap_regions')
        const licences = getAllLicenceDetails()


        if (form_data.topics && !Array.isArray(form_data.topics)) {
            form_data.topics = [form_data.topics]
        }

        if (form_data.transport_modes && !Array.isArray(form_data.transport_modes)) {
            form_data.transport_modes = [form_data.transport_modes]
        }


        if (form_data.road_networks && !Array.isArray(form_data.road_networks)) {
            form_data.road_networks = [form_data.road_networks]
        }

        res.render('dataset-new/index.njk', { userData,error_summary, form_data, organizations_available, licences, data_licences_list: getAllLicenceDetails(), frequencies: getAllUpdateFrequency(), topic_tags: arrangeTagsInVerticalOrder(topic_tags), transport_mode_tags: placeElementInLast(transport_mode_tags), road_network_tags: placeElementInLast(road_network_tags), location_tags: arrangeTagsInVerticalOrder(location_tags), region_tags: arrangeTagsInVerticalOrder(region_tags) })
    } catch (err) {
        logger.error(`Create Dataset ERROR: ${err}`)
        next(err)
    }
}

const createAndUpdatePackage = async (req, res, next) => {
    try {
        const userData = getDataFromAppLocals(res.locals, 'user')
        let userApiKey = null;


        if (userData.name) {
            try {
                const { apikey } = await getUserDetail(userData.name)
                userApiKey = apikey;

                if (!userApiKey) {
                    // generate user api key
                    const { apikey } = await getUserApiKey(userData.name)
                    userApiKey = apikey
                }

            } catch (err) {
                next(err)
                return
            }

            const packageData = { ...req.body }
            const packageName = packageData.title.toLowerCase().replace(/ /g, "-")
            packageData.name = `${packageName}-${Date.now().toString(16)}`

            if(req.params.datasetId && req.params.datasetId !== "undefined"){
                packageData.id = req.params.datasetId
            }
            const response =  req.params.datasetId && req.params.datasetId  !== "undefined"? await updateDataset(userApiKey,req.params.datasetId,packageData) : await createDataset(userApiKey, packageData) 
            return res.redirect(`/dataset/detail/${response.name}`)
        }

    } catch (err) {
        logger.error(`create dataset Error ${err}`)
        const { status, info } = JSON.parse(err.message)
        if (status != 400 && info.__type == 'Validation Error') {
            
            const [uniqueErrorId,error_summary] =  createError(sortError(info))
            const saveError = await saveRedisValue(uniqueErrorId, error_summary);
            
            if(req.params.datasetId && req.params.datasetId !== "undefined") res.redirect(`/dataset/edit/${req.params.datasetId}${generateQueryParamString({"error":uniqueErrorId})}`)
            else{
                const [formDataId,form_data] =  createDataToPassForward({ ...req.body },"form_data")
                const save = await saveRedisValue(formDataId, form_data);
                
                res.redirect(`/dataset/new${generateQueryParamString({"error":uniqueErrorId,"info":formDataId})}`)
            }
        }
        else next(err)
    }
}

const deletePackage = async (req, res, next) => {
    try {
        const userData = getDataFromAppLocals(res.locals, 'user')
        const { apikey } = await getUserDetail(userData.name, false)

        const { deleteId: packageId } = { ...req.body }
        const response = await deleteDataset(packageId, apikey)
        return res.redirect(`/user/dashboard`)

    }
    catch (e) {
        logger.error(`delete dataset Error ${e}`)
    }
}


module.exports = {
    dashboardView,
    createAndUpdateDatasetPageView,
    createAndUpdatePackage,
    deletePackage
}