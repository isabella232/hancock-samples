const fetch = require('node-fetch');

const API_URL = 'https://api.hancock.ink';
const AUTH0_URL = 'https://testinghancock.auth0.com';
const AUTH0_CLIENT_ID = 'M1a9RYvxxm1nvBxZtUhHR34S6ajQeFRK';
const USER = {
  username: '', // email
  password: '',
};

function headers(authorization, contentType = 'application/json') {
  const result = {};

  if (contentType) {
    result['Content-Type'] = contentType;
  }
  if (authorization) {
    result.Authorization = `Bearer ${authorization}`;
  }

  return result;
}

function loginToAuth0Api() {
  const options = {
    ...USER,
    grant_type: 'http://auth0.com/oauth/grant-type/password-realm',
    client_id: AUTH0_CLIENT_ID,
    connection: 'Username-Password-Authentication',
    scope: 'openid profile email',
  };

  return fetch(`${AUTH0_URL}/oauth/ro`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(options),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }

      throw new Error('Unable login to auth0, status ' + response.status);
    })
    .then((result) => {
      console.log('You successfully login to auth0, your id_token:', result.id_token);
      return result.id_token;
    });
}

function getTokenAndProfileFromApi(id_token) {
  return fetch(`${API_URL}/v0/users/auth`, {
    method: 'GET',
    headers: headers(id_token),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }

      throw new Error('Unable auth to API, status ' + response.status);
    })
    .then((result) => {
      console.log('You successfully login to API:', `
      - your token: ${result.token}
      - your profile: ${JSON.stringify(result.user)}
      `);
    });
}

function main() {
  loginToAuth0Api()
    .then(id_token => getTokenAndProfileFromApi(id_token))
    .catch(err => console.log(err));
}

main();
