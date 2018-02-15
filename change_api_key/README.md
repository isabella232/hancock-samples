# Hancock Change API Key Usage Example

This example will change user API key to new API key.

Run example script:
- Install the example and any dependencies with `npm i`
- Visit [https://manage.hancock.ink/settings/api](https://manage.hancock.ink/settings/api) to get your API key.
- Change the `TOKEN` constant in index.js to your hancock API key.
- Run the example with `node index.js`
- View the new API key in console.

How it works:
- The entered token is used for all API requests
- Get a new API key from Hancock API and log into console (the old TOKEN will not be valid)

Notes:
- The examples is based on the [Hancock API](https://api.hancock.ink/docs/).
- The example was tested on MacOS v10.13.3 with node v8.9.3.
