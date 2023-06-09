const swaggerAutogen = require("swagger-autogen")();

const CONFIG = require("./platform/config");

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./routes/router.js"];

const doc = {
  info: {
    version: "1.0.0",
    title: "Middleend App",
    description: "Documentation of endpoints exposed in the REST API",
  },
  host: `localhost:${CONFIG.PORT}`,
  basePath: "/",
  schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
  securityDefinitions: {
    authorization: {
      type: "apiKey",
      name: "x-auth-token",
      in: "header",
    },
  },
  tags: [
    {
      name: "Items",
      description: "Endpoint",
    },
    {
      name: "Search",
      description: "Endpoint",
    },
    {
      name: "Health",
      description: "Endpoint",
    },
  ],
  security: [{ authorization: [] }],
  definitions: {
    Items: {
      author: {
        name: "Edgar",
        lastname: "Salgado",
      },
      item: {
        id: "Lorem ipsum odor amet",
        title: "Lorem ipsum odor amet, consectetuer adipiscing elit",
        price: {
          currency: "MXN",
          amount: 100,
          decimals: 10,
        },
        picture:
          "https://http2.mlstatic.com/D_923597-MLB52540279668_112022-O.jpg",
        condition: "new",
        free_shipping: true,
        sold_quantity: 5,
        description:
          "Lorem ipsum odor amet, consectetuer adipiscing elit. Blandit scelerisque per dictum a curabitur. Quis luctus blandit placerat; rutrum platea eget. Risus aliquet commodo natoque adipiscing dui curabitur sociosqu porta. Elit pretium nam dapibus ut habitant libero nunc sem viverra. Bibendum lacus eleifend turpis mauris faucibus nunc cras fames curae. Leo porta feugiat consectetur tortor justo, nisl proin. Egestas fames convallis ex id sagittis dis nisl nullam tempus. Sem id magna; laoreet nostra pulvinar ornare. Nascetur vitae gravida ut quam montes per tempus imperdiet",
      },
    },
    Search: {
      paging: {
        total: 50,
        offset: 0,
        limit: 50,
      },
      categories: ["MLA1234", "MLA1235", "MLA1236", "MLA1237"],
      items: [
        {
          id: "Lorem ipsum odor amet",
          title: "Lorem ipsum odor amet, consectetuer adipiscing elit",
          price: {
            currency: "MXN",
            amount: 100,
            decimals: 10,
          },
          picture:
            "https://http2.mlstatic.com/D_923597-MLB52540279668_112022-O.jpg",
          condition: "new",
          free_shipping: true,
        },
      ],
    },
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc);
