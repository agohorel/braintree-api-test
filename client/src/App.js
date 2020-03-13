import React, { useState, useEffect } from "react";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import "./App.css";

function App() {
  const [token, setToken] = useState("");
  const [bt, setBt] = useState({});
  // let bt;

  useEffect(() => {
    axios
      .get("http://localhost:5000/")
      .then(res => setToken(res.data))
      .catch(err => console.error(err));
  }, []);

  const donate = async e => {
    e.preventDefault();
    const { nonce } = await bt.requestPaymentMethod();
    const res = await axios.post("http://localhost:5000/donate", { nonce });
    console.log(res);
  };

  if (!token) {
    return (
      <div className="App">
        <p>loading...</p>
      </div>
    );
  } else {
    return (
      <div className="App">
        <DropIn
          options={{ authorization: token }}
          onInstance={instance => setBt(instance)}
        ></DropIn>
        <button onClick={donate}>purchase</button>
      </div>
    );
  }
}

export default App;
