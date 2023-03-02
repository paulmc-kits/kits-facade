const { databaseErrors } = require("./database-constants");

const parseDatabaseErrors = (error) => {
  const sequelizeError = { [databaseErrors.SEQUELIZE_ERROR]: null };

  let errors = {};

  switch (error.name) {
    case "SequelizeValidationError":
      for (const { message, path } of error.errors) {
        errors = { ...errors, [path]: message };
      }

      sequelizeError[databaseErrors.SEQUELIZE_ERROR] = {
        validation_error: errors,
      };

      return sequelizeError;

    case "SequelizeUniqueConstraintError":
      for (const { message, path } of error.errors) {
        errors = { ...errors, [path]: message };
      }

      sequelizeError[databaseErrors.SEQUELIZE_ERROR] = {
        unique_constraint_error: errors,
      };

      return sequelizeError;
    default:
      return sequelizeError;
  }
};

const sortData = (sort) => (sort ? sort.split(" ") : []);

const sortField = (sortQuery, sortFields) => {
  if (sortQuery) {
    return [sortQuery, sortData(sortQuery)];
  } else {
    const sortValue = sortFields.find(
      (sortField) => sortField.default == true
    ).value;
    return [sortValue, sortData(sortValue)];
  }
};

module.exports = {
  parseDatabaseErrors,
  sortField,
  sortData,
};
