const axios = require('axios');
var AWS = require('aws-sdk');
const meli_tokens_tableName = 'meli_tokens';


async function Authorize(client_id, client_secret, code, app_callbackUrl){
    const authTokenUrl = `https://api.mercadolibre.com/oauth/token?grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&code=${code}&redirect_uri=${app_callbackUrl}`;
    return await UpdateTokens(authTokenUrl);   
}

async function AuthorizeWithRefreshToken(client_id, client_secret, refresh_token){
    const authRefreshTokenUrl = `https://api.mercadolibre.com/oauth/token?grant_type=refresh_token&client_id=${client_id}&client_secret=${client_secret}&refresh_token=${refresh_token}`; //Aka the app itself Id
    return await UpdateTokens(authRefreshTokenUrl);
}

async function UpdateTokens(url){
    let authToken = await axios.post(url)
    .then((res) => {
        console.log(`userId: ${res.data.user_id}`);
        console.log(`access token: ${res.data.access_token}`);
        console.log(`refresh token: ${res.data.refresh_token}`)
        SaveTokensAsync(res.data.user_id, res.data.access_token, res.data.refresh_token);
        return res.data.access_token;
    })
    .catch((error) => {
        throw(error);
    });

    if(!authToken){
        throw('Token Retrieval Failed');
    }
    return authToken;
}

async function SaveTokensAsync(user_id, access_token, refresh_token){
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
        }
        console.log("Success Saving Tokens")
    });
}


module.exports = (user_id, client_id, client_secret, code, app_callbackUrl) => {
   
    AWS.config.update({region: 'us-east-1'});
    var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

    var params = {
        TableName: meli_tokens_tableName,
        Key: {
            user_id : {N: user_id.toString()}
        },
        ProjectionExpression: 'refresh_token'
    };

    return new Promise(async (resolve, reject) => {
        //Get Refresh Token
        ddb.getItem(params, async (error, data) => {
            console.log(`GetItem Done ${JSON.stringify(data)}`);

            if (error) {
                reject(error);
            }

            try {
                if(data.Item){
                    console.log("Existing User", data.Item.refresh_token.S);
                    resolve(await AuthorizeWithRefreshToken(client_id, client_secret, data.Item.refresh_token.S));
                } else {
                    console.log("New user found");
                    resolve(await Authorize(client_id, client_secret, code, app_callbackUrl));
                }
            } catch (error) {
                reject(error);
            }

        });
    });
};

