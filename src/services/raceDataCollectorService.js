const RaceSimulatorAPIClient = require('../lib/raceSimulatorAPIClient');
const RaceEvent = require('../models/raceEvent');

class RaceDataCollectorService {
  constructor() {
    this.simulatorAPIClient = new RaceSimulatorAPIClient();
  }

  startCollectingData() {
    return new Promise((resolve, reject) => {
      this.authenticate().then(() => {
        this.fetchData();
        resolve();
      }).catch(() => {
        console.log('Failed to authenticate');
        reject();
      });
    });
  }

  authenticate() {
    return new Promise((resolve, reject) => {
      console.log('Sending authentication request');
      this.simulatorAPIClient.authenticate(process.env.AUTH_EMAIL, process.env.AUTH_PASSWORD)
        .then(() => {
          console.log('Authentication successful');
          resolve();
        }).catch((err) => {
          console.log('Authentication Failed');
          if (err.response && err.response.status === 401) {
            console.log('Invalid credentials');
            reject();
          } else if (err.response && err.response.status === 503) {
            console.log('Server is busy. Retrying authentication after 60 sec');
            setTimeout(() => {
              this.startCollectingData()
                .catch(() => { console.log('Collecting data failed'); });
            }, 60 * 1000);
          } else {
            console.log('Retrying authentication after 60 sec');
            setTimeout(() => {
              this.startCollectingData()
                .catch(() => { console.log('Collecting data failed'); });
            }, 60 * 1000);
          }
        });
    });
  }

  fetchData() {
    this.simulatorAPIClient.getResult().then((rspData) => {
      if (rspData.status === 200) {
        console.log(rspData.data);
        RaceDataCollectorService.storeData(rspData.data);
      } else if (rspData.status === 204) {
        console.log('No events to consume');
      }
      this.fetchData();
    }).catch((err) => {
      if (err.response && err.response.status === 401) {
        console.log('Token expires.Autheticating again');
        this.startCollectingData()
          .catch(() => { console.log('Collecting data failed'); });
      } else {
        this.fetchData();
      }
    });
  }

  static storeData(eventData) {
    const raceData = new RaceEvent({
      event: eventData.event,
      horse: {
        id: eventData.horse.id,
        name: eventData.horse.name,
      },
      time: eventData.time,
    });
    raceData.save().then(() => {
      console.log('Data stored successfully.');
    }).catch((err) => {
      console.log(`Error in storing :${err.message}`);
    });
  }
}

module.exports = RaceDataCollectorService;
