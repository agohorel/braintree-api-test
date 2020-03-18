import React, { useState, useEffect } from "react";
import braintree from "braintree-web";
import { StyleSheet, Text, View } from "react-native";
import axios from "axios";

import { BraintreeWebview } from "./components/BraintreeWebview";

export default function App() {
  const [token, setToken] = useState("");
  const [dropInInstance, setDropInInstance] = useState({});
  const [deviceData, setDeviceData] = useState({});
  const [donationAmount, setDonationAmount] = useState("");

  useEffect(() => {
    axios
      .get("http://192.168.137.1:5000/")
      .then(res => setToken(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!token) {
    return (
      <View style={styles.container}>
        <Text>loading...</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        {/* <Text>token value is {token.substring(0, 20)}...</Text> */}
        <BraintreeWebview token={token}></BraintreeWebview>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
