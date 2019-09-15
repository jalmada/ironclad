'use strict';
const LogIn = require('./lib/login');
const configApp = require('./config/app.json');

async function Main(){
    let user_id = 470905606;

    let authToken = await LogIn(user_id, configApp.client_id, configApp.client_secret, null, null)
        .catch(err => console.log(err));

    if(!authToken){
        throw ("Auth Token not found");
    }

    console.log(authToken);
}

Main();