const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../../lib/database");

const PublisherRequestAudit = sequelize.define(
  "publisher_requests_audit",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    request: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: { notEmpty: true },
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    audit_entry: {
      type: DataTypes.JSON,
    },
    user: {
      type: DataTypes.TEXT,
    }
  },
  {
    tableName: "_ftd_publisher_requests_audit",
  }
);

PublisherRequestAudit.sync();

module.exports = PublisherRequestAudit;
