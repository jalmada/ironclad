'use strict';
const {GetUserToken} = require('./datastore/dynamodb/meliTokens');

async function Main(){
    let user_id = 470905606;

    var acess_token =  await GetUserToken(user_id);
    console.log(acess_token);
}

Main();