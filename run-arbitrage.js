//load variable to read infura keys
require('dotenv').config();
const Web3 = require('web3');
const web3 = new Web3(
    //specify web socket provider with infura address
    //keep yout infura secret
    new Web3.providers.WebsocketProvider(process.env.INFURA_URL)
    );