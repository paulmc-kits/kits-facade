const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../../lib/database");
const Package = require("./package.model");
const Tag = require("./tag.model");

const PackageTag = sequelize.define(
  "package_tag",
    {
      id: {
        type: DataTypes.TEXT,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      state: {
        type: DataTypes.TEXT
      },
      package_id: {
        type: DataTypes.TEXT,
        references: {
          model: Package,
          key: "id"
        }
      },
      tag_id: {
        type: DataTypes.TEXT,
        references: {
          model: Tag,
          key: "id"
        }
      },
    },
    {
      tableName: "package_tag",
    }
);

Package.belongsToMany(Tag, {
  through:PackageTag,
  foreignKey:'package_id',
  otherKey:'tag_id'
})

Tag.belongsToMany(Package, {
  through:PackageTag,
  foreignKey:'tag_id',
  otherKey:'package_id'
})

module.exports = PackageTag
