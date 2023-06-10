const axios = require("axios");
const request = require("supertest");
const MockAdapter = require("axios-mock-adapter");

const Server = require("../platform/server");
const { axiosData } = require("../shared/helpers/axiosData");

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

describe("Test Utilities", () => {
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

  it("axiosData error", async () => {
    const mockUrl = "https://example.com";

    mock.onAny(mockUrl).reply(() => {
      throw new Error("502 bad gateway");
    });

    const result = await axiosData(mockUrl);

    expect(result).toStrictEqual({ status: 500, message: "Error" });
  });
});
