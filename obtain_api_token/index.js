const fetch = require('node-fetch');

const AUTH_API_URL = 'https://account.quant.agency';

function main() {
  const clientId = process.argv[2];
  const clientSecret = process.argv[3];

  if (!clientId) {
    throw new Error('Missing argument clientId');
  }

  if (!clientSecret) {
    throw new Error('Missing argument clientSecret');
  }

  fetch(`${AUTH_API_URL}/apps/token`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      clientId,
      clientSecret,
    })
  })
    .then(response => response.json())
    .then(result => console.log(`Success! Access token:\n${result.access_token}`))
    .catch((error) => {
      console.log(error);
      process.exit(1);
    });
}

main();
