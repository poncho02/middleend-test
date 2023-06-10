"use strict";

const { processDescription } = require("../helpers/description");
const { URL_MELI } = require("../constants/index");
const { customError } = require("../../exceptions/customError");
const { axiosData } = require("../../shared/helpers/axiosData");
const cache = require("../../shared/helpers/cache");
const { itemTransform } = require("../helpers/items");

const getItem = async (req, res) => {
  // #swagger.tags = ['Items']
  // #swagger.description = 'endpoint to obtain the details of a specific MeLi item'

  // #swagger.parameters['id'] = { description: 'Id corresponding to the item in the MeLi catalog' }
  const id = req.params.id;

  const [data, description] = await Promise.allSettled([
    axiosData(`${URL_MELI}/items/${id}`),
    axiosData(`${URL_MELI}/items/${id}/description`),
  ]);

  if (data.status === "rejected" || data.value.status !== 200) {
    return customError(res, data.value.message, data.value.status);
  }

  const dataResponse = data?.value?.data;

  const [descriptionTxt, itemResponse] = await Promise.all([
    processDescription(description),
    itemTransform(dataResponse),
  ]);

  const response = {
    author: {
      name: "edgar",
      lastname: "salgado",
    },
    item: {
      ...itemResponse,
      sold_quantity: dataResponse?.sold_quantity,
      description: descriptionTxt,
    },
  };

  /* 
      #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/Items" },
               description: 'Resultado' 
      } 
    */
  await cache.set(req, response);

  res.status(200).json(response);
};

module.exports = {
  getItem,
};
