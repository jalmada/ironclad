'use strict';
const LogIn = require('./lib/login');
const listing = require('./lib/listing');
const competition = require('./lib/competition');
const configApp = require('./config/app.json');

async function Main(){
    let userId = 469261720;

    let authToken = await LogIn(userId, configApp.clientId, configApp.clientSecret, null, null)
        .catch(err => console.log(err));

    if(!authToken){
        throw ("Auth Token not found");
    }

    let user = {
        userId: userId,
        accessToken: authToken
    };

    let listingIds = await listing.GetListings(user);
    let listings = [];

    for(let i in listingIds){
        listings.push(await listing.GetListing(listingIds[i], user));
    }

    console.log(JSON.stringify(listings));

    let productId = 'ML12345';
    competition.GetCompetition(user, productId);
}

Main();