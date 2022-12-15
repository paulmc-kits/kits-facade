
// generate salt crypto.randomBytes(32).toString('hex');

//save data in app locals
const appendDataForAppLocals = (locals, newData) => {
    return { ...locals, ...(newData ? newData : {}) }
}

const getDataFromAppLocals = (locals, key) => {
    if (locals && key in locals) return locals[key]
    else return null
}

const removeDataFromLocals = (locals, key) => {
    if (locals && key in locals) delete locals[key]
    else return locals
}

// save data in app locals finish

// sort error object
const sortError = (errors) => {
    const sortedError = {}

    if (Object.keys(errors).length) {
        Object.keys(errors).sort((a, b) => errors[a][0].split('|')[0] - errors[b][0].split('|')[0]).forEach((a) => { sortedError[a] = errors[a][0].split("|")[1] })
    }
    return sortedError
}

const arrangeTagsInVerticalOrder = (tagList) => {
    if (tagList && Array.isArray(tagList)) {

        tagList = placeElementInLast(tagList, "Other")

        const tagListLength = tagList.length
        const halfTagListLength = Math.ceil(tagListLength / 2)
        const firstHalfTags = tagList.splice(0, halfTagListLength)

        const newVerticalSortedTagList = []

        firstHalfTags.forEach((a, i) => {

            newVerticalSortedTagList.push(a)
            if (tagList[i]) newVerticalSortedTagList.push(tagList[i])
        })
        return newVerticalSortedTagList
    }

    return []
}

const placeElementInLast = (tagList, elementName = 'Other') => {
    if (tagList && Array.isArray(tagList)) {

        const extractElementIndex = tagList.indexOf(elementName)
        let extractElement = null
        if (extractElementIndex !== -1) extractElement = tagList.splice(extractElementIndex, 1)
        extractElement && tagList.push(extractElement[0])
        return tagList
    }

    return tagList
}

module.exports = {
    appendDataForAppLocals,
    getDataFromAppLocals,
    removeDataFromLocals,
    sortError,
    arrangeTagsInVerticalOrder,
    placeElementInLast
}