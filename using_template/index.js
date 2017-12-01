const fetch = require('node-fetch');
const fs = require('fs');
const Path = require('path');
const EventSource = require('eventsource');
const FormData = require('form-data');

const PDF_PATH = Path.join(__dirname, 'Basic_Form.pdf');
const PDF_FIELDS_PATH = Path.join(__dirname, 'fields.json');
const API_URL = 'https://api.hancock.ink';
const ROLES = [
  {
    type: 'Client',
  },
];
const RECIPIENTS = [
  {
    email: 'banizoz@cobin2hood.com',
    firstName: 'firstName',
    lastName: 'lastName',
    type: 'Client',
  },
];
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

function readFields() {
  return new Promise((resolve, reject) => {
    fs.readFile(PDF_FIELDS_PATH, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
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

function getDocument(id) {
  return fetch(`${API_URL}/v0/documents/${id}`, {
    method: 'GET',
    headers: headers(true),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }

      throw new Error('Unable to pull document, status ' + response.status);
    })
    .then(res => res.document);
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

function postTemplate(data) {
  return fetch(`${API_URL}/v0/templates`, {
    method: 'POST',
    headers: headers(true),
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      }

      throw new Error('Unable to create template, status ' + response.status);
    })
    .then((result) => {
      console.log('Template created with id: ' + result.template.id);
      return result.template.id;
    });
}

function createTemplate() {
  return readFields()
    .then(fields => postDocument({
      title: 'Basic form',
      parseTextTags: true,
      fields,
    }))
    .then(id => postDocumentBody(id, PDF_PATH))
    .then(id => postTemplate({
      documents: [{ title: 'Basic Form', id }],
      recipients: ROLES,
    }));
}

function useTemplate(templateId) {
  return fetch(`${API_URL}/v0/signature_requests/template`, {
    method: 'POST',
    headers: headers(true),
    body: JSON.stringify({
      templateId,
      usersList: RECIPIENTS,
      requestType: 'just_others',
    }),
  })
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      }

      throw new Error('Unable to use template, status ' + response.status);
    })
    .then((result) => {
      const sigReq = result.signatureRequest;
      console.log('Request sent with id: ' + sigReq.id);
      return { id: sigReq.id, documents: sigReq.documents.map(doc => doc.id) };
    });
}

function listenSigning(request) {
  return new Promise((resolve, reject) => {
    const source = new EventSource(
      `${API_URL}/v0/signature_requests/${request.id}/request_type_changed`,
      { headers: headers(true, null) }
    );

    source.addEventListener('CURRENT_STATUS', (e) => {
      const status = JSON.parse(e.data).status;
      if (status === 'signed') {
        resolve(request);
      } else if (status !== 'pending') {
        reject(status);
      }
    });

    source.addEventListener('STATUS_CHANGED', (e) => {
      source.close();
      const status = JSON.parse(e.data).status;
      if (status === 'signed') {
        resolve(request);
      } else {
        reject(status);
      }
    });

    source.addEventListener('error', (e) => {
      if (source.readyState !== EventSource.CONNECTING) {
        source.close();
        reject(`Failed to listen request status: ${e.data}`);
      }
    });

  });
}

function pullData(request) {
  const docID = request.documents[0];

  return getDocument(docID)
    .then((doc) => {
      // simple collect data from fields
      const data = [];
      doc.fields.forEach((f) => {
        if (f.value !== undefined) {
          data.push(f.value);
        }
      });

      return data;
    });
}

function main() {
  createTemplate()
    .then(useTemplate)
    .then(listenSigning)
    .then(pullData)
    .then(data => console.log('Completed, form data: ', data))
    .catch(err => console.log(err));
}

main();
