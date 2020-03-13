import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/")
      .then(res => setToken(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="App">
      <p>token value is: {token}</p>
    </div>
  );
}

export default App;
