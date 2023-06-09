"use strict";

const { URL_MELI } = require("../constants/index");
const { customError } = require("../../exceptions/customError");
const { axiosData } = require("../../shared/helpers/axiosData");
const { itemTransform, categoriesTransform } = require("../helpers/items");

const search = async (req, res) => {
  try {
    // #swagger.tags = ['Search']
    // #swagger.description = 'endpoint to search for articles in MeLi'

    // #swagger.parameters['site'] = { description: 'Is the nomenclature of the catalog site to search' }
    // #swagger.parameters['query'] = { description: 'Article keyword to search' }

    /* 
        #swagger.parameters['limit'] = {
	        in: 'query',
          description: 'Maximum number of results',
          type: 'number'
        } 
        #swagger.parameters['offset'] = {
	        in: 'query',
          description: 'Number of results to skip',
          type: 'number'
        } 
        #swagger.parameters['sort'] = {
	        in: 'query',
          description: 'Order of the results',
          type: 'string'
        } 
    */

    const { site, query } = req.params;
    const { limit = 50, offset = 0, sort = "" } = req.query;

    let url = `${URL_MELI}/sites/${site.toUpperCase()}/search?q=${query}&offset=${offset}&limit=${limit}`;

    if (sort) {
      url += `&sort=${sort}`;
    }

    const results = await axiosData(url);

    const { data } = results;

    const [categories, items] = await Promise.all([
      categoriesTransform(data.available_filters),
      data.results.map((item) => {
        return itemTransform(item);
      }),
    ]);

    const response = {
      paging: {
        total: data.paging.total,
        offset: data.paging.offset,
        limit: data.paging.limit,
      },
      categories,
      items,
    };

    /* 
      #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/Search" },
               description: 'Resultados' 
      } 
    */

    res.status(200).json(response);
  } catch (error) {
    // #swagger.responses[500]
  }
};

module.exports = {
  search,
};
