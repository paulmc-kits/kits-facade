const { PublisherRequest } = require("../models");

const { parseDatabaseErrors } = require("../util");

const getAllPublisherRequest = () => PublisherRequest.findAll();

const getPublisherRequestByStatus = (status, start , rows , sortField) =>
  PublisherRequest.findAndCountAll({
    where: {
      status,
    },
    offset: start,
    limit: rows,
    order: sortField ? [sortField] : [],
    raw: true,
  });

const createPublisherRequest = async (data) => {
  try {
    const response = await PublisherRequest.create(data);
    return response;
  } catch (e) {
    throw parseDatabaseErrors(e);
  }
};

const updatePublisherRequest = async (data) =>
  PublisherRequest.update(data, {
    where: { email_address: data.email_address },
    returning: true,
  });

module.exports = {
  getAllPublisherRequest,
  createPublisherRequest,
  updatePublisherRequest,
  getPublisherRequestByStatus,
};
