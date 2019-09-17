'use strict';
var AWS = require('aws-sdk');
const meli_tokens_tableName = 'meli_competition';

async function GetCompetition(user_id, product_id){
    let getCompetitionProm = new Promise(async (resolve, reject) => {
        AWS.config.update({region: 'us-east-1'});
        var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

        var params = {
            TableName: meli_tokens_tableName,
            Key: {
                'user_id' : {N: user_id.toString()},
                'product_id': {N: product_id.toString()}
            },
            ProjectionExpression: 'competition'
        };
    
        ddb.getItem(params, function(err, data) {
            if (err) {
                reject(err);
            }

            resolve(data);
        });
    });

    let competition = await getCompetitionProm.then((res)=> JSON.parse(res));
    return competition;
}

async function SaveCompetition(user_id, product_id, competition){
    let saveCompetitionProm = new Promise(async (resolve, reject) => {
        var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
        var params = {
            TableName: meli_tokens_tableName,
            Item: {
                'user_id' : {N: user_id.toString()},
                'product_id' : {N: product_id.toString()},
                'competition' : {S: JSON.stringify(competition)}
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

    let error = await saveCompetitionProm;
    return error;
}

module.exports = {
    GetCompetition: GetCompetition,
    SaveCompetition: SaveCompetition
}