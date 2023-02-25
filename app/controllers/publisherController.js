const logger = require("../lib/logger");

const { errors, errorsMessage } = require("../lib/error-constants");
const { feedbackUrls } = require("../lib/constants");
const {
  publisherApprovalStatuses,
  databaseErrors,
} = require("../database/database-constants");
const { isJson, dataParse, createError, generateQueryParamString, createDataToPassForward } = require("../lib/helper");

const { checkPublisherEmailExists } = require("../lib/services/ckan-auth-api");
const { sendPublisherRequestEmail } = require("../lib/services/gov-notify");

const {
  createPublisherRequest,
  updatePublisherRequest,
} = require("../database/queries/publisherRequested.query");
const { saveRedisValue } = require("../lib/redis-util");

const requestPublisherAccount = async (req, res, next) => {
  try {
    const { email_address, full_name, organisation_name } = { ...req.body };

    const publisherData = {
      email_address: email_address.toLowerCase(),
      full_name,
      organisation_name,
      admin_notified: true,
      status: publisherApprovalStatuses.PENDING,
    };

    const publisherEmailExists = await checkPublisherEmailExists(
      publisherData.email_address
    );
    if (!publisherEmailExists) {
      const publisherId = await createPublisherRequest(publisherData);

      const response = await sendPublisherRequestEmail(publisherData);
      if (!response)
        await updatePublisherRequest({
          ...publisherData,
          admin_notified: false,
        });

      return res.redirect("/publisher-requested");
    } else {
      throw errors.PUBLISHER_ACCOUNT_EXIST;
    }
  } catch (e) {
    handlePublisherRequestError(e, req,res, next);
  }
};

const publisherRequested = (req, res) => {
  res.render("publisher-requested.njk", { feedbackUrls });
};

module.exports = {
  requestPublisherAccount,
  publisherRequested,
};

/**
 * Error Handler
 */

const handlePublisherRequestError = async (e, req,res, next) => {
  const loginRedirect = [
    errors.EMAIL_NOT_VALID,
    errors.PUBLISHER_ACCOUNT_EXIST,
    databaseErrors.SEQUELIZE_ERROR,
  ];

  let error_object = {};

  const error = isJson(e) ? dataParse(e) : e;

  let obj = {
    [errors.EMAIL_NOT_VALID]: (error_object) => ({
      ...error_object,
        email_address: errorsMessage[errors.EMAIL_NOT_VALID],
    }),
    [errors.PUBLISHER_ACCOUNT_EXIST]: (error_object) => ({
      ...error_object,
        email_address: errorsMessage[errors.PUBLISHER_ACCOUNT_EXIST],
    }),
    [[databaseErrors.SEQUELIZE_ERROR]]: (error_object) => ({
       ...Object.entries(
        error[databaseErrors.SEQUELIZE_ERROR]
      ).reduce((acc, [key, value]) => ({ ...acc, ...value }), {}),
    }),
  };

  const currentErrorKey =
    typeof error === "string" ? error : Object.keys(error)[0];

  if (obj?.[currentErrorKey]) {
    error_object = obj[currentErrorKey](error_object);
  } else {
    next(e);
  }

  if (Object.keys(error_object).length){
    const [uniqueErrorId,error_summary] = createError(error_object)
    const saveError = await saveRedisValue(uniqueErrorId, error_summary);
    
    const [formDataId,form_data] =  createDataToPassForward({ ...req.body },"form_data")
    const save = await saveRedisValue(formDataId, form_data);

    if (loginRedirect.includes(currentErrorKey)) res.redirect(`/login${generateQueryParamString({"error":uniqueErrorId,"info":formDataId})}`);
}
};
