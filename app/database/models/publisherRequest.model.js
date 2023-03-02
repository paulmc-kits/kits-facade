const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../../lib/database");

const { publisherApprovalStatuses } = require("../database-constants");

const PublisherRequest = sequelize.define(
  "publisher_request",
  {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    full_name: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true },
    },
    email_address: {
      type: DataTypes.STRING,
      unique: {
        msg: 'This email_address is already taken.',
        fields: ['email_address']
      },
      validate: {
        isEmail: true,
      },
    },
    organisation_name: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true },
    },
    admin_notified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: Object.keys(publisherApprovalStatuses).map((value) => value),
    },
  },
  {
    tableName: "_ftd_publisher_requests",
  }
);

PublisherRequest.sync();

module.exports = PublisherRequest;
