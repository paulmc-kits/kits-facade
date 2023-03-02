const logger = require('../logger')
const { GOV_NOTIFY_PUBLISHER_REQUEST_TEMPLATE_ID, GOV_NOTIFY_PUBLISHER_REQUEST_EMAIL_TO,GOV_NOTIFY_KEY, GOV_NOTIFY_CONTACT_PAGE_TEMPLATE_ID, GOV_NOTIFY_CONTACT_INFO_EMAIL_TO } = require('../../config')

var NotifyClient = require('notifications-node-client').NotifyClient

var notifyClient = new NotifyClient(GOV_NOTIFY_KEY)

const sendPublisherRequestEmail = async (data) => {
    try {
        const notifySuccess = await notifyClient.sendEmail(GOV_NOTIFY_PUBLISHER_REQUEST_TEMPLATE_ID, GOV_NOTIFY_PUBLISHER_REQUEST_EMAIL_TO, {
            personalisation: {
                'publisher name': data.organisation_name,
                'publisher email address': data.email_address
            },
            reference: null,
        })
        return notifySuccess
    } catch (e) {
        logger.error(e)
        return false
    }
}


const sendContactInfoToDFTByEmail = async (data) => {
    try {
         /**
         * @TODO Add proper GOV_NOTIFY_CONTACT_PAGE_TEMPLATE_ID value  
         */
        const notifySuccess = await notifyClient.sendEmail(GOV_NOTIFY_CONTACT_PAGE_TEMPLATE_ID, GOV_NOTIFY_CONTACT_INFO_EMAIL_TO, {
            personalisation: data,
            reference: null,
        })
        return notifySuccess
    } catch (e) {
        logger.error(e)
        return false
    }
}

module.exports = { sendPublisherRequestEmail,sendContactInfoToDFTByEmail }