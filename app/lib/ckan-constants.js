const licences = [
    {'type':'Free', 'name': 'Creative Commons Attribution', 'value': 'cc-by'},
    {'type':'Free', 'name': 'Creative Commons Attribution Share-Alike', 'value': 'cc-by-sa'},
    {'type':'Free', 'name': 'Creative Commons CCZero', 'value': 'cc-zero'},
    {'type':'Free', 'name': 'Creative Commons Non-Commercial (Any)', 'value': 'cc-nc'},
    {'type':'Free', 'name': 'GNU Free Documentation Licence', 'value': 'gfdl'},
    {'type':'Free', 'name': 'Licence not specified', 'value': 'notspecified'},
    {'type':'Free', 'name': 'Open Data Commons Attribution Licence', 'value': 'odc-by'},
    {'type':'Free', 'name': 'Open Data Commons Open Database Licence (ODbL)', 'value': 'odc-odbl'},
    {'type':'Free', 'name': 'Open Data Commons Public Domain Dedication and Licence (PDDL)', 'value': 'odc-pddl'},
    {'type':'Free', 'name': 'Other (Attribution)', 'value': 'other-at'},
    {'type':'Free', 'name': 'Other (Non-Commercial)', 'value': 'other-nc'},
    {'type':'Free', 'name': 'Other (Open)', 'value': 'other-open'},
    {'type':'Free', 'name': 'Other (Public Domain)', 'value': 'other-pd'},
    {'type':'Free', 'name': 'UK Open Government Licence (OGL)', 'value': 'uk-ogl'},
    {'type':'Commercial', 'name': 'Commercial Licence', 'value': 'commercial'},
    {'type':'Closed', 'name': 'Other (Not open)', 'value': 'other-closed'},
]
function getLicenceDetails(licenceID) {
    return licences.find(data => data.value == licenceID)
}

const updateFrequencies = [
    {'name': 'Live', 'value': 'live'},
    {'name': 'Daily', 'value': 'daily'},
    {'name': 'Weekly', 'value': 'weekly'},
    {'name': '2 Weekly', 'value': '2weekly'},
    {'name': '4 Weekly', 'value': '4weekly'},
    {'name': 'Monthly', 'value': 'monthly'},
    {'name': 'Quarterly', 'value': 'quarterly'},
    {'name': '6 Monthly', 'value': '6monthly'},
    {'name': 'Yearly', 'value': 'yearly'}
]
function getUpdateFrequency(frequency) {
    return updateFrequencies.find(data => data.value == frequency)
}

module.exports = {
    getLicenceDetails,
    getUpdateFrequency
}