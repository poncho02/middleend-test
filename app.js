"use strict";

require("dotenv").config();
const Server = require("./platform/server");

const server = new Server();

server.listen();
