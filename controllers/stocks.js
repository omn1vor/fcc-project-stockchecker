'use strict';

//const https = require('https');
const fetch = require('node-fetch');


async function getPrice(stock) {
  
  let result = { price: 0.0 }

  const url = `http://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    result.price = data.latestPrice;
  } catch(err) {    
    result.error = err;    
  }
  
  return result;
}

module.exports = {
  getPrice
}