const request = require("supertest");

const Server = require("../platform/server");

const { axiosData } = require("../shared/helpers/axiosData");
const mockResponses = require("./mock.responses");

jest.mock("../shared/helpers/axiosData", () => {
  return {
    axiosData: jest.fn(),
  };
});

jest.mock("ioredis", () => {
  return jest.fn().mockImplementation(() => ({
    set: jest.fn(() => true),
    get: jest.fn(() => null),
  }));
});

describe("Items Endpoint", () => {
  let postman;

  beforeAll(async () => {
    let _server = new Server();
    postman = request(_server.app);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should respond with a 401 statusCode", async () => {
    const response = await postman.get("/v1/items/bolsa").send();
    expect(response.statusCode).toBe(401);
    expect(response.body).toStrictEqual({
      status: 401,
      message: "unauthorized",
    });
  });

  it("should respond with a 400 statusCode by min chars", async () => {
    const response = await postman
      .get("/v1/items/ML")
      .set("x-auth-token", mockResponses.tokenMock)
      .send();
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      error: "Must have at least 10 characters",
    });
  });

  it("should respond with a 200 statusCode with mock token", async () => {
    const response = await postman
      .get("/v1/items/MLA123456789")
      .set("x-auth-token", mockResponses.tokenMock)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      author: { name: "Edgar", lastname: "Salgado" },
      item: {
        id: "MLA123456789",
        title: "Lorem ipsum odor amet, consectetuer adipiscing elit",
        price: { currency: "MXN", amount: 100, decimals: 10 },
        picture:
          "https://http2.mlstatic.com/D_923597-MLB52540279668_112022-O.jpg",
        condition: "new",
        free_shipping: true,
        sold_quantity: 5,
        description:
          "Lorem ipsum odor amet, consectetuer adipiscing elit. Blandit scelerisque per dictum a curabitur. Quis luctus blandit placerat; rutrum platea eget. Risus aliquet commodo natoque adipiscing dui curabitur sociosqu porta. Elit pretium nam dapibus ut habitant libero nunc sem viverra. Bibendum lacus eleifend turpis mauris faucibus nunc cras fames curae. Leo porta feugiat consectetur tortor justo, nisl proin. Egestas fames convallis ex id sagittis dis nisl nullam tempus. Sem id magna; laoreet nostra pulvinar ornare. Nascetur vitae gravida ut quam montes per tempus imperdiet",
      },
    });
  });

  it("should respond with a 200 statusCode with valid token", async () => {
    axiosData.mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        data: {
          id: "MLB2982363272",
          title: "Pastilha Freio Dianteira Fullpro Sinterizada Zx6 Hayabusa",
          price: 100.9,
          pictures: [
            {
              secure_url:
                "https://http2.mlstatic.com/D_872626-MLB52540456505_112022-O.jpg",
            },
          ],
          condition: "new",
          shipping: {
            free_shipping: true,
          },
          currency_id: "MXN",
        },
      })
    );

    axiosData.mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        data: {
          plain_text: "FULLPRO PASTILHA FREIO DIANTEIRA",
        },
      })
    );

    const response = await postman
      .get("/v1/items/MLA123456789")
      .set("x-auth-token", mockResponses.tokenReal)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      author: { name: "edgar", lastname: "salgado" },
      item: {
        id: "MLB2982363272",
        title: "Pastilha Freio Dianteira Fullpro Sinterizada Zx6 Hayabusa",
        price: { currency: "MXN", amount: 100, decimals: 9 },
        picture:
          "https://http2.mlstatic.com/D_872626-MLB52540456505_112022-O.jpg",
        condition: "new",
        free_shipping: true,
        description: "FULLPRO PASTILHA FREIO DIANTEIRA",
      },
    });
  });

  it("should respond with a 404 statusCode by item not found with valid token", async () => {
    axiosData.mockImplementationOnce(() =>
      Promise.resolve({
        status: 404,
        message: "Item with id MLA123456789 not found",
      })
    );

    axiosData.mockImplementationOnce(() =>
      Promise.resolve({
        status: 404,
        message: "Description of item with id MLA123456789 not found",
      })
    );

    const response = await postman
      .get("/v1/items/MLA123456789")
      .set("x-auth-token", mockResponses.tokenReal)
      .send();

    expect(response.statusCode).toBe(404);
    expect(response.body).toStrictEqual({
      status: 404,
      message: "Item with id MLA123456789 not found",
    });
  });

  it("should respond with a 500 statusCode", async () => {
    axiosData.mockImplementationOnce(() =>
      Promise.resolve({
        data: {},
      })
    );

    axiosData.mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
      })
    );

    const response = await postman
      .get("/v1/items/MLA123456780")
      .set("x-auth-token", mockResponses.tokenReal)
      .send();
    expect(response.statusCode).toBe(500);
  });
});
