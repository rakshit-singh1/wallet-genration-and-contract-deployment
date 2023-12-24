const express = require("express");
const fs = require("fs");
const { Web3 } = require("web3");
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 3000; // Choose a port number

app.use(express.json());

// Your compile function here...

const { abi, bytecode } = JSON.parse(fs.readFileSync("demo.json"));

app.post("/deploy", async (req, res) => {
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

    const contract = new web3.eth.Contract(abi);
    contract.options.data = bytecode;
    const deployTx = contract.deploy();
    const deployedContract = await deployTx
      .send({
        from: signer.address,
        gas: await deployTx.estimateGas(),
      })
      .once("transactionHash", (txhash) => {
        console.log(`Mining deployment transaction ...`);
        console.log(`https://${network}.etherscan.io/tx/${txhash}`);
      });

    res.status(200).json({
      message: "Contract deployed successfully",
      contractAddress: deployedContract.options.address,
    });
  } catch (error) {
    console.error("Error during deployment:", error);
    res.status(500).json({ error: "Deployment failed", message: error.message });
  }
});

app.listen(port, () => {
  console.log(`API server is running on http://localhost:${port}`);
});
