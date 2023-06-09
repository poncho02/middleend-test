const notFoundHandler = (req, res, next) => {
  // #swagger.responses[404]
  let err = new Error("Page not Found");
  err.status = 404;
  next(err);
};

module.exports = {
  notFoundHandler,
};
