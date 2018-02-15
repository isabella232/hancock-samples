# Hancock Get User Token Usage Example

This example will create a new template in your account and use it to send a signature request to a specific person.

Run example script:
- Install the example and any dependencies with `npm i`.
- Change the `USER` constant to include the username (email) and password for your user.
- Run the example with `node index.js`.
- View the filled data in console.

How it works:
- The entered user is used for login to Auth0 API
- Post a user data to Auth0 API
- When Auth0 API return response, use id_token from response
- Get user token and profile from Hancock API with id_token from Auth0 API
- Collect the user token and profile and log into console
- Now you can use user token for all Hancock API requests

Notes:
- The examples is based on the [Hancock API](https://api.hancock.ink/docs/).
- The example was tested on MacOS v10.13.3 with node v8.9.3.
