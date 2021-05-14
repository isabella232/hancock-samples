# Hancock create transaction example

This example will create a new transaction and send it yo specified persopn.

Run example script:
- Install the example and any dependencies with `npm i`.
- Run the example with `node index.js API_TOKEN FILE_ID RECIPIENT_EMAIL`.
  You could use API_TOKEN obtained from [obtain token example](../obtain_api_token).
  You could use FILE_ID obtained from [upload file example](../upload_file) or any other file in your account: [https:/app.hancock.ink/files](https:/app.hancock.ink/files).
- Transaction will be sent to user with a specified email.

Notes:
- The examples is based on the [Hancock API](https://docs.hancock.ink).
- The example was tested on MacOS v11.2.3 with node v14.16.0.
