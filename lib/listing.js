'use strict';
const axios = require('axios');

async function GetListings(user){
    let url = `https://api.mercadolibre.com/users/${user.userId}/items/search?access_token=${user.accessToken}`;
    let results = await axios.get(url)
    .then((res) => {
        return res.data.results;
    })
    .catch((err) => console.log(err));

    return results;
}

async function GetListing(listingId, user){
    let url = `https://api.mercadolibre.com/items/${listingId}?access_token=${user.accessToken}`;
    let results = await axios.get(url)
    .then((res) => {
        return res.data;
    })
    .catch((err) => console.log(err));

    return results;
}

module.exports = {
    GetListings: GetListings,
    GetListing: GetListing
}

//curl -X GET https://api.mercadolibre.com/items/MLM718020340?access_token=APP_USR-8714978096978885-091602-001b02fdc7bc0794742e9d9514740cb1-469261720 