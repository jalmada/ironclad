const axios = require('axios');
const AWS = require('aws-sdk');
const meliTokensds = require('../datastore/dynamodb/meliTokens');
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
        meliTokensds.SaveTokens(res.data.user_id, res.data.access_token, res.data.refresh_token);
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

module.exports = async (user_id, client_id, client_secret, code, app_callbackUrl) => {
    return new Promise(async (resolve, reject) => {
        try {
            let refreshToken = await meliTokensds.GetRefreshToken(user_id);

            if(refreshToken){
                console.log("Existing User", refreshToken);
                resolve(await AuthorizeWithRefreshToken(client_id, client_secret, refreshToken));
            } else {
                console.log("New user found");
                resolve(await Authorize(client_id, client_secret, code, app_callbackUrl));
            }
        } catch(err){
            reject(err);
        }
    });
};

