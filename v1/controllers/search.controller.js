"use strict";

const { URL_MELI } = require("../constants/index");
const { customError } = require("../../exceptions/customError");
const { axiosData } = require("../../shared/helpers/axiosData");
const { itemTransform, categoriesTransform } = require("../helpers/items");

const search = async (req, res) => {
  try {
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

    res.status(200).json(response);
  } catch (error) {}
};

module.exports = {
  search,
};
