const request = require("supertest");

const Server = require("../platform/server");

const { axiosData } = require("../shared/helpers/axiosData");
const mockResponses = require("./mock.responses");

jest.mock("../shared/helpers/axiosData", () => {
  return {
    axiosData: jest.fn(),
  };
});

describe("Search Endpoint", () => {
  let postman;

  beforeAll(async () => {
    let _server = new Server();
    postman = request(_server.app);
  });

  it("should respond with a 401 status code", async () => {
    const response = await postman
      .get("/v1/search/MLA/bolsa?sort=price_desc")
      .send();

    expect(response.statusCode).toBe(401);
    expect(response.body).toStrictEqual({
      status: 401,
      message: "unauthorized",
    });
  });

  it("should respond with a 400 statusCode by bad site", async () => {
    const response = await postman
      .get("/v1/search/MCO/tenis")
      .set("x-auth-token", mockResponses.tokenMock)
      .send();
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      error: ":site must be from a valid site: ( MLA, MLM, MLB )",
    });
  });

  it("should respond with a 200 statusCode with mock token", async () => {
    const response = await postman
      .get("/v1/search/MLA/tenis?sort=price_asc")
      .set("x-auth-token", mockResponses.tokenMock)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("paging");
    expect(response.body.paging).toHaveProperty("limit");
    expect(response.body).toHaveProperty("categories");
    expect(response.body).toHaveProperty("items");
  });

  it("should respond with a 200 statusCode with valid token", async () => {
    axiosData.mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        data: mockResponses.responseMeliSearchApi,
      })
    );

    const response = await postman
      .get("/v1/search/MLA/tenis?sort=price_asc")
      .set("x-auth-token", mockResponses.tokenReal)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.paging).toStrictEqual({
      total: 10,
      offset: 0,
      limit: 50,
    });
    expect(response.body.categories).toStrictEqual(["category1", "category2"]);
    expect(response.body.items[0].id).toBe("MLB2982363272");
  });
});
