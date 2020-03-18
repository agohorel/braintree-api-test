import dropin from "braintree-web-drop-in";

const createGUI = token => {
  dropin
    .create({
      authorization: token,
      container: "#dropin-container"
    })
    .then(instance => {
      submitButton.addEventListener("click", () => {
        instance.requestPaymentMethod((err, response) => {
          if (err) {
            // catch error & display to user
          } else {
            // submit payment nonce
          }
        });
      });
    })
    .catch(err => {
      // handle error occurring when creating drop-in
      console.error(err);
    });
};
