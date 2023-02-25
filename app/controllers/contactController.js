const logger = require("../lib/logger");
const { feedbackUrls } = require("../lib/constants");

const { getDataFromAppLocals } = require("../lib/common/utils");
const { sendContactInfoToDFTByEmail } = require("../lib/services/gov-notify");

const viewContactThankYouPage = (req, res, next) => {
  const userData = getDataFromAppLocals(res.locals, "user");
  res.render("contact-thankyou.njk", { userData, feedbackUrls });
};

const viewContactPage = (req, res, next) => {
  const userData = getDataFromAppLocals(res.locals, "user");
  res.render("contact.njk", { userData, feedbackUrls });
};

const submitContactPage = async (req, res, next) => {
  try {
    const contactData = { ...req.body };
    const response = await sendContactInfoToDFTByEmail(contactData);
    res.redirect("/contact-thankyou");
  } catch (e) {
    logger.error(`submitContactPage_ERROR: ${e}`);
    next(e);
  }
};

module.exports = {
  viewContactThankYouPage,
  viewContactPage,
  submitContactPage,
};
