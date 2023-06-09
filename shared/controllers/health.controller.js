"use strict";

function health(req, res) {
  res.status(200).send({
    status: 200,
    name: "OK",
    message: "This api is healthy",
  });
}

module.exports.health = health;
