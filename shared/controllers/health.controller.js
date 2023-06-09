"use strict";

const health = (req, res) => {
  // #swagger.tags = ['Health']
  // #swagger.description = 'endpoint to know if the api is working'
  res.status(200).send({
    status: 200,
    name: "OK",
    message: "This api is healthy",
  });
};

module.exports = { health };
