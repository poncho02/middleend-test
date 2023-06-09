"use strict";

const express = require("express");
const cors = require("cors");
const router = require("../routes/router");
const { notFoundHandler } = require("../exceptions/notFoundHandler");
const { errorHandler } = require("../exceptions/errorHandler");
const { loggerMiddleware } = require("../shared/middlewares/loggerMiddleware");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.middlewares();

    this.routes();
  }

  middlewares() {
    this.app.use(cors());

    this.app.use(express.json());

    this.app.use(express.urlencoded({ extended: false }));

    this.app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, x-auth-token"
      );
      res.setHeader("Access-Control-Allow-Methods", "GET");
      res.setHeader("Allow", "GET");

      next();
    });

    this.app.use(loggerMiddleware);
  }

  routes() {
    this.app.use("/", router);
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`⚡⚡ Server running on http://localhost:${this.port}`);
    });
  }
}

module.exports = Server;
