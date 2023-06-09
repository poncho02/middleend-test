const validateUrl = (schema) => (req, res, next) => {
  const { error } = schema.validate(req);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

module.exports = {
  validateUrl,
};
