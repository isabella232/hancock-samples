const fetch = require('node-fetch');

const API_URL = 'https://api.hancock.ink';
const TOKEN = '';

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

function changeApiKey() {
  return fetch(`${API_URL}/v0/users/change_api_key`, {
    method: 'GET',
    headers: headers(true),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }

      throw new Error('Unable to change api key, status: ' + response.status);
    })
    .then((result) => {
      console.log('Api key changed successfully:', result.token);
      return result.token;
    })
    .catch(err => console.log(err));
}

changeApiKey();