'use strict';
const LogIn = require('../lib/login');
const configApp = require('../config/app.json');

//User Id will be 0 if Called from the callback so this will get the refresh token and auth token alongside the user id
module.exports = async (event, context, callback) => {
    try {
        if (event.queryStringParameters && event.queryStringParameters.code) {
            let code = event.queryStringParameters.code;
            await LogIn(0, configApp.clientId, configApp.clientSectet, code, configApp.callbackUrl);
        }
        callback(null, { statusCode: '200'});
    } catch (err){
        callback(null, { statusCode: '500', body: err});
    }
};