"use strict";

const express = require("express");
const router = express.Router();

const cache = require("../../shared/helpers/cache");
const { validateUrl } = require("../middlewares/validations");
const { itemSearchSchema } = require("../middlewares/schemas/joi");
const { middlewareSearchMock } = require("../middlewares/mock");

const searchController = require("../controllers/search.controller");

router.get(
  "/:site/:query",
  validateUrl(itemSearchSchema),
  middlewareSearchMock,
  cache.get,
  searchController.search
);

module.exports = router;
