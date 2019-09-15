'use strict';
var AWS = require('aws-sdk');
const meli_tokens_tableName = 'meli_tokens';

function GetUserToken(user_id){
    return new Promise((resolve, reject) => {
        AWS.config.update({region: 'us-east-1'});
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

module.exports = {
    GetUserToken: GetUserToken
}