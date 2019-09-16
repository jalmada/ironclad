'use strict';
const LogIn = require('./lib/login');
const listing = require('./lib/listing');
const configApp = require('./config/app.json');

async function Main(){
    let user_id = 469261720;

    let authToken = 'APP_USR-8714978096978885-091602-001b02fdc7bc0794742e9d9514740cb1-469261720'; //await LogIn(user_id, configApp.client_id, configApp.client_secret, null, null)
        //.catch(err => console.log(err));

    if(!authToken){
        throw ("Auth Token not found");
    }


    let user = {
        user_id: user_id,
        access_token: authToken
    };

    let listingIds = await listing.GetListings(user);
    let listings = [];

    for(let i in listingIds){
        listings.push(await listing.GetListing(listingIds[i], user));
    }

    console.log(JSON.stringify(listings));
}

Main();