const Joi = require('joi');
// TODO: make these env properties


const configVariableSchema = Joi.object({
    PORT: Joi.number().port().required(),
    HOST: Joi.string().hostname().required(),
    SECRET_KEY: Joi.string().required(),
    DATABASE_URL: Joi.string().pattern(/^postgres:\/\/(.*):(.*)@(.*)\/(.*)$/).required(),
    GOV_NOTIFY_KEY: Joi.string().required(),
    GOV_NOTIFY_PUBLISHER_REQUEST_TEMPLATE_ID:Joi.string(),
    GOV_NOTIFY_PUBLISHER_REQUEST_EMAIL_TO:Joi.string(),
    GOV_NOTIFY_CONTACT_PAGE_TEMPLATE_ID:Joi.string(),
    GOV_NOTIFY_CONTACT_INFO_EMAIL_TO:Joi.string(),
    REDIS_HOST: Joi.string().hostname().required(),
    REDIS_PORT: Joi.number().port().required()
}).options({ abortEarly: false })

const configVariable = {
    PORT: process.env.PORT || 3000,
    HOST: '0.0.0.0',
    SECRET_KEY: process.env.FACADE_SECRET_KEY,
    DATABASE_URL: process.env.FACADE_SEQUELIZE_URL, 
    GOV_NOTIFY_KEY: process.env.GOV_NOTIFY_KEY,
    GOV_NOTIFY_PUBLISHER_REQUEST_TEMPLATE_ID:process.env.GOV_NOTIFY_PUBLISHER_REQUEST_TEMPLATE_ID ,
    GOV_NOTIFY_PUBLISHER_REQUEST_EMAIL_TO:process.env.GOV_NOTIFY_PUBLISHER_REQUEST_EMAIL_TO,
    GOV_NOTIFY_CONTACT_PAGE_TEMPLATE_ID:process.env.GOV_NOTIFY_CONTACT_PAGE_TEMPLATE_ID,
    GOV_NOTIFY_CONTACT_INFO_EMAIL_TO:process.env.GOV_NOTIFY_CONTACT_INFO_EMAIL_TO , 
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT
}

const configValidation = configVariableSchema.validate(configVariable);

if (configValidation.error) {
    const errorMessages = configValidation.error.details.map(err => err.message).join('\n')
    throw new Error(errorMessages)
}

module.exports = configVariable

