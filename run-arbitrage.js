//load variable to read infura keys
require('dotenv').config();
const Web3 = require('web3');
const abis = require('./abis');
const {mainnet: addresses } = require('./addresses');

const web3 = new Web3(
    //specify web socket provider with infura address
    //keep yout infura secret
    new Web3.providers.WebsocketProvider(process.env.INFURA_URL)
    );
//connexion to kyber
//with kyber object, we can communicate with the kyber smart contract
const kyber = new web3.eth.Contract(
    //provide abi of kyber
    abis.kyber.kyberNetworkProxy,
    addresses.kyber.kyberNetworkProxy
);
//if buy lot of tokens, the price will be worth : slippage
//we can improve the script by update the amounts regularly
const AMOUNT_ETH = 100;
const RECENT_ETH_PRICE = 230;
const AMOUNT_ETH_WEI = web3.utils.toWei(AMOUNT_ETH.toString());//1 eth = 10^18 wei
const AMOUNT_DAI_WEI = web3.utils.toWei((AMOUNT_ETH * RECENT_ETH_PRICE).toString());

//receive new blocks
//reevaluate oppurtunities everytime in the new block
//block will emit data
web3.eth.subscribe('newBlockHeaders')
    .on('data', async block => {
        console.log(`New block received. Block # ${block.number}`);
        const kyberResults = await Promise.all([
            kyber.methods
            .getExpectedRate(
                addresses.tokens.dai,
                //this give us the price of ether if we pay with DAI
                '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                //puth the amount of dai we want to sell
            AMOUNT_DAI_WEI
          ) 
          .call(),//execute and send the request to the network : don't cost anything
        kyber
          .methods
          .getExpectedRate(//from ether to DAI
            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', 
            addresses.tokens.dai, 
            AMOUNT_ETH_WEI
          ) 
          .call()
        ]);
        console.log(kyberResults);
    })
    .on('error', error => {console.log(error);//if error    
    });

    //poll prices on the kyber exchange everytime we receive a block
    //connexion to a smart contract of kyber and after call a function
    //to get a specific price of the market

    

    
