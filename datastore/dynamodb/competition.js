'use strict';
const AWS = require('aws-sdk');
const competition_tableName = 'competition';
AWS.config.update({region: 'us-east-1'});

async function GetCompetition(userId, productId){
    let getCompetitionProm = new Promise(async (resolve, reject) => {
        var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

        var params = {
            TableName: competition_tableName,
            Key: {
                'userId-productId' : {S: `${userId}-${productId}`}
            },
            ProjectionExpression: 'competition'
        };
    
        ddb.getItem(params, function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });

    let competition = await getCompetitionProm.then((res)=> JSON.parse(res));
    return competition;
}

async function SaveCompetition(userId, productId, competition){
    return new Promise(async (resolve, reject) => {
        var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
        var params = {
            TableName: competition_tableName,
            Item: {
                'userId-productId' : {S: `${userId}-${productId}`},
                'competition' : {S: JSON.stringify(competition)}
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
    GetCompetition: GetCompetition,
    SaveCompetition: SaveCompetition
}