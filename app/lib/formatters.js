const { DateTime } = require('luxon')
const  { marked } = require('marked') 

function formatDate(datetime, format) {
    // TODO: check datetime format on the way in
    // It should be in the form: 2022-09-21T13:38:00.620672

    const year = datetime.slice(0, 4)
    const month = datetime.slice(5, 7)
    const day = datetime.slice(8, 10)

    return DateTime.fromObject({ year, month, day }).toFormat(format)
}

function getTimePeriod(datasetDetails) {
    let timePeriod = ''

    if (datasetDetails.regularly_updated == 'yes') {
        if (datasetDetails.regularly_updated_earliest_year != '') {
            timePeriod = `${datasetDetails.regularly_updated_earliest_day}/${datasetDetails.regularly_updated_earliest_month}/${datasetDetails.regularly_updated_earliest_year} - Present`
        }
    } else {
        timePeriod = `${datasetDetails.date_range_earliest_day}/${datasetDetails.date_range_earliest_month}/${datasetDetails.date_range_earliest_year} - ${datasetDetails.date_range_latest_day}/${datasetDetails.date_range_latest_month}/${datasetDetails.date_range_latest_year}`
    }

    return timePeriod
}

function convertNotes(notes) {
    return marked.parse(notes)
}

module.exports = {
    convertNotes,
    formatDate,
    getTimePeriod
}