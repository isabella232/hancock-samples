const fetch = require('node-fetch');

const API_URL = 'https://api.hancock.ink';

function readTransaction(token, transactionId) {
  return fetch(`${API_URL}/transactions/${transactionId}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${token}`,
    },
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => Promise.reject(err));
      }

      return response.json();
    })
    .catch((error) => {
      console.log('Unable to read transaction');
      return Promise.reject(error);
    });
}

async function main() {
  const apiToken = process.argv[2];
  const transactionId = process.argv[3];

  if (!apiToken) {
    throw new Error('Missing required argument apiToken');
  }
  if (!transactionId) {
    throw new Error('Missing required argument transactionId');
  }

  const transaction = await readTransaction(apiToken, transactionId);
  const recipientEmails = transaction.recipients.map(rec => rec.email);

  console.log(`Transaction owned by ${transaction.owner.email}, sent to ${recipientEmails.join(', ')} is in ${transaction.status} state`);
}

main()
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });