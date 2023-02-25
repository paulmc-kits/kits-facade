const { Sequelize } = require("sequelize");
const { DATABASE_URL } = require("../config");
const logger = require('../lib/logger')


const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
});

sequelize
  .authenticate()
  .then(() => {
    logger.info("Connection has been established successfully.");
  })
  .catch((error) => {
    logger.error("Unable to connect to the database:", error);
  });
  
module.exports = sequelize;
