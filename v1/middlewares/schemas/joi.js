const Joi = require("joi");

const itemParamsSchema = Joi.object({
  params: {
    id: Joi.string()
      .min(10)
      .pattern(new RegExp(/^(MLA|MLM|MLB)/i))
      .required()
      .messages({
        "string.min": "Must have at least {#limit} characters",
        "string.pattern.base": "Must be from a valid site: ( MLA, MLM, MLB )",
      }),
  },
}).unknown(true);

const itemSearchSchema = Joi.object({
  params: {
    site: Joi.string()
      .insensitive()
      .valid("mlm", "mlb", "mla")
      .required()
      .messages({
        "any.only": ":site must be from a valid site: ( MLA, MLM, MLB )",
      }),
    query: Joi.string().min(3).required().messages({
      "string.min": ":query must have at least {#limit} characters",
    }),
  },
  query: {
    offset: Joi.number().messages({
      "number.base": "the value of the 'offset' must be numeric",
    }),
    limit: Joi.number().min(1).max(50).messages({
      "number.max": "the max 'limit' value should be {#limit}",
      "number.min": "the min 'limit' value should be {#limit}",
      "number.base": "the value of the 'limit' must be numeric",
    }),
    sort: Joi.string().valid("price_asc", "price_desc").messages({
      "any.only": "'sort' must be {#valids}",
    }),
  },
}).unknown(true);

module.exports = {
  itemParamsSchema,
  itemSearchSchema,
};
