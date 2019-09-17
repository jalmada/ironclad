'use strict';
const AWS = require('aws-sdk');
const meli_tokens_tableName = 'meli_tokens';
AWS.config.update({region: 'us-east-1'});

async function GetRefreshToken(user_id){
    return new Promise(async (resolve, reject) => {
        var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
        var params = {
            TableName: meli_tokens_tableName,
            Key: {
                user_id : {N: user_id.toString()}
            },
            ProjectionExpression: 'refresh_token'
        };

        ddb.getItem(params, function(err, data) {
            if (err) {
                reject(err);
            }

            resolve(data.Item.refresh_token.S || '');
        });
    });
}

async function GetUserToken(user_id){
    return new Promise(async (resolve, reject) => {
        var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

        var params = {
            TableName: meli_tokens_tableName,
            Key: {
                user_id : {N: user_id.toString()}
            },
            ProjectionExpression: 'access_token'
        };
    
        ddb.getItem(params, function(err, data) {
            console.log(`GetItem Done ${data}`);
    
            if (err) {
                reject(err);
            }

            resolve(data.Item.access_token.S || '');
        });
    });
}

async function SaveTokens(user_id, access_token, refresh_token){
    return new Promise(async (resolve, reject) => {
        var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
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
                console.log(`Error saving Token: ${err}`);
                reject(err);
            }
            resolve(null);
        });
    });
}

module.exports = {
    GetRefreshToken: GetRefreshToken,
    GetUserToken: GetUserToken,
    SaveTokens: SaveTokens,
}