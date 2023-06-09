const sortDataByField = (data, order, field) => {
  const getField = (obj, path) => {
    const keys = path.split(".");
    return keys.reduce((acc, prop) => (acc ? acc[prop] : undefined), obj);
  };

  if (order === "asc") {
    return data.sort((a, b) => {
      return getField(a, field) - getField(b, field);
    });
  } else {
    return data.sort((a, b) => {
      return getField(b, field) - getField(a, field);
    });
  }
};

module.exports = {
  sortDataByField,
};
