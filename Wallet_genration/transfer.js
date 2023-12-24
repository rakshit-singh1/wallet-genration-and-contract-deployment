const {Web3} = require('web3');
const dotenv = require('dotenv');
require('dotenv').config();
const web3 = new Web3(new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/9ca1af07007a4463b2a3a3bacb7cafc6'));
const my_address={
    address: '0x668425484835D082D11e3A83b97D47705Ef6ACA4',
    privateKey: '0xd49d737f92f3383694c3951a7d209ea6725f3c29963810cfc23cd4fa8a4b6724',
}
const genrated_address_1={
    address: '0x4770d1530562bA457912Bd75F6e5917874f9010F',
    privateKey: '0x44abeded55b4ad8e2cf660296e6cfa20fb08caa93cdf86d3ad18c980dc3cae9e',
}
  const genrated_address_2={
    address: '0xeF44AD0F43680DD9019876cf992988448CF6D2b7',
    privateKey: '0x02a850c0c292ed9d1ff34740084f33f74a4097989c912b08366da27ec97ce87a',
}

async function eth_transfer() {
    try {
        const gasPrice = await web3.eth.getGasPrice();
        console.log("Gas Price:", gasPrice);
    
        const transactionObject = {
          from: my_address.address,
          to: genrated_address_1.address,
          gas: 200000,
          gasPrice: gasPrice,
          value: web3.utils.toWei("0.001", "ether"),
        };
    
        const signedTransaction = await web3.eth.accounts.signTransaction(
          transactionObject,
          my_address.privateKey
        );
    
        console.log("signedTransaction: ", signedTransaction);
    
        const transactionReceipt = await web3.eth.sendSignedTransaction(
          signedTransaction.rawTransaction
        );
        console.log("Transaction Receipt:", transactionReceipt);
      } catch (error) {
        console.log(error);
      }
}

eth_transfer();