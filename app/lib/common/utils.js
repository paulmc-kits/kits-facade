
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

const pagination = (neighbourPage, currentPage, totalPages) => {
    const left = currentPage - neighbourPage
    const right = currentPage + neighbourPage

    const pagesToShow = []
    for (let i = 1; i <= totalPages; i++) {
        if (i == 1 || i == totalPages || i >= left && i <= right) {
            pagesToShow.push(i)
        }
    }

    let previousPage;
    const paginationWithDots = []
    for (const i of pagesToShow) {
        if (previousPage && (i - 1) != previousPage) {
                paginationWithDots.push('dots')
        }
        paginationWithDots.push(i)
        previousPage = i
    }

    return paginationWithDots
}

module.exports = {
    appendDataForAppLocals,
    getDataFromAppLocals,
    removeDataFromLocals,
    sortError,
    arrangeTagsInVerticalOrder,
    placeElementInLast,
    pagination
}