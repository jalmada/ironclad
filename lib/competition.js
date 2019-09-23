'use strict';
const libListing = require('./listing');
const axios = require('axios');

const siteId = 'MLM';

async function GetCompetition(listingId, user){
    let listing = await libListing.GetListing(listingId, user);

    let attributes = listing.attributes;

    let brand = '';
    let model = '';

    for(let i in attributes){
        let attr = attributes[i];
        if(attr.id == "BRAND"){
            brand = attr.value_name;
        } else if(attr.id == "MODEL"){
            model = attr.value_name;
        }    
    }

    let query = encodeURI(`${brand} ${model}`);
    console.log(query);

    let url = `https://api.mercadolibre.com/sites/${siteId}/search?q=${query}`;
    let results = await axios.get(url)
    .then((res) => {
        return res.data;
    })
    .catch((err) => console.log(err));

    return results;
}

module.exports = {
    GetCompetition: GetCompetition
}

