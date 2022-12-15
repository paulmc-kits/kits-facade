const { callApiGet } = require("../ckan-api");


function getTagList(tagName) {
    return callApiGet(`/action/tag_list?vocabulary_id=${tagName}`)
}

module.exports = {
    getTagList
}