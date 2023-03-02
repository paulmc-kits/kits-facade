const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../../lib/database");

const packageNameLength = 100
const packageVersionLength = 100

const Package = sequelize.define(
  "package",
  {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    name: {
      type: DataTypes.STRING(packageNameLength),
      unique: true,
      allowNull: false
    },
    title: {
      type: DataTypes.TEXT,

    },
    version: {
      type: DataTypes.STRING(packageVersionLength)
    },
    url: {
      type: DataTypes.TEXT
    },
    author: {
      type: DataTypes.TEXT
    },
    author_email: {
      type: DataTypes.TEXT
    },
    maintainer: {
      type: DataTypes.TEXT
    },
    maintainer_email: {
      type: DataTypes.TEXT
    },
    notes: {
      type: DataTypes.TEXT
    },
    license_id: {
      type: DataTypes.TEXT
    },
    type: {
      type: DataTypes.TEXT
    },
    owner_org: {
      type: DataTypes.TEXT
    },
    creator_user_id: {
      type: DataTypes.TEXT
    },
    metadata_creator: {
      type: DataTypes.DATE,
    },
    metadata_modified: {
      type: DataTypes.DATE
    },
    private: {
      type: DataTypes.BOOLEAN
    },
    state: {
      type: DataTypes.TEXT
    }
  },
  {
    tableName: "package",
  }
);


module.exports = Package
