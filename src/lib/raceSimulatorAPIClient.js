const axios = require('axios');

axios.defaults.baseURL = process.env.API_URL;

class RaceSimulatorAPIClient {
  constructor() {
    this.token = null;
  }

  authenticate(email, password) {
    return new Promise((resolve, reject) => {
      axios.post('/auth', { email, password }).then((rspData) => {
        if (rspData.status === 200) {
          this.token = rspData.data.token;
          resolve({ status: rspData.status, data: rspData.data });
        }
        reject(new Error('Authentication Failed.'));
      }).catch((err) => {
        if (err.response) {
          console.log('Received error Code for auth request:', err.response.status);
        } else {
          console.log('Error in auth request:', err.message);
        }
        reject(err);
      });
    });
  }

  getResult() {
    return new Promise((resolve, reject) => {
      axios.get('/results', { headers: { Authorization: `Bearer ${this.token}` }, timeout: 20 * 1000 }).then((rspData) => {
        console.log('Received response with status', rspData.status);
        resolve({ status: rspData.status, data: rspData.data });
      }).catch((err) => {
        if (err.response) {
          console.log('Received response with status', err.response.status);
        } else {
          console.log('Error in getting result data');
        }
        reject(err);
      });
    });
  }
}

module.exports = RaceSimulatorAPIClient;
