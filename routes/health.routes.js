"use strict";

const express = require("express");
const router = express.Router();

const health = require("../shared/controllers/health.controller");

router.get("/", health.health);

module.exports = router;
