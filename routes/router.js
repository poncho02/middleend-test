"use strict";

const express = require("express");
const router = express.Router();

const healthRoutes = require("./health.routes");
const v1Routes = require("../v1/routes/index");
const apiDocsRoutes = require("../documentation/api.docs");

const { authorization } = require("../shared/middlewares/authorization");

router.use("/health", healthRoutes);
router.use("/v1", authorization, v1Routes);
router.use("/docs/api", apiDocsRoutes);

module.exports = router;
