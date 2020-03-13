require("dotenv").config();

const express = require("express");
const cors = require("cors");
const braintree = require("braintree");
const axios = require("axios");

const server = express();
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

server.post("/donate", validateDonation, (req, res) => {
  const { nonce, deviceData, donationAmount } = req.body;

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

function validateDonation(req, res, next) {
  const { nonce, deviceData, donationAmount } = req.body;

  if (!nonce) {
    res
      .status(500)
      .json({ error: "Server error. Please wait a few seconds and again." });
  } else if (!deviceData) {
    res.status(500).json({
      error:
        "Your device could not be verified - please try again. If you run a script blocker, enable scripts from this domain and try again."
    });
  } else if (!donationAmount) {
    res.status(400).json({ error: "Please provide a donation amount" });
  } else {
    next();
  }
}

module.exports = server;
