"use strict";

const express = require("express");
const router = express.Router();

const cache = require("../../shared/helpers/cache");
const { validateUrl } = require("../middlewares/validations");
const { itemParamsSchema } = require("../middlewares/schemas/joi");
const { middlewareItemsMock } = require("../middlewares/mock");

const itemsController = require("../controllers/items.controller");

router.get(
  "/:id",
  validateUrl(itemParamsSchema),
  middlewareItemsMock,
  cache.get,
  itemsController.getItem
);

module.exports = router;
