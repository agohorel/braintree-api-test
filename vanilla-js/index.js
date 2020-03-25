const text = document.querySelector("#text");
const button = document.querySelector("#submit-button");
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

async function asyncFetch(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
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
  text.textContent = token.substring(0, 20) + "...";

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
      }
    });
  });
}
