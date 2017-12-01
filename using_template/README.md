# Hancock Templates Usage Example

This example will create a new template in your account and use it to send a signature request to a specific person.

Run example script:
- Install the example and any dependencies with `npm i`
- Visit [https://manage.hancock.ink/settings/api](https://manage.hancock.ink/settings/api) to get your API key.
- Change the `TOKEN` constant in index.js to your hancock API key.
- Change the `RECIPIENTS` constant to include the email of your recipient.
- Run the example with `node index.js`
- Check the email of the first recipient.
- Sign signature request.
- View the filled data in console.

How it works:
- The entered token is used for all API requests
- Post a document metadata to Hancock API
- Post a pdf file to Hancock API
- Post a template to Hancock API
- Create a signature request based on created template
- Use SSE to listen the signature request status updates
- When signature request status is `signed`, pull the document metadata from Hancock API.
- Collect the field values from document metadata and log into console 

Notes:
- The examples is based on the [Hancock API](https://api.hancock.ink/docs/).
- The example was tested on MacOS v10.12.6 with node v8.4.0.
