const uuid = require("uuid");

const validateEmail = (email) =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

const isJson = (item) => {
  if (typeof item !== "string") {
    return false;
  }
  try {
    JSON.parse(item);
    return true;
  } catch (error) {
    return false;
  }
};

const dataStringify = (data) => JSON.stringify(data);

const dataParse = (data) => JSON.parse(data);

const isObject = (value) =>
  typeof value === "object" && !Array.isArray(value) && value !== null;

const generateQueryParamString = (value) =>
  isObject(value) ? `?${new URLSearchParams(value).toString()}` : `?`;

const createDataToPassForward = (data, key) => [
  uuid.v4(),
  dataStringify({ [key]: data }),
];

const extractForwardedData = (data, key) => {
  if (data && isJson(data)) {
    const parsedData = dataParse(data);
    return key in parsedData ? parsedData[key] : {};
  } else return data && key in data ? data[key] : {};
};

const extractError = (data) => extractForwardedData(data, "error_summary");

const createError = (data) => createDataToPassForward(data, "error_summary");

module.exports = {
  validateEmail,
  dataStringify,
  dataParse,
  isJson,
  isObject,
  generateQueryParamString,
  extractError,
  createError,
  extractForwardedData,
  createDataToPassForward,
};
