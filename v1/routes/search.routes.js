"use strict";

const express = require("express");
const router = express.Router();

const { validateUrl } = require("../middlewares/validations");
const { itemSearchSchema } = require("../middlewares/schemas/joi");
const { middlewareSearchMock } = require("../middlewares/mock");

const searchController = require("../controllers/search.controller");

router.get(
  "/:site/:query",
  validateUrl(itemSearchSchema),
  middlewareSearchMock,
  searchController.search
);

module.exports = router;
