const { Web3 } = require("web3");

const network = process.env.ETHEREUM_NETWORK;
const web3 = new Web3(
    new Web3.providers.HttpProvider(
    `https://sepolia.infura.io/v3/9ca1af07007a4463b2a3a3bacb7cafc6`,
    ),
);
const walletAddress = '0x4770d1530562bA457912Bd75F6e5917874f9010F';
web3.eth.getTransactionCount(walletAddress)
.then(transactions => {
    console.log('Transactions:', transactions);
})
.catch(error => {
    console.error('Error getting transactions:', error);
});

const axios = require('axios');

// Specify the filter criteria
const filter = {
    fromBlock: '0x0',
    address: '0x4770d1530562bA457912Bd75F6e5917874f9010',
};

// Build the JSON-RPC payload
const rpcPayload = {
    jsonrpc: '2.0',
    method: 'eth_getLogs',
    params: [filter],
    id: 1,
};
