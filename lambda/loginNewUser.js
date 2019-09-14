'use strict';
const LogIn = require('../lib/login');
const config_app = require('../config/app.json');

//User Id will be 0 if Called from the callback so this will get the refresh token and auth token alongside the user id
module.exports = async (event, context, callback) => {

    try {

        if (event.queryStringParameters && event.queryStringParameters.code) {
            let code = event.queryStringParameters.code;
            LogIn(0, config_app.client_id, config_app.client_secret, code, config_app.callbackUrl);
        }

        callback(null, { statusCode: '200'});
    } catch (err){
        callback(null, { statusCode: '500', body: err});
    }
};