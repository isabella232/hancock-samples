const fetch = require('node-fetch');

const API_URL = 'https://api.quant.agency';

function createTransaction(token, fileId, recipientEmail) {
  return fetch(`${API_URL}/transactions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: 'Non Disclosure for test',
      fileIds: [fileId], // specify one or more files to be included in transaction
      recipients: [{ type: 'signer', email: recipientEmail }], // specify one or more transaction recipients
    })
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => Promise.reject(err));
      }

      return response.json();
    })
    .catch((error) => {
      console.log('Unable to create transaction');
      return Promise.reject(error);
    });
}

function startTransaction(token, transactionId) {
  return fetch(`${API_URL}/transactions/${transactionId}/start`, {
    method: 'POST',
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
      console.log('Unable to start transaction');
      return Promise.reject(error);
    });
}

async function main() {
  const apiToken = process.argv[2];
  const fileId = process.argv[3];
  const recipientEmail = process.argv[4];

  if (!apiToken) {
    throw new Error('Missing required argument apiToken');
  }
  if (!fileId) {
    throw new Error('Missing required argument fileId');
  }
  if (!recipientEmail) {
    throw new Error('Missing required argument recipientEmail');
  }

  const transaction = await createTransaction(apiToken, fileId, recipientEmail);

  /* now you have a created transaction in "draft" mode,
     which means on this step you could edit it before start.
  */

  await startTransaction(apiToken, transaction.id);

  console.log(`Transaction with id ${transaction.id} succesfully started!\n User ${recipientEmail} will receive an email.\n You can view transaction at https://app.hancockapp.com/transaction/${transaction.id}`);
}

main()
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
