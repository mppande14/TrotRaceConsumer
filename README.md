**TrotRaceConsumer**

Description:
    A REST API is exposed by a simple trot race simulator that runs a new race with six horses every minute of every day. When a horse starts or finishes, an event is sent out in real time via a REST API.
    This project subscribes to these events and saves them in a MongoDB database 'TrotRace'.

Installation:

    Use following npm command to install.
        npm install

Usage:

    This project expects following env varibales to be paased -
        DB_HOST,
        DB_PORT,
        API_URL,
        AUTH_EMAIL,
        AUTH_PASSWORD
        
    A sample sample.env is provided along with project

    Start the project using following cmd -
        npm start
