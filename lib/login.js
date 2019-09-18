const axios = require('axios');
const tokensDs = require('../datastore/dynamodb/tokens');

async function Authorize(clientId, clientSecret, code, appCallbackUrl){
    const authTokenUrl = `https://api.mercadolibre.com/oauth/token?grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&code=${code}&redirect_uri=${appCallbackUrl}`;
    return await UpdateTokens(authTokenUrl);   
}

async function AuthorizeWithRefreshToken(clientId, clientSecret, refreshToken){
    const authRefreshTokenUrl = `https://api.mercadolibre.com/oauth/token?grant_type=refresh_token&client_id=${clientId}&client_secret=${clientSecret}&refresh_token=${refreshToken}`; //Aka the app itself Id
    return await UpdateTokens(authRefreshTokenUrl);
}

async function UpdateTokens(url){
    let authToken = await axios.post(url)
    .then((res) => {
        console.log(`userId: ${res.data.user_id}`);
        console.log(`access token: ${res.data.access_token}`);
        console.log(`refresh token: ${res.data.refresh_token}`)
        tokensDs.SaveTokens(res.data.user_id, res.data.access_token, res.data.refresh_token);
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

module.exports = async (userId, clientId, clientSecret, code, appCallbackUrl) => {
    return new Promise(async (resolve, reject) => {
        try {
            let refreshToken = await tokensDs.GetRefreshToken(userId);

            if(refreshToken){
                console.log("Existing User", refreshToken);
                resolve(await AuthorizeWithRefreshToken(clientId, clientSecret, refreshToken));
            } else {
                console.log("New user found");
                resolve(await Authorize(clientId, clientSecret, code, appCallbackUrl));
            }
        } catch(err){
            reject(err);
        }
    });
};

