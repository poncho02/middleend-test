const { sortDataByField } = require("../../shared/helpers/utils");
const itemMock = {
  author: {
    name: "Edgar",
    lastname: "Salgado",
  },
  item: {
    id: "",
    title: "Lorem ipsum odor amet, consectetuer adipiscing elit",
    price: {
      currency: "MXN",
      amount: 100,
      decimals: 10,
    },
    picture: "https://http2.mlstatic.com/D_923597-MLB52540279668_112022-O.jpg",
    condition: "new",
    free_shipping: true,
    sold_quantity: 5,
    description:
      "Lorem ipsum odor amet, consectetuer adipiscing elit. Blandit scelerisque per dictum a curabitur. Quis luctus blandit placerat; rutrum platea eget. Risus aliquet commodo natoque adipiscing dui curabitur sociosqu porta. Elit pretium nam dapibus ut habitant libero nunc sem viverra. Bibendum lacus eleifend turpis mauris faucibus nunc cras fames curae. Leo porta feugiat consectetur tortor justo, nisl proin. Egestas fames convallis ex id sagittis dis nisl nullam tempus. Sem id magna; laoreet nostra pulvinar ornare. Nascetur vitae gravida ut quam montes per tempus imperdiet",
  },
};

const searchMock = {
  paging: {
    total: 50,
    offset: 0,
    limit: 50,
  },
  categories: ["MLA1234", "MLA1235", "MLA1236", "MLA1237"],
  items: [],
};

const middlewareItemsMock = (req, res, next) => {
  if (req.isRequestMock) {
    const response = itemMock;
    response.item.id = req.params.id;
    res.status(200).json(response).end();
  }

  next();
};

const middlewareSearchMock = (req, res, next) => {
  if (req.isRequestMock) {
    const response = searchMock;

    const qty = Math.floor(Math.random() * (100 - 25 + 1) + 25);

    const items = [];

    response.paging.total = qty;
    response.paging.limit = +req.query?.limit || 50;
    response.paging.offset = +req.query?.offset || 0;

    for (let index = 0; index < qty; index++) {
      const price = Math.floor(Math.random() * (200 - 25 + 1) + 25);
      const _item = JSON.parse(JSON.stringify(itemMock.item));
      delete _item.sold_quantity;
      delete _item.description;
      _item.id = `MLA1234567${index + 1}`;
      _item.price.amount = price;

      items.push(_item);
    }

    response.items = items;

    if (req.query?.sort) {
      const _sort = req.query.sort.split("_")[1];
      response.items = sortDataByField(items, _sort, "price.amount");
    }

    res.status(200).json(response).end();
  }

  next();
};

module.exports = {
  middlewareItemsMock,
  middlewareSearchMock,
};
