const PublisherRequestAudit = require("../models/publisherRequestAudit.model");

const { parseDatabaseErrors } = require("../util");

const createPublisherRequestAudit = async (data, options) => {
  try {
    return await PublisherRequestAudit.create(data);
  } catch (e) {
    throw parseDatabaseErrors(e);
  }
};

module.exports = { createPublisherRequestAudit };
