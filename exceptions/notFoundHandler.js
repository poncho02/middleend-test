function notFoundHandler(req, res, next) {
  let err = new Error("Page not Found");
  err.status = 404;
  next(err);
}

module.exports = {
  notFoundHandler,
};
