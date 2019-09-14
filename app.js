//My User
//Nickname:ALJO8929348

//----
//App id and secret Key
//ID: 8714978096978885 | Secret key: T9DbCl2dAEeKZtqMFZYWZQSrHYgoE28v
//---
//Get Access TOKEN Manualy based on the current logged in user on the browser
//This token can be obtained using the refresh key strored after the first time the user login
//https://developers.mercadolibre.com/en_us/products-authentication-authorization/
//---- Test User: "nickname":"TETE9841944","password":"qatest960"
//---- Test User2: "nickname":"TT327858","password":"qatest730" user_id: 469263818
//---- Current User APP ID Token, (6 hrs only): APP_USR-8714978096978885-091301-9852c2b2fef0cdd023f378f1f4acdbc2-469261720
//----
//To get the user Access Token use this:
//https://auth.mercadolibre.com.mx/authorization?response_type=code&client_id=8714978096978885
//This will be obtained this way the first time only, next logins will be used with the refresh token 
//---- Current User Access Token: TG-5d7af681b671a200060814d9-469261720
//
//To get the access CODE and Refresh code use this:
//https://api.mercadolibre.com/oauth/token?grant_type=authorization_code&client_id=%d&client_secret=%s&code=%s&redirect_uri=%s

//Create Test User
//1. Get current Jose almada Auth Token
//2. curl -X POST -H "Content-Type: application/json" -d '{"site_id":"MLM"}'  https://api.mercadolibre.com/users/test_user?access_token=APP_USR-8714978096978885-091400-ed7625d3a00270ce2e9cbf07418a3206-469263818

var meli = require('mercadolibre'); 
const axios = require('axios');
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const meli_tokens_tableName = 'meli_tokens';

function Authorize(client_id, client_secret, code, app_callbackUrl){
    const authTokenUrl = `https://api.mercadolibre.com/oauth/token?grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&code=${code}&redirect_uri=${app_callbackUrl}`;
    UpdateTokens(authTokenUrl);   
}

function AuthorizeWithRefreshToken(client_id, client_secret, refresh_token){
    const authRefreshTokenUrl = `https://api.mercadolibre.com/oauth/token?grant_type=refresh_token&client_id=${client_id}&client_secret=${client_secret}&refresh_token=${refresh_token}`; //Aka the app itself Id
    UpdateTokens(authRefreshTokenUrl);
}

function UpdateTokens(url){
    axios.post(url)
    .then((res) => {
        console.log(`userId: ${res.data.user_id}`);
        console.log(`access token: ${res.data.access_token}`);
        console.log(`refresh token: ${res.data.refresh_token}`)
        SaveTokens(res.data.user_id, res.data.access_token, res.data.refresh_token);
    })
    .catch((error) => {
        console.error(error)
    });
}

function SaveTokens(user_id, access_token, refresh_token){
    var params = {
        TableName: meli_tokens_tableName,
        Item: {
            'user_id' : {N: user_id.toString()},
            'access_token' : {S: access_token},
            'refresh_token' : {S: refresh_token}
        }
    };
    ddb.putItem(params, function(err, data) {
        if (err) {
            throw `Error", ${err}`;
        }

        console.log("Success Saving Tokens")
    });
}

function LogIn(user_id, client_id, client_secret, code, app_callbackUrl){
    var params = {
        TableName: meli_tokens_tableName,
        Key: {
            user_id : {N: user_id.toString()}
        },
        ProjectionExpression: 'refresh_token'
    };

    //Get Refresh Token
    ddb.getItem(params, function(err, data) {
        if (err) {
            throw `Error", ${err}`;
        }
        if(data.Item){
            console.log("Existing User", data.Item.refresh_token.S);
            AuthorizeWithRefreshToken(client_id, client_secret, data.Item.refresh_token.S);
        } else {
            console.log("New user found");
            Authorize(client_id, client_secret, code, app_callbackUrl);
        }
    });
}

const client_id = 8714978096978885; //Aka the app itself Id
const client_secret = 'T9DbCl2dAEeKZtqMFZYWZQSrHYgoE28v'; //Aka the app itself secret
const code = 'TG-5d7c4706c9a4da00062c15b7-469263818'; //User code
const app_callbackUrl = 'https://localhost:3000';
const user_id = 469263818;


//User Id will be 0 if Called from the callback so this will get the refresh token and auth token alongside the user id
LogIn(user_id, client_id, client_secret, code, app_callbackUrl);