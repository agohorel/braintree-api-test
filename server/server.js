require("dotenv").config();

const express = require("express");
const cors = require("cors");
const braintree = require("braintree");
const axios = require("axios");

const server = express();
const port = 5000;
const gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY
});

server.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);
server.use(express.json());

server.get("/", (req, res) => {
  gateway.clientToken.generate((err, response) => {
    if (!err) {
      res.status(200).json(response.clientToken);
    } else {
      res.status(500).json({ error: "error fetching token" });
    }
  });
});

server.post("/donate", (req, res) => {
  const { nonce, deviceData, donationAmount } = req.body;

  console.log(donationAmount, String(donationAmount));

  gateway.transaction.sale(
    {
      amount: String(donationAmount),
      paymentMethodNonce: nonce,
      deviceData,
      options: {
        submitForSettlement: true
      }
    },
    (error, result) => {
      if (!error) {
        res.status(200).json({ msg: result });
      } else {
        res.status(500).json({ error });
      }
    }
  );
});

server.listen(port, () => console.log(`server listening on port ${port}`));
