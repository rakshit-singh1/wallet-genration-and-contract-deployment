const express = require("express");
const fs = require("fs");
const { Web3 } = require("web3");
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = 3000; // Choose a port number

app.use(express.json());

const { abi } = JSON.parse(fs.readFileSync("demo.json"));

app.post("/store", async (req, res) => {
  try {
    const web3 = new Web3(
      new Web3.providers.HttpProvider(
        `https://${process.env.network}.infura.io/v3/${process.env.INFURA_API_KEY}`,
      ),
    );

    const signer = web3.eth.accounts.privateKeyToAccount(
      req.body.privatekey,
    );
    web3.eth.accounts.wallet.add(signer);

    const contract = new web3.eth.Contract(
      abi,
      req.body.contractAddress,
    );

    const valueToStore = req.body.value; // Assuming you pass the value to store in the request body

    const methodAbi = contract.methods.store(valueToStore).encodeABI();
    const tx = {
      from: signer.address,
      to: contract.options.address,
      data: methodAbi,
      value: '0',
      gasPrice: '235895781779',
    };

    const gasEstimate = await web3.eth.estimateGas(tx);
    tx.gas = gasEstimate;

    const signedTx = await web3.eth.accounts.signTransaction(tx, signer.privateKey);
    console.log("Raw transaction data: " + signedTx.rawTransaction);

    const receipt = await web3.eth
      .sendSignedTransaction(signedTx.rawTransaction)
      .once("transactionHash", (txhash) => {
        console.log(`Mining transaction ...`);
        console.log(`https://${process.env.network}.etherscan.io/tx/${txhash}`);
      });

    console.log(`Transaction mined in block ${receipt.blockNumber}`);
    
    res.status(200).json({
      message: "Transaction successful",
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
    });
  } catch (error) {
    console.error("Error during transaction:", error);
    res.status(500).json({ error: "Transaction failed", message: error.message });
  }
});

app.listen(port, () => {
  console.log(`API server is running on http://localhost:${port}`);
});
