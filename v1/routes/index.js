"use strict";

const express = require("express");
const router = express.Router();

const itemsRoutes = require("./items.routes");
const searchRoutes = require("./search.routes");

router.use("/items", itemsRoutes);
router.use("/search", searchRoutes);

module.exports = router;
