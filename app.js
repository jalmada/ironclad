//Access Token:APP_USR-8714978096978885-090819-a045fa15acb13d110d2f6691c7f4edff-469263818
//User Id:469263818
//Nickname:ALJO8929348

//AppId: 8714978096978885
//Secret: T9DbCl2dAEeKZtqMFZYWZQSrHYgoE28v

//Auth Token: TG-5d755427dbc4b80006e36c46-469263818

//https://developers.mercadolibre.com.mx/es_mx/autenticacion-y-autorizacion/#obtener_token

//curl -X POST -H "Content-Type: application/json" -d '{"site_id":"MLM"}' https://api.mercadolibre.com/users/test_user?access_token=APP_USR-8714978096978885-090819-a045fa15acb13d110d2f6691c7f4edff-469263818
//curl -X POST -H "Content-Type: application/json" -d '{"site_id":"MLM"}' https://api.mercadolibre.com/oauth/token?grant_type=authorization_code&client_id=8714978096978885&client_secret=T9DbCl2dAEeKZtqMFZYWZQSrHYgoE28v&code=TG-5d755427dbc4b80006e36c46-469263818&redirect_uri=localhost:300
//https://auth.mercadolibre.com.mx/authorization?response_type=code&client_id=APP_USR-8714978096978885-090819-a045fa15acb13d110d2f6691c7f4edff-469263818
//Test user
//{"id":469261720,"nickname":"TETE9841944","password":"qatest960","site_status":"active","email":"test_user_29952594@testuser.com"}


//https://api.mercadolibre.com/oauth/token?grant_type=authorization_code&client_id=8714978096978885&client_secret=T9DbCl2dAEeKZtqMFZYWZQSrHYgoE28v&code=SERVER_GENERATED_AUTHORIZATION_CODE&redirect_uri=


//----
//App id and secret Key
//ID: 8714978096978885 | Secret key: T9DbCl2dAEeKZtqMFZYWZQSrHYgoE28v
//---
//Get Access TOKEN Manualy based on the current logged in user on the browser
//This token can be obtained using the refresh key strored after the first time the user login
//https://developers.mercadolibre.com/en_us/products-authentication-authorization/
//---- Test User: "nickname":"TETE9841944","password":"qatest960"
//---- Current User APP ID Token, (6 hrs only): APP_USR-8714978096978885-091301-9852c2b2fef0cdd023f378f1f4acdbc2-469261720
//----
//To get the user Access Token use this:
//https://auth.mercadolibre.com.mx/authorization?response_type=code&client_id=8714978096978885
//This will be obtained this way the first time only, next logins will be used with the refresh token 
//---- Current User Access Token: TG-5d7af681b671a200060814d9-469261720
//
//To get the access CODE and Refresh code use this:
//https://api.mercadolibre.com/oauth/token?grant_type=authorization_code&client_id=%d&client_secret=%s&code=%s&redirect_uri=%s



var meli = require('mercadolibre'); 
const axios = require('axios');
var AWS = require('aws-sdk');


const app_userId = 'APP_USR-8714978096978885-091301-9852c2b2fef0cdd023f378f1f4acdbc2-469261720'; //This one is authorization token
const client_id = 8714978096978885; //Aka the app itself Id
const client_secret = 'T9DbCl2dAEeKZtqMFZYWZQSrHYgoE28v'; //Aka the app itself secret
const code = 'TG-5d7b019dc9a4da000602b4a1-469261720'; //User code
const app_callbackUrl = 'https://localhost:3000';
const refresh_token = '';
const meli_tokens_db = 'meli_tokens';

AWS.config.update({region: 'us-east-1'});
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});


function LogIn()

function Authorize(client_id, client_secret, code, app_callbackUrl){
    const authTokenUrl = `https://api.mercadolibre.com/oauth/token?grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&code=${code}&redirect_uri=${app_callbackUrl}`;
    UpdateTokens(authTokenUrl);
    
}

function RefreshToken(client_id, client_secret, refresh_token){
    const authRefreshTokenUrl = `https://api.mercadolibre.com/oauth/token?grant_type=refresh_token&client_id=${client_id}&client_secret=${client_secret}&refresh_token=${refresh_token}`; //Aka the app itself Id
    UpdateTokens(authRefreshTokenUrl);
}

function UpdateTokens(username, url){
    axios.post(url)
    .then((res) => {
        console.log(`access token: ${data.access_token}`);
        console.log(`refresh token: ${data.refresh_token}`)
        
       
    })
    .catch((error) => {
        console.error(error)
    });
}


function SaveTokens(username, access_token, refresh_token){
    var params = {
        TableName: meli_tokens_db,
        Item: {
            'username' : {S: username},
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

//var meliObject = new meli.Meli(client_id, client_secret);//, access_token, refresh_token);

//var redirect_uri = meliObject.getAuthURL();





// meliObject.authorize('TG-5d755427dbc4b80006e36c46-469263818', redirect_uri, (result) => {
//     var r = result;
// } ) 