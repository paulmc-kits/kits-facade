const errors = {
    AUTH_FAILED : "AUTH_FAILED",
    NOT_AUTHORISED : "NOT_AUTHORISED",
    PUBLISHER_ACCOUNT_EXIST: "PUBLISHER_ACCOUNT_EXIST",
    API_FAILED:"API_FAILED",
    EMAIL_NOT_VALID:"EMAIL_NOT_VALID"
}

const errorsMessage = {
    AUTH_FAILED : "Enter a correct username and password",
    NOT_AUTHORISED : "Not authorised to see this page",
    PUBLISHER_ACCOUNT_EXIST: "Email address has previously been linked to an existing organisation, please sign in to your publisher account",
    API_FAILED : "API request error",
    EMAIL_NOT_VALID : "Email not valid",

}

module.exports = {
    errors,
    errorsMessage
}