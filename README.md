# Challenges

## We Can't Eject

Ejecting our app from Expo is not an option for this project. In practical terms what this means is basically:

- we can't run native code directly
  - i.e. libraries that use native code are off the table
- we can't access the `android` and `ios` build folders directly

## Rendering a Braintree dropin UI element

Braintree provides a secure UI element for making transactions, but it is web-based and relies on the DOM. I have found a couple existing libraries for working with the Braintree dropin in React-Native - but all of them used native code and would therefor require ejecting from Expo.

The approach that seems most feasbile to me is outlined in a series of Medium articles linked below. It consists of using a React-Native `webview` to embed a custom React component to house Braintree's [drop-in payment UI](https://developers.braintreepayments.com/guides/drop-in/overview/javascript/v3). This isn't exactly straightforward however, as the `webview` layer has to communicate back and forth with React-Native, but thankfully the `react-native-community/react-native-webview` component has a built-in message passing system.

## Rendering Static HTML with `react-native-webview`

It appears that rendering static/local HTML on Android would require access to the native `android` build folder, which requires ejecting.

The most obvious workaround would be to serve the static html over the network, rather than including it locally. This obviously requires an internet connection, but so does making a transaction, so this doesn't seem too unreasonable to me.

Another hacky workaround I discovered was to just store an entire HTML file as text in a JS variable, then injecting that variable as the HTML payload. This works but it's kind of annoying to edit/work with (either you maintain a separate, actual, HTML file and have to remember to keep it 'in sync' with the stringified version, or suffer writing HTML and inline JS as a string w/ no formatting or other assistance from your IDE).

https://github.com/react-native-community/react-native-webview/issues/656

## Communicating between React-Native and a `WebView`

We will need to pass messages back and forth between React-Native and the Braintree dropin, rendered in a `WebView`.

`react-native-community/react-native-webview` has a built in message passing system but it's not exactly intuitive. The first gotcha I've observed is that any injected variables (from RN) must be in the form of a tagged template literal, _wrapped in quotes_ (regardless of if the underlying value is already a string). ex. `"${someVar}"`

https://github.com/react-native-community/react-native-webview/blob/master/docs/Guide.md#communicating-between-js-and-native

https://github.com/react-native-community/react-native-webview/blob/master/docs/Reference.md#injectedjavascript

# Packages

### React-Native:

https://github.com/react-native-community/react-native-webview

### React:

https://www.npmjs.com/package/braintree-web-drop-in-react

# Docs

## Client

https://developers.braintreepayments.com/start/hello-client/javascript/v3

## Server

https://developers.braintreepayments.com/start/hello-server/node

# Braintree x React-Native Guide

https://medium.com/hackernoon/accepting-payments-in-a-react-native-app-part-1-9cb09a271f59

https://medium.com/@reginald.johnson/accepting-payments-in-a-react-native-app-part-2-b8927487ea9c

https://medium.com/react-native-training/accepting-payments-in-a-react-native-app-part-3-c22828ecab13

https://medium.com/react-native-training/accepting-payments-in-a-react-native-app-part-4-cb4f7c02c193

# General Considerations/Notes

## Security

- add device info to transactions (improves fraud detection)

  - **implemented in React client**
  - https://developers.braintreepayments.com/guides/advanced-fraud-tools/device-data-collection/javascript/v3
  - research possible GDPR implications

- enable AVS and CVV rules

  - **implemented on braintree but needs testing**
  - https://articles.braintreepayments.com/guides/fraud-tools/basic/avs-cvv-rules

    - AVS:

      - if setting global region, do not select `issuing bank does not support AVS` as a reason to reject transaction - AVS is mostly used in US, Canada, and UK.

      - Because AVS rules only check the numeric values of an address, Braintree typically doesn't recommend enabling the `Street Address does not match` or `Street address not verified` rules. If your customer lives at 12345 6th Street, depending on how they enter the information, it could confuse the system and cause false rejections.

      - Many card issuing banks outside of the US, UK, and Canada do not consistently support AVS. If you choose to enable Global AVS, you could see an increased decline rate for transactions and verifications originating in countries without AVS support. To avoid this, we recommend that you do not select the following as reasons to reject transactions:
        - `Issuing bank does not support AVS`
        - `Postal Code not verified`
        - `Street Address not verified`

    - CVV:
      - needs more research: reject on "Issuer does not participate"
        - this sounds like "do not accept transactions from issuers that don't utilize CVV"
          - the questions is "how common is it for a card to _not_ have a CVV? we don't want to lock people out of contributing, but we want as much security as possible.

## Communicating between webview and React-Native

- https://github.com/react-native-community/react-native-webview/blob/master/docs/Guide.md#communicating-between-js-and-native

## Paypal Integration

### Creating a paypal sandbox:

- https://developers.braintreepayments.com/guides/paypal/testing-go-live/ruby#linked-paypal-testing

### Client-side guide:

- https://developers.braintreepayments.com/guides/paypal/client-side/javascript/v3
