const RaceSimulatorAPIClient = require('./raceSimulatorAPIClient');
const RaceEvent = require('./models/raceEvent');
class RaceDataCollector{
    constructor(){
        this.simulatorAPIClient = new RaceSimulatorAPIClient();
    }

    startCollectingData(){
        return new Promise((resolve,reject)=>{
            this.authenticate().then(()=>{
                this.fetchData();
                resolve();
            }).catch(()=>{
                console.log("Failed to authenticate");
                reject();
            });
        });
    }

    authenticate(){
        return new Promise((resolve,reject)=>{
            console.log('Sending authentication request');
            this.simulatorAPIClient.authenticate('mppande14@gmail.com','lTgAYaLP9jRs').then((rspData)=>{
                console.log('Authentication succesful');
                resolve();
            }).catch(err=>{
                console.log("Authentication Failed");
                if(err.status === 401){
                    console.log("Invalid credentials");
                    reject();
                }
                else if(err.status === 503){
                    console.log("Server is busy. Retrying authentication after 60 sec");
                    setTimeout(()=>{
                        this.authenticate();
                    },60*1000);
                }else {
                    console.log("Retrying authentication after 60 sec");
                    setTimeout(()=>{
                        this.authenticate();
                    },60*1000);
                }
            });
        }); 
    }

    fetchData(){
        this.simulatorAPIClient.getResult().then((rspData)=>{
            if(rspData.status==200){
                console.log(rspData.data);
                this.storeData(rspData.data);
            }else if(rspData.status==204){
                console.log('No events to consume');
            }
            this.fetchData();
        }).catch((err)=>{
            if(err.status==401){
                console.log('Token expires.Autheticating again');
                this.startCollectingData();
            }else{
                this.fetchData();
            }
        })
    }

    storeData(eventData){
        const raceData = new RaceEvent({
            "event":eventData.event,
            "horse":{
                "id":eventData.horse.id,
                "name":eventData.horse.name
            },
            "time":eventData.time
        });
        raceData.save().then((data)=>{
            console.log('Data stored successfully.')
        }).catch(err=>{
            console.log(`Error in storing :${err.message}`);
        })
    }
}

module.exports = RaceDataCollector;