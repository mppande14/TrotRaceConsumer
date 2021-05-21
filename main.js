const RaceDataCollector = require('./raceDataCollector');
const mongoose  = require('mongoose');

function connectToDb(){
    mongoose.connect('mongodb://127.0.0.1:27017/TrotRace',{ useNewUrlParser: true,useUnifiedTopology: true })
    .then(()=>{
        console.log('Successfully connected to mongoDb.')
        const raceDataCollector = new RaceDataCollector();
        raceDataCollector.startCollectingData().then(()=>{

        }).catch((err)=>{
            mongoose.connection.close();
        });
    }).catch((err)=>{
        console.log('Error in connecting Db. Will reconnect.');
        setTimeout(connectToDb,60*1000);
    });
}


connectToDb();




