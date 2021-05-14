const fetch = require('node-fetch');
const fs = require('fs');

const API_URL = 'https://api.hancock.ink';

function getFileUploadURL(token) {
  return fetch(`${API_URL}/files/upload_url`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      mimeType: 'application/pdf', // require mime type to be specified
    })
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => Promise.reject(err));
      }

      return response.json();
    })
    .catch((error) => {
      console.log('Unable to get file upload URL');
      return Promise.reject(error);
    });
}

function uploadFileBody(url) {
  const fileBuffer = fs.readFileSync('./non_disclosure_agreement.pdf');

  const headers = new fetch.Headers();
  headers.append('Content-Type', 'application/pdf');
  headers.append('Content-Length', fileBuffer.byteLength);

  return fetch(url, {
    method: 'PUT',
    headers,
    body: fileBuffer,
  })
    .then(response => {
      if (!response.ok) {
        return response.text().then(err => Promise.reject(err));
      }

      return response.text();
    })
    .catch((error) => {
      console.log('Unable to upload file');
      return Promise.reject(error);
    });
}

function createFileMetadata(token, bodyRef) {
  return fetch(`${API_URL}/files/meta`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      bodyRef,
      attributes: { title: 'Non Disclosure Agreement' },
    }),
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => Promise.reject(err));
      }

      return response.json();
    })
    .catch((error) => {
      console.log('Unable to upload file');
      return Promise.reject(error);
    });
}

async function main() {
  const apiToken = process.argv[2];

  if (!apiToken) {
    throw new Error('Missing required argument apiToken');
  }

  const { url, bodyRef } = await getFileUploadURL(apiToken);

  await uploadFileBody(url);
  const file = await createFileMetadata(apiToken, bodyRef);

  console.log(`File with id ${file.id} successfully created!\n You can view it at https://app.hancock.ink/file/${file.id}`);
}

main()
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
