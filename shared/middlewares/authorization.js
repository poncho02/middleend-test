"use strict";

const { customError } = require("../../exceptions/customError");

const tokens = {
  real: "e962f81a-4d42-4eb3-86cd-a25e7237c8dc",
  mock: "55a4639f-55e8-4e14-a6cc-b79977b20a4e",
};

const authorization = (req, res, next) => {
  const token = req.headers?.["x-auth-token"];

  if (!token || (token !== tokens.real && token !== tokens.mock)) {
    // #swagger.responses[401]
    return customError(res, "unauthorized", 401);
  }

  req.isRequestMock = token === tokens.mock;

  next();
};

module.exports = {
  authorization,
};
