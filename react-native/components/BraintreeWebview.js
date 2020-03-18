import React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import { staticHTML } from "./dropinHTML.js";

export const BraintreeWebview = ({ token }) => {
  const sendTokenToWebView = `
    window._token = "${token}";
    true;
  `;

  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <WebView
        style={{ flex: 1 }}
        source={{ html: staticHTML }}
        originWhitelist={["*"]}
        injectedJavaScript={sendTokenToWebView}
        javaScriptEnabledAndroid={true}
        onMessage={event => {
          alert(event.nativeEvent.data);
        }}
      />
    </View>
  );
};
