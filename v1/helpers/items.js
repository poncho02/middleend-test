const priceTransform = (price) => {
  const response = {
    amount: null,
    decimals: null,
  };
  try {
    const _price = price.toString().split(".");
    response.amount = +_price[0];
    response.decimals = +_price?.[1] || null;
  } catch (error) {
    console.log(error);
  }
  return response;
};

const itemTransform = (item) => {
  const _item = {
    id: "",
    title: "",
    price: {
      currency: "",
      amount: null,
      decimals: null,
    },
    picture: "",
    condition: "",
    free_shipping: false,
  };

  try {
    _item.title = item?.title;
    _item.id = item?.id;
    _item.picture =
      item?.pictures?.[0]?.secure_url ||
      item?.secure_thumbnail ||
      item?.thumbnail;
    _item.condition = item?.condition;
    _item.free_shipping = item?.shipping?.free_shipping || false;

    const _price = priceTransform(item?.price);

    _item.price.currency = item?.currency_id;
    _item.price.amount = _price.amount;
    _item.price.decimals = _price.decimals;
  } catch (error) {
    console.log(error);
  }

  return _item;
};

const categoriesTransform = (filters) => {
  try {
    const categoryFilters = filters.find((filter) => filter.id === "category");

    const categories = categoryFilters
      ? categoryFilters?.values.map((value) => value.id)
      : [];

    return categories;
  } catch (error) {
    return [];
  }
};

module.exports = {
  itemTransform,
  categoriesTransform,
};
