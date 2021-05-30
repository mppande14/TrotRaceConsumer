const mongoose = require('mongoose');
require('dotenv').config();
const RaceDataCollectorService = require('./services/raceDataCollectorService');

function connectToDb() {
  mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/TrotRace`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('Successfully connected to mongoDb.');
      const raceDataCollector = new RaceDataCollectorService();
      raceDataCollector.startCollectingData().then(() => {
      }).catch(() => {
        mongoose.connection.close();
      });
    }).catch((err) => {
      console.log('Error in connecting Db. Will reconnect. Error', err.message);
      setTimeout(connectToDb, 60 * 1000);
    });
}

connectToDb();
