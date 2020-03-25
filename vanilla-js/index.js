const button = document.querySelector("#submit-button");
const input = document.querySelector("input");
let token;

createDropin();

async function createDropin() {
  try {
    const token = await asyncFetch("http://localhost:5000/");
    setupBraintree(token);
  } catch (err) {
    console.error(err);
  }
}

async function asyncFetch(url, options) {
  try {
    const res = await fetch(url, options);
    const data = res.json();
    return data;
  } catch (err) {
    return err;
  }
}

function promisifyBraintree(options) {
  return new Promise((accept, reject) => {
    braintree.dropin.create(options, (err, results) => {
      if (err) reject(err);
      else accept(results);
    });
  });
}

async function setupBraintree(token) {
  try {
    const dropin = await promisifyBraintree({
      authorization: token,
      container: "#dropin-container"
    });

    setupEventListener(dropin);
    button.style.display = "block";
  } catch (error) {
    console.error(error);
  }
}

function setupEventListener(dropinInstance) {
  button.addEventListener("click", () => {
    dropinInstance.requestPaymentMethod((err, payload) => {
      if (err) {
        console.error(err);
      } else {
        console.log(payload);
        submitTransaction(payload);
      }
    });
  });
}

async function submitTransaction(payload) {
  const { nonce } = payload;
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nonce,
      deviceData: "someDeviceData",
      donationAmount: String(input.value)
    })
  };

  const res = await asyncFetch("http://localhost:5000/donate", options);
  console.log(res);
}
