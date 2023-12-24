const express = require('express');
const bodyParser = require('body-parser');
const { Web3 } = require('web3');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 3000; // Set your desired port

app.use(bodyParser.json());

const web3 = new Web3(new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/9ca1af07007a4463b2a3a3bacb7cafc6'));

app.post('/transfer', async (req, res) => {
  const { toAddress } = req.body;
  try {
    const gasPrice = await web3.eth.getGasPrice();
    console.log("Gas Price:", gasPrice);

    const transactionObject = {
      from: process.env.address,
      to: toAddress,
      gas: 200000,
      gasPrice: gasPrice,
      value: web3.utils.toWei("0.1", "ether"),
    };

    const signedTransaction = await web3.eth.accounts.signTransaction(
      transactionObject,
      process.env.privateKey
    );

    console.log("signedTransaction: ", signedTransaction);

    const transactionReceipt = await web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction
    );
    console.log("Balance of account:", balanceWei = await web3.eth.getBalance(accountAddress));
    res.status(500).json(transactionReceipt);
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
