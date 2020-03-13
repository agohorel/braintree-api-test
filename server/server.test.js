const request = require("supertest");
const server = require("./server.js");

describe("token generation", () => {
  it("should return a braintree token", async () => {
    const res = await request(server).get("/");

    expect(res.status).toBe(200);
    expect(res.body.length).toBeTruthy();
  });
});

describe("donation route", () => {
  it("should should block requests with no nonce", async () => {
    const res = await request(server)
      .post("/donate")
      .send({
        nonce: null,
        deviceData: "somedevicedata",
        donationAmount: "10.00"
      });

    expect(res.status).toBe(500);
    expect(res.body.error).toBeTruthy();
  });

  it("should should block requests with no deviceData set", async () => {
    const res = await request(server)
      .post("/donate")
      .send({
        nonce: "somevalue",
        deviceData: null,
        donationAmount: "10.00"
      });

    expect(res.status).toBe(500);
    expect(res.body.error).toBeTruthy();
  });

  it("should should block requests with no donationAmount set", async () => {
    const res = await request(server)
      .post("/donate")
      .send({
        nonce: "somevalue",
        deviceData: "somedevicedata",
        donationAmount: null
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  //   it("it should receive a success message upon successful transaction", async () => {});
});
