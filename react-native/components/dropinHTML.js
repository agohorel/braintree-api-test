export const staticHTML = `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>braintree dropin test</title>
    <style>
      .container {
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    </style>
    <script src="https://js.braintreegateway.com/web/dropin/1.22.1/js/dropin.min.js"></script>
  </head>
  <body>
    <div class="container">
      <div id="dropin-container"></div>
        <p>token value from react-native is:</p>
        <p id="text"></p>
        <button id="submit-button">Request payment method</button>
      </div>
    </div>

    <script>
      const text = document.querySelector("#text");
      const button = document.querySelector("#submit-button");

      // hack for working around async race condition, better solution needed
      setTimeout(() => {
        text.textContent = window._token.substring(0, 20) + "...";

        braintree.dropin.create(
          {
            authorization: window._token,
            container: "#dropin-container"
          },
          function(createErr, instance) {
            button.addEventListener("click", function() {
              instance.requestPaymentMethod(function(
                requestPaymentMethodErr,
                payload
              ) {
                // Submit payload.nonce to your server
                window.ReactNativeWebView.postMessage("hello from webview :)");
              });
            });
          }
        );
      }, 1000);
    </script>
  </body>
</html>

`;
