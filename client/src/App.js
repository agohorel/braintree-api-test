import React, { useState, useEffect } from "react";
import braintree from "braintree-web";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import "./App.css";

function App() {
  const [token, setToken] = useState("");
  const [dropInInstance, setDropInInstance] = useState({});
  const [deviceData, setDeviceData] = useState({});
  const [donationAmount, setDonationAmount] = useState("");

  useEffect(() => {
    axios
      .get("https://braintree-test-backend.herokuapp.com/")
      .then((res) => setToken(res.data))
      .catch((err) => console.error(err));
  }, []);

  const donate = async (e) => {
    e.preventDefault();
    const { nonce } = await dropInInstance.requestPaymentMethod();
    const res = await axios.post(
      "https://braintree-test-backend.herokuapp.com/donate",
      {
        nonce,
        deviceData,
        donationAmount,
      }
    );
    console.log(res);
  };

  const handleChange = (e) => {
    setDonationAmount(e.target.value);
  };

  useEffect(() => {
    if (token) {
      braintree.client
        .create({
          authorization: token,
        })
        .then(function (clientInstance) {
          return braintree.dataCollector
            .create({
              client: clientInstance,
            })
            .then(function (dataCollectorInstance) {
              setDeviceData(dataCollectorInstance.deviceData);
            });
        })
        .catch(function (err) {
          console.error(err);
        });
    }
  }, [token]);

  if (!token) {
    return (
      <div className="App">
        <p>loading...</p>
      </div>
    );
  } else {
    return (
      <div className="App">
        <form>
          <label htmlFor="donation input">donation amount:</label>
          <input
            name="donation input"
            type="text"
            value={donationAmount}
            onChange={handleChange}
          ></input>
        </form>
        <DropIn
          options={{ authorization: token, paypal: { flow: "vault" } }}
          onInstance={(instance) => setDropInInstance(instance)}
        ></DropIn>
        <button onClick={donate}>donate</button>
      </div>
    );
  }
}

export default App;
