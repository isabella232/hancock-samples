const fetch = require('node-fetch');
const fs = require('fs');
const Path = require('path');
const FormData = require('form-data');


const PDF_PATH = Path.join(__dirname, 'texttags_example.pdf');
const API_URL = 'https://api.hancock.ink';
const TOKEN = '';
const RECIPIENTS = [
  {
    email: 'veku@zhorachu.com',
    firstName: 'First',
    lastName: 'User',
  },
  {
    email: 'baje@geronra.com',
    firstName: 'Second',
    lastName: 'User',
  }
];

function headers(authorization, contentType = 'application/json') {
  const result = {};

  if (contentType) {
    result['Content-Type'] = contentType;
  }
  if (authorization) {
    const token = TOKEN;
    if (token) {
      result.Authorization = `Bearer ${token}`;
    }
  }

  return result;
}

function postDocument(data) {
  return fetch(`${API_URL}/v0/documents`, {
    method: 'POST',
    headers: headers(true),
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      }
      throw new Error('Unable to create document, status ' + response.status);
    })
    .then((result) => {
      console.log('Document created successful with id:', result.id);
      return result.id;
    });
}

function postDocumentBody(id, path) {
  const data = new FormData();
  data.append('document', fs.createReadStream(path));

  return fetch(`${API_URL}/v0/documents/${id}/content`, {
    method: 'POST',
    headers: headers(true, false),
    body: data,
  })
    .then((response) => {
      if (response.status === 202) {
        console.log('PDF file uploaded successful');
        return id;
      }
      throw new Error('Unable to create document body, status ' + response.status);
    })
}

function postRequest(data) {
  return fetch(`${API_URL}/v0/signature_requests`, {
    method: 'POST',
    headers: headers(true),
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      }
      return response.json();
      throw new Error('Unable to create request, status ' + response.status);
    })
    .then((result) => {
      console.log('Signature request sent, id: ' + result.signatureRequest.id);
    });
}

function main() {
  postDocument({
    title: 'Example document',
    parseTextTags: true,
    recipients: RECIPIENTS,
  })
    .then(id => postDocumentBody(id, PDF_PATH))
    .then(id => postRequest({
      documents: [{ title: 'Example document', id }],
      recipients: RECIPIENTS,
      type: 'just_others'
    }))
    .catch(err => console.log('Error:', err));
}

main();
