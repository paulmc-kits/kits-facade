const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../../lib/database");

const vocabularyNameLength = 100

const Vocabulary = sequelize.define(
  "vocabulary",
  {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    name: {
      type: DataTypes.STRING(vocabularyNameLength),
    }
  },
  {
    timestamps:false,
    createdAt:false,
    updatedAt:false,
    tableName: "vocabulary",
  },
);


module.exports = Vocabulary