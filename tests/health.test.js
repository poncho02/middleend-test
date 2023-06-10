const request = require("supertest");
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");

const Server = require("../platform/server");

//helpers
const { axiosData } = require("../shared/helpers/axiosData");
const { sortDataByField } = require("../shared/helpers/utils");
const { processDescription } = require("../v1/helpers/description");
const { itemTransform, categoriesTransform } = require("../v1/helpers/items");

const mockResponses = require("./mock.responses");

const arrayToSort = [
  {
    item: 1,
    price: {
      amount: 10,
    },
    qty: 29,
  },
  {
    item: 4,
    price: {
      amount: 20,
    },
    qty: 122,
  },
  {
    item: 9,
    price: {
      amount: 8,
    },
    qty: 89,
  },
];

describe("Health Endpoint", () => {
  let server;

  beforeEach(() => {
    server = new Server();
  });

  it("should respond with a 200 statusCode", async () => {
    const response = await request(server.app).get("/health").send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      status: 200,
      name: "OK",
      message: "This api is healthy",
    });
  });

  it("should respond with a 404 statusCode", async () => {
    const response = await request(server.app).get("/healths").send();
    expect(response.statusCode).toBe(404);
  });
});

describe("Test Helpers", () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it("axiosData success", async () => {
    const mockUrl = "https://example.com";
    const mockResponse = {
      status: 200,
      data: {
        message: "Respuesta exitosa",
      },
    };

    mock.onAny(mockUrl).reply(mockResponse.status, mockResponse);

    const result = await axiosData(mockUrl);
    expect(result.status).toBe(200);
    expect(result.data).toStrictEqual(mockResponse);
  });

  it("axiosData error by 502 code", async () => {
    const mockUrl = "https://example.com";

    mock.onAny(mockUrl).reply(502);

    const result = await axiosData(mockUrl);

    expect(result).toStrictEqual({
      status: 502,
      message: "Request failed with status code 502",
    });
  });

  it("axiosData error by 401 code", async () => {
    const mockUrl = "https://example.com";

    mock.onAny(mockUrl).reply(401);

    const result = await axiosData(mockUrl);

    expect(result).toStrictEqual({
      status: 401,
      message: "Request failed with status code 401",
    });
  });

  it("axiosData error by 404 code", async () => {
    const mockUrl = "https://example.com";

    mock.onAny(mockUrl).reply(404, { error: "not_found" });

    const result = await axiosData(mockUrl);
    expect(result).toStrictEqual({
      status: 404,
      message: "not_found",
    });
  });

  it("sortDataByField orderyBy ASC", async () => {
    const results = sortDataByField(arrayToSort, "asc", "price.amount");

    expect(results[0].price.amount).toBe(8);
    expect(results[1].price.amount).toBe(10);
    expect(results[2].price.amount).toBe(20);
  });

  it("sortDataByField orderyBy DESC", async () => {
    const results = sortDataByField(arrayToSort, "desc", "qty");

    expect(results[0].qty).toBe(122);
    expect(results[1].qty).toBe(89);
    expect(results[2].qty).toBe(29);
  });

  it("description empty by reject status from promise", async () => {
    const description = processDescription({
      status: "rejected",
    });

    expect(description).toBe("");
  });

  it("description empty by missing plain_text from api", async () => {
    const description = processDescription({
      status: "fullfiled",
      value: {
        data: {
          plain_text: "",
        },
      },
    });

    expect(description).toBe("");
  });

  it("itemTransform with price null", async () => {
    const item = itemTransform({
      ...mockResponses.basicItem,
      price: null,
    });
    expect(item.price.amount).toBe(null);
    expect(item.price.decimals).toBe(null);
  });

  it("itemTransform with price without decimals", async () => {
    const item = itemTransform({
      ...mockResponses.basicItem,
      price: 100,
    });
    expect(item.price.amount).toBe(100);
    expect(item.price.decimals).toBe(null);
  });

  it("get empty array from available_filters empty", async () => {
    const categories = categoriesTransform();
    expect(categories).toHaveLength(0);
  });
});
