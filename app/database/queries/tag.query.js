const { Tag } = require("../models")

const getAllTags = () => Tag.findAll({
    attributes: {
        exclude: ['createdAt', 'updatedAt', 'timestamps']
    },
})

const getTagWithVocabularyData = () => Tag.findAll({
    include: 'vocabulary',
    attributes: {
        exclude: ['createdAt', 'updatedAt', 'timestamps']
    },
})

const getTagByVocabularyName = (vocabularyName) => Tag.findAll({
    include: {association:'vocabulary',where:{name:vocabularyName},attributes:[['name','vocabulary_name']]},
    attributes: {
        exclude: ['createdAt', 'updatedAt', 'timestamps']
    },
})

module.exports = {
    getAllTags, getTagWithVocabularyData ,getTagByVocabularyName
}