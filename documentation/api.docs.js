"use strict";

const express = require("express");
const router = express.Router();

const swaggerUI = require("swagger-ui-express");
const swaggerFile = require("../swagger_output.json");

router.use("/", swaggerUI.serve, swaggerUI.setup(swaggerFile));

module.exports = router;
