"use strict";

const { processDescription } = require("../helpers/description");
const { URL_MELI } = require("../constants/index");
const { customError } = require("../../exceptions/customError");
const { axiosData } = require("../../shared/helpers/axiosData");
const { itemTransform } = require("../helpers/items");

const getItem = async (req, res) => {
  try {
    // #swagger.tags = ['Items']
    // #swagger.description = 'endpoint to obtain the details of a specific MeLi item'

    // #swagger.parameters['id'] = { description: 'Id corresponding to the item in the MeLi catalog' }

    const id = req.params.id;

    const [data, description] = await Promise.allSettled([
      axiosData(`${URL_MELI}/items/${id}`),
      axiosData(`${URL_MELI}/items/${id}/description`),
    ]);

    if (data.status === "rejected" || data.value.status !== 200) {
      customError(res, data.value.message, data.value.status);
    }

    const dataResponse = data?.value?.data;

    const [descriptionTxt, itemResponse] = await Promise.all([
      processDescription(description),
      itemTransform(dataResponse),
    ]);

    const response = {
      author: {
        name: "",
        lastname: "",
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

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    // #swagger.responses[500]
  }
};

module.exports = {
  getItem,
};
