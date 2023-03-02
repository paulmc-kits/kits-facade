const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../../lib/database");
const Vocabulary = require("./vocabulary.model");

const tagNameLength = 100;
const Tag = sequelize.define(
    "tag",
    {
        id: {
            type: DataTypes.TEXT,
            primaryKey: true,
            defaultValue: UUIDV4,
        },
        name: {
            type: DataTypes.STRING(tagNameLength),
            unique: true,
            allowNull: false
        },
        vocabulary_id: {
            type: DataTypes.STRING(tagNameLength),
            references: {
                model: Vocabulary,
                key: "id"
            }
        }
    },
    {
        tableName: "tag",
    }
);

Vocabulary.hasMany(Tag, {
    foreignKey: { name: "vocabulary_id", type: DataTypes.STRING(tagNameLength) }
});
Tag.belongsTo(Vocabulary, {
    foreignKey: { name: "vocabulary_id", type: DataTypes.STRING(tagNameLength) }
})

module.exports = Tag 

