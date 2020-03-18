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
        justify-content: center;
        align-items: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div id="dropin-container">
        <p>token value from react-native is:</p>
        <p id="text"></p>
      </div>
    </div>

    <script>
      const text = document.querySelector("#text");

      setTimeout(() => {
        text.textContent = window._token.substring(0, 20) + "...";
      }, 100);
    </script>
  </body>
</html>
`;
