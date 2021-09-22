//load variable to read infura keys
require('dotenv').config();
const Web3 = require('web3');
const web3 = new Web3(
    //specify web socket provider with infura address
    //keep yout infura secret
    new Web3.providers.WebsocketProvider(process.env.INFURA_URL)
    );
//receive new blocks
//reevaluate oppurtunities everytime in the new block
//block will emit data
web3.eth.subscribe('newBlockHeaders')
    .on('data', async block => {
        console.log(`New block received. Block # ${block.number}`);
    })
    .on('error', error => {console.log(error);//if error    
    });
    
