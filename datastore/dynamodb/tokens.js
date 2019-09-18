'use strict';
const AWS = require('aws-sdk');
const tokens_tableName = 'tokens';
AWS.config.update({region: 'us-east-1'});

async function GetRefreshToken(userId){
    return new Promise(async (resolve, reject) => {
        var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
        var params = {
            TableName: tokens_tableName,
            Key: {
                userId : {S: userId.toString()}
            },
            ProjectionExpression: 'refreshToken'
        };

        ddb.getItem(params, function(err, data) {
            if(!data.Item){
                resolve(null);
                return;
            }

            if (err) {
                reject(err);
            } else {
                resolve(data.Item.refreshToken.S || null);
            }
        });
    });
}

async function GetUserToken(userId){
    return new Promise(async (resolve, reject) => {
        var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

        var params = {
            TableName: tokens_tableName,
            Key: {
                userId : {S: userId.toString()}
            },
            ProjectionExpression: 'accessToken'
        };
    
        ddb.getItem(params, function(err, data) {
            if(!data.Item){
                resolve(null);
                return;
            }
    
            if (err) {
                reject(err);
            } else {
                resolve(data.Item.accessToken.S || null);
            }
        });
    });
}

async function SaveTokens(userId, accessToken, refreshToken){
    return new Promise(async (resolve, reject) => {
        var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
        var params = {
            TableName: tokens_tableName,
            Item: {
                'userId' : {S: userId.toString()},
                'accessToken' : {S: accessToken},
                'refreshToken' : {S: refreshToken}
            }
        };

        ddb.putItem(params, function(err, data) {
            if (err) {
                console.log(`Error saving Token: ${err}`);
                reject(err);
            } else {
                resolve(null);
            }
        });
    });
}

module.exports = {
    GetRefreshToken: GetRefreshToken,
    GetUserToken: GetUserToken,
    SaveTokens: SaveTokens,
}