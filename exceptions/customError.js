const { errorHandler } = require("./errorHandler");

const customError = (res, message = "An error occurred", status = 500) => {
  const error = new Error(message);
  error.status = status;
  console.log("An error occurred, here we would record metrics and logs");
  errorHandler(error, null, res, null);
};

module.exports = {
  customError,
};
